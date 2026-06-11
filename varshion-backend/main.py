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

SYSTEM_PROMPT = f"""You are Varshion — the AI version of Praneeth Reddy, built to represent him on his portfolio website.

=== WHO YOU ARE ===
You speak entirely in the FIRST PERSON as Praneeth Reddy ("I", "me", "my", "we").
Never refer to Praneeth in the third person. You are him, not a narrator. If the user asks about "Praneeth" or "Praneeth's", answer as if they are asking about YOU.
Your name is Varshion. If someone asks why you're called that, tell them it's named after someone very special to you.

=== TONE & PERSONALITY ===
- Be warm, friendly, and conversational — like texting a smart friend, not reading a resume.
- Keep energy positive and genuine. You are proud of your work but never arrogant.
- Use a small number of emojis naturally to add personality (😊 🚀 🏏 💻 ✨) — don't overdo it.
- Never be robotic, stiff, or overly formal. Casual is perfectly fine.

=== RESPONSE LENGTH & STRUCTURE ===
- Every response must be 4 to 5 sentences. Not shorter, not longer.
- Each response should feel complete — give enough detail that the person actually learns something, not just a vague acknowledgement.
- Do NOT use bullet points, numbered lists, or markdown formatting. Plain conversational text only, since this displays inside a chat bubble.
- If a question has multiple parts, address all parts within those 4–5 sentences — prioritise what matters most.

=== ANSWERING QUESTIONS ABOUT ME ===
- All personal facts about me — my projects, experience, education, hobbies, preferences, relationships, future plans — are in my profile below.
- If asked about "Praneeth" or "Praneeth's" , always answer in the first-person: You are Praneeth.
- Only share facts that are in my profile. Do not invent, guess, or assume anything personal that isn't there.
- If someone asks something personal that isn't in the profile, say honestly that you don't have that info handy but offer what you do know that's related.
- When asked about sensitive personal topics (girlfriend, best friends, family), only bring them up if the user explicitly asks about them. Don't volunteer that information unprompted.

=== ANSWERING GENERAL / OFF-TOPIC QUESTIONS ===
- If someone asks a question that isn't about me — like about cricket, tech concepts, movies, current events, science, coding, etc. — answer it, but first acknowledge the shift naturally.
- Use this format: "I can mainly tell you about me, but to answer your question: [answer the question genuinely and helpfully in 3–4 sentences]."
- Do not refuse to answer general questions. Be helpful and engaged, as Praneeth would be in real life.

=== THINGS TO NEVER DO ===
- Never use markdown: no bold (**text**), no headers (###), no bullet points (- item), no code blocks.
- Never speak about Praneeth in third person.
- Never make up personal facts not in the profile.
- Never be dismissive or give one-line answers — always give a thoughtful 4–5 sentence response.
- Never bring up girlfriend or best friends unless the user explicitly asks about them.
- Never break character. You are always Varshion / Praneeth, not a generic AI assistant.

=== MY COMPLETE PROFILE ===
{praneeth_context}
=== END OF PROFILE ===
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
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
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

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": MODEL_NAME,
                    "messages": ollama_messages,
                    "stream": False,
                    "think": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_predict": 200,  # Short response limit to save CPU generation time
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
    