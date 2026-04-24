from PIL import Image
import os

src_dir = r"V:/Kinvrs/public/logos"

# Source files
full_color = Image.open(os.path.join(src_dir, "kinvrs-color.png")).convert("RGBA")
full_black = Image.open(os.path.join(src_dir, "kinvrs-black.png")).convert("RGBA")
mark_color = Image.open(os.path.join(src_dir, "mark-color.png")).convert("RGBA")
mark_black = Image.open(os.path.join(src_dir, "mark-black.png")).convert("RGBA")

def resize_to_width(img, width):
    ratio = width / img.width
    return img.resize((width, int(img.height * ratio)), Image.LANCZOS)

# Responsive wordmark sizes
for w in [320, 640, 960]:
    resize_to_width(full_color, w).save(os.path.join(src_dir, f"kinvrs-color-{w}w.png"), optimize=True)
    resize_to_width(full_black, w).save(os.path.join(src_dir, f"kinvrs-black-{w}w.png"), optimize=True)

# Responsive mark sizes
for w in [128, 256, 512]:
    resize_to_width(mark_color, w).save(os.path.join(src_dir, f"mark-color-{w}w.png"), optimize=True)
    resize_to_width(mark_black, w).save(os.path.join(src_dir, f"mark-black-{w}w.png"), optimize=True)

# Re-compress originals
full_color.save(os.path.join(src_dir, "kinvrs-color.png"), optimize=True)
full_black.save(os.path.join(src_dir, "kinvrs-black.png"), optimize=True)
mark_color.save(os.path.join(src_dir, "mark-color.png"), optimize=True)

# Remove white derivatives (we'll use CSS filter on black instead)
for f in ["kinvrs-white.png", "mark-white.png", "mark-black.png"]:
    p = os.path.join(src_dir, f)
    if os.path.exists(p):
        pass  # keep for backward compat

print("done")
print("Sizes:")
for f in sorted(os.listdir(src_dir)):
    p = os.path.join(src_dir, f)
    print(f"  {f}: {os.path.getsize(p)//1024} KB")
