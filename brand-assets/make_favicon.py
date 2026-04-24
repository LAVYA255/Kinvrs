from PIL import Image
import os

src = r"V:/Kinvrs/public/logos/mark-color.png"
img = Image.open(src).convert("RGBA")

# Pad to square with rich-black rounded bg
size = 512
canvas = Image.new("RGBA", (size, size), (4, 2, 35, 255))
# Scale mark to fit with 15% padding
pad = int(size * 0.15)
inner = size - pad * 2
ratio = min(inner / img.width, inner / img.height)
new_size = (int(img.width * ratio), int(img.height * ratio))
mark = img.resize(new_size, Image.LANCZOS)
offset = ((size - new_size[0]) // 2, (size - new_size[1]) // 2)
canvas.paste(mark, offset, mark)

# Rounded corners
from PIL import ImageDraw
mask = Image.new("L", (size, size), 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle((0, 0, size, size), radius=96, fill=255)
canvas.putalpha(mask)

out = r"V:/Kinvrs/public/favicon.png"
canvas.save(out)
# Also a 32x32 ico-ish
small = canvas.resize((180, 180), Image.LANCZOS)
small.save(r"V:/Kinvrs/public/apple-touch-icon.png")
print("wrote favicon.png + apple-touch-icon.png")
