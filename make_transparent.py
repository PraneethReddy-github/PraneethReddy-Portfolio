from PIL import Image

def clean_icon(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    # We want to replace the checkerboard background.
    # The checkerboard is white/grey. The tile or logo is orange/red.
    # We can detect if a pixel is a shade of grey/white (where R, G, B are close to each other or all > 200).
    # Since our orange tile has high R, moderate G, low B (orange), and Doom has high R, low G, low B (red),
    # grey pixels have R ~= G ~= B.
    newData = []
    for item in data:
        r, g, b, a = item
        # If R, G, B are close to each other (i.e. grey scale) and it's not part of the logo/tile shadow
        # or if it's very white.
        is_grey = abs(r - g) < 15 and abs(g - b) < 15 and abs(r - b) < 15
        if is_grey or (r > 200 and g > 200 and b > 200):
            newData.append((0, 0, 0, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

# Process Doom logo
clean_icon(
    "/home/praneeth/.gemini/antigravity/brain/cde26ae2-aa58-4b3d-8be1-1609508fc8a7/doom_logo_icon_1779822303850.png",
    "/home/praneeth/Portfolio/Praneeth-Portfolio/public/themes/Yaru/apps/doom.png"
)

# Process 2048 icon
clean_icon(
    "/home/praneeth/.gemini/antigravity/brain/cde26ae2-aa58-4b3d-8be1-1609508fc8a7/game_2048_icon_1779822325549.png",
    "/home/praneeth/Portfolio/Praneeth-Portfolio/public/themes/Yaru/apps/game2048.png"
)
print("Icons processed successfully!")
