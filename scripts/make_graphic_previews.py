from pathlib import Path
from PIL import Image

source_dir = Path("public/assets/creations/graphic")
output_dir = source_dir / "previews"
output_dir.mkdir(parents=True, exist_ok=True)

for source in sorted(source_dir.iterdir()):
    if not source.is_file() or source.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue
    image = Image.open(source).convert("RGB")
    width, height = image.size
    side = min(width, height)
    left = (width - side) // 2
    top = (height - side) // 2
    image = image.crop((left, top, left + side, top + side))
    image = image.resize((900, 900), Image.Resampling.LANCZOS)
    target = output_dir / f"{source.stem}.webp"
    image.save(target, "WEBP", quality=75, method=6)
    print(f"{source.name}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes")
