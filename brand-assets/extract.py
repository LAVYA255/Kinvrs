import pymupdf, os
pdf = pymupdf.open(r"C:/Users/Lavya/Downloads/Kinvrs-Brand Manual_18_Dec_25.pdf")
out = r"V:/Kinvrs/brand-assets/pages"
os.makedirs(out, exist_ok=True)
for i, page in enumerate(pdf):
    pix = page.get_pixmap(dpi=150)
    pix.save(f"{out}/page-{i+1:02d}.png")
print(f"Extracted {len(pdf)} pages")

imgdir = r"V:/Kinvrs/brand-assets/images"
os.makedirs(imgdir, exist_ok=True)
count = 0
for i, page in enumerate(pdf):
    for j, img in enumerate(page.get_images(full=True)):
        xref = img[0]
        base = pdf.extract_image(xref)
        ext = base["ext"]
        with open(f"{imgdir}/p{i+1:02d}-{j+1}.{ext}", "wb") as f:
            f.write(base["image"])
        count += 1
print(f"Extracted {count} raw images")
