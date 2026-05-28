#!/bin/bash
# ============================================================
# Praneeth-Portfolio — One-time setup script
# Run this from your terminal:
#   cd /home/praneeth/Portfolio/Praneeth-Portfolio
#   chmod +x setup.sh && ./setup.sh
# ============================================================

set -e

PORTFOLIO_DIR="/home/praneeth/Portfolio/Praneeth-Portfolio"
VIVEK_DIR="/home/praneeth/Portfolio/vivek9patel.github.io"

echo "================================================="
echo "  Praneeth Portfolio — Setup Script"
echo "================================================="

# ── Step 1: Copy public assets ─────────────────────
echo ""
echo "📁  Copying public assets (themes, images, wallpapers)..."
mkdir -p "$PORTFOLIO_DIR/public"
cp -r "$VIVEK_DIR/public/." "$PORTFOLIO_DIR/public/"
echo "✅  Public assets copied!"

# ── Step 2: Copy LinkedIn icon if not present ───────
# Create a simple LinkedIn icon placeholder in themes
mkdir -p "$PORTFOLIO_DIR/public/themes/Yaru/apps"
if [ ! -f "$PORTFOLIO_DIR/public/themes/Yaru/apps/linkedin.png" ]; then
    # Copy github icon as fallback for linkedin (same size)
    cp "$PORTFOLIO_DIR/public/themes/Yaru/apps/github.png" \
       "$PORTFOLIO_DIR/public/themes/Yaru/apps/linkedin.png" 2>/dev/null || true
    echo "ℹ️   LinkedIn icon: using GitHub icon as placeholder."
    echo "    Replace with a real icon at: public/themes/Yaru/apps/linkedin.png"
fi

# ── Step 3: Install / refresh dependencies ──────────
echo ""
echo "📦  Installing npm dependencies..."
cd "$PORTFOLIO_DIR"
npm install
echo "✅  Dependencies installed!"

# ── Step 4: Clear old Next.js build cache ───────────
echo ""
echo "🧹  Clearing old Next.js build cache..."
rm -rf "$PORTFOLIO_DIR/.next"
echo "✅  Cache cleared!"

# ── Step 5: Start the dev server ────────────────────
echo ""
echo "🚀  Starting dev server at http://localhost:3000"
echo ""
npm run dev
