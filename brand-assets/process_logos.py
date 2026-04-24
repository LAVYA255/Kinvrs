from PIL import Image
import os

src_dir = r"V:/Kinvrs/public/logos"
color = Image.open(os.path.join(src_dir, "IMG_4215.png")).convert("RGBA")
black = Image.open(os.path.join(src_dir, "image (2).png")).convert("RGBA")

print("color:", color.size)
print("black:", black.size)

# Save canonical names
color.save(os.path.join(src_dir, "kinvrs-color.png"))
black.save(os.path.join(src_dir, "kinvrs-black.png"))

# Find bounding box of black logo content (non-white pixels)
bbox_black = black.getbbox()
print("black bbox:", bbox_black)

# Make WHITE variant from black: invert the black pixels to white, keep alpha from darkness
def to_white(img):
    px = img.load()
    w, h = img.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            # darkness -> alpha
            darkness = 255 - min(r, g, b)
            if darkness > 20 and a > 0:
                op[x, y] = (255, 255, 255, int(darkness * (a / 255)))
    return out

white = to_white(black)
white.save(os.path.join(src_dir, "kinvrs-white.png"))

# Crop the K mark from the black version. Detect where K ends.
# Scan columns for a big gap (all transparent/white) after the mark.
def find_mark_end(img):
    px = img.load()
    w, h = img.size
    in_mark = False
    last_ink = 0
    for x in range(w):
        col_has_ink = False
        for y in range(h):
            r, g, b, a = px[x, y]
            darkness = 255 - min(r, g, b)
            if a > 10 and darkness > 20:
                col_has_ink = True
                break
        if col_has_ink:
            last_ink = x
            in_mark = True
        else:
            if in_mark and x - last_ink > 60:  # gap of 60px means mark ended
                return last_ink + 1
    return last_ink + 1

mark_end_x = find_mark_end(black)
print("mark ends at x:", mark_end_x)

# Crop mark from color and black and white versions
def crop_mark(img, end_x):
    bbox = img.getbbox()
    if not bbox:
        return img
    top, bottom = bbox[1], bbox[3]
    return img.crop((bbox[0], top, end_x, bottom))

mark_color = crop_mark(color, mark_end_x)
mark_black = crop_mark(black, mark_end_x)
mark_white = crop_mark(white, mark_end_x)

mark_color.save(os.path.join(src_dir, "mark-color.png"))
mark_black.save(os.path.join(src_dir, "mark-black.png"))
mark_white.save(os.path.join(src_dir, "mark-white.png"))

print("done")
print("mark sizes:", mark_color.size, mark_black.size, mark_white.size)
