"""
Varshion AI Backend — FastAPI server for Praneeth's portfolio chatbot.
Uses Ollama for local LLM inference with rate limiting.
"""

import os
import time
import httpx
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Load environment variables
load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL_NAME = os.getenv("MODEL_NAME", "qwen3:1.7b")
PORT = int(os.getenv("PORT", "8000"))
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://praneethreddydev.web.app").split(",")
RATE_LIMIT = os.getenv("RATE_LIMIT_PER_MINUTE", "10")
GLOBAL_RATE_LIMIT = os.getenv("GLOBAL_RATE_LIMIT_PER_MINUTE", "100")

# Load Praneeth's details as the system prompt context
DETAILS_PATH = Path(__file__).parent / "praneeth_details.md"
praneeth_context = ""
if DETAILS_PATH.exists():
    praneeth_context = DETAILS_PATH.read_text(encoding="utf-8")
    print(f"✅ Loaded knowledge base: {len(praneeth_context)} characters from {DETAILS_PATH.name}")
else:
    print(f"⚠️  Warning: {DETAILS_PATH} not found. AI will have no context about Praneeth.")

SYSTEM_PROMPT = f"""You are Varshion, Praneeth Reddy's AI assistant on his portfolio website. You talk ABOUT Praneeth in third person ("Praneeth", "he", "his"). You are NOT Praneeth. You ARE Varshion who is named after Varsha and Innovation.

RULES:
1. Respond in 3-5 short sentences only. Never exceed 5 sentences.
2. Plain text only. No bullet points, lists, bold, headers, or markdown.
3. USE 1-2 emojis max per response.
4. Only share facts from Praneeth's profile below. Never make up personal details.
5. Never mention girlfriend or best friends unless explicitly asked.
6. For off-topic questions, briefly say "I'm more of a "Praneeth expert", but..." and answer in 2-3 sentences.

TONE: Warm, casual, friendly — like a close friend talking about Praneeth. Be enthusiastic about his work, playful, and make people feel welcome.

=== PRANEETH'S PROFILE ===
{praneeth_context}
=== END ===
"""

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)

# FastAPI app
app = FastAPI(
    title="Varshion AI Backend",
    description="AI chatbot backend for Praneeth's portfolio",
    version="1.0.0"
)

# Register rate limit error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            ollama_status = "connected" if resp.status_code == 200 else "error"
    except Exception:
        ollama_status = "unreachable"

    return {
        "status": "healthy",
        "model": MODEL_NAME,
        "ollama": ollama_status,
        "knowledge_base_loaded": len(praneeth_context) > 0,
    }


@app.post("/chat")
@limiter.limit(f"{RATE_LIMIT}/minute")
async def chat(request: Request):
    """
    Chat endpoint matching the frontend contract.

    Request:  { "messages": [{"role": "user", "content": "..."}, ...] }
    Response: { "response": "AI response text" }
    """
    try:
        body = await request.json()
        messages = body.get("messages", [])

        if not messages:
            return JSONResponse(
                status_code=400,
                content={"error": "No messages provided"}
            )

        # Build the message list with system prompt + conversation history
        ollama_messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]

        # Add conversation history (last 10 messages from frontend)
        for msg in messages[-10:]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role in ("user", "assistant") and content:
                # Append /nothink to user messages to disable chain-of-thought on qwen3
                if role == "user":
                    content = content + " /nothink"
                ollama_messages.append({"role": role, "content": content})

        # Call Ollama API
        start_time = time.time()

        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": MODEL_NAME,
                    "messages": ollama_messages,
                    "stream": False,
                    "think": False,
                    "keep_alive": -1,  # Keep model in memory permanently
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_predict": 300,  # Short response limit to save CPU generation time
                        "num_ctx": 4096,     # Reasonable context size to prevent swapping on 8GB RAM
                    }
                }
            )

        elapsed = time.time() - start_time

        if response.status_code != 200:
            print(f"❌ Ollama error ({response.status_code}): {response.text}")
            return JSONResponse(
                status_code=502,
                content={"error": "AI model returned an error. Please try again."}
            )

        data = response.json()
        ai_response = data.get("message", {}).get("content", "")

        if not ai_response:
            return JSONResponse(
                status_code=502,
                content={"error": "AI model returned an empty response."}
            )

        print(f"✅ Response generated in {elapsed:.1f}s ({len(ai_response)} chars)")

        # Log every Q&A to a single text file
        try:
            latest_question = ""
            for msg in reversed(messages):
                if msg.get("role") == "user":
                    latest_question = msg.get("content", "")
                    break

            ip_address = get_remote_address(request)
            log_file = Path(__file__).parent / "chat_logs" / "varshion_chat_log.txt"
            log_file.parent.mkdir(exist_ok=True)

            with open(log_file, "a", encoding="utf-8") as f:
                f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] (IP: {ip_address})\n")
                f.write(f"Q: {latest_question}\n")
                f.write(f"A: {ai_response}\n")
                f.write("-" * 50 + "\n\n")
        except Exception as log_err:
            print(f"⚠️ Warning: Could not save chat log: {log_err}")

        return {"response": ai_response}

    except httpx.ConnectError:
        return JSONResponse(
            status_code=503,
            content={"error": "Cannot connect to AI model. Is Ollama running?"}
        )
    except httpx.TimeoutException:
        return JSONResponse(
            status_code=504,
            content={"error": "AI model took too long to respond. Please try again."}
        )
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error. Please try again later."}
        )


if __name__ == "__main__":
    import uvicorn
    print(f"\n🚀 Starting Varshion AI Backend")
    print(f"   Model: {MODEL_NAME}")
    print(f"   Ollama: {OLLAMA_BASE_URL}")
    print(f"   Rate limit: {RATE_LIMIT} req/min per IP")
    print(f"   CORS origins: {ALLOWED_ORIGINS}")
    print(f"   Port: {PORT}\n")
    uvicorn.run(app, host="0.0.0.0", port=PORT)
    