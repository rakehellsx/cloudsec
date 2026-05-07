from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

src = Path('/home/ubuntu/webdev-static-assets/cloud-source/cloud')
out_dir = Path('/home/ubuntu/cloud-traffic-security/material-review')
out_dir.mkdir(parents=True, exist_ok=True)
files = sorted([p for p in src.iterdir() if p.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp'}], key=lambda p: p.name)

try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
    small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
except Exception:
    font = ImageFont.load_default()
    small = ImageFont.load_default()

thumb_w, thumb_h = 430, 242
label_h = 66
cols = 3
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * thumb_w, rows * (thumb_h + label_h)), 'white')
draw = ImageDraw.Draw(sheet)

index_lines = []
for idx, p in enumerate(files, 1):
    img = Image.open(p).convert('RGB')
    img.thumbnail((thumb_w - 24, thumb_h - 18), Image.LANCZOS)
    x = (idx - 1) % cols * thumb_w
    y = (idx - 1) // cols * (thumb_h + label_h)
    bg = Image.new('RGB', (thumb_w, thumb_h + label_h), '#f7faff')
    sheet.paste(bg, (x, y))
    ix = x + (thumb_w - img.width) // 2
    iy = y + 10
    sheet.paste(img, (ix, iy))
    draw.rectangle([x + 6, y + 6, x + thumb_w - 7, y + thumb_h - 7], outline='#d8e2ef', width=2)
    label = f'{idx:02d}. {p.name}'
    draw.text((x + 14, y + thumb_h + 10), label, fill='#14204b', font=small)
    index_lines.append(f'{idx:02d}\t{p.name}\t{p.width if False else ""}')

sheet.save(out_dir / 'all-screens-contact-sheet.png', quality=95)
(out_dir / 'image-index.txt').write_text('\n'.join(f'{i+1:02d}. {p.name}' for i, p in enumerate(files)) + '\n', encoding='utf-8')
print(out_dir / 'all-screens-contact-sheet.png')
print(out_dir / 'image-index.txt')
