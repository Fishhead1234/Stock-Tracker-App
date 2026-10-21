#!/usr/bin/env python3
import os
import subprocess
import struct
import zlib
import math

SOURCE_IMG = "/Users/claw/.gemini/antigravity-ide/brain/959cf653-6523-46c8-a5fe-1555fb48f042/investlearn_logo_minimal_vector_1792552446813.jpg"
RES_DIR = "/Users/claw/.gemini/antigravity-ide/scratch/stock-learning-app/android/app/src/main/res"
PUBLIC_DIR = "/Users/claw/.gemini/antigravity-ide/scratch/stock-learning-app/public"

def write_png(filename, width, height, rgba_data):
    def chunk(chunk_type, data):
        return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", zlib.crc32(chunk_type + data) & 0xffffffff)

    raw = bytearray()
    for y in range(height):
        raw.append(0) # filter type 0
        raw.extend(rgba_data[y * width * 4 : (y + 1) * width * 4])
    
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")
    with open(filename, "wb") as f:
        f.write(png)

def resize_sips(src, dst, w, h):
    subprocess.run(["sips", "-s", "format", "png", "-z", str(h), str(w), src, "--out", dst], check=True, stdout=subprocess.DEVNULL)

def make_round_icon(src_png, dst_png, size):
    # Convert src_png to bmp to read raw pixels easily
    tmp_bmp = dst_png + ".tmp.bmp"
    subprocess.run(["sips", "-s", "format", "bmp", src_png, "--out", tmp_bmp], check=True, stdout=subprocess.DEVNULL)
    with open(tmp_bmp, "rb") as f:
        f.seek(18)
        w, h = struct.unpack("<ii", f.read(8))
        abs_h = abs(h)
        f.seek(54)
        pad = (4 - (w * 3) % 4) % 4
        rows = []
        for _ in range(abs_h):
            row = []
            for _ in range(w):
                b, g, r = f.read(3)
                row.append((r, g, b))
            if pad: f.read(pad)
            rows.append(row)
    if os.path.exists(tmp_bmp):
        os.remove(tmp_bmp)
    
    # If height was positive, rows are bottom-up
    if h > 0:
        rows.reverse()
    
    cx, cy = (size - 1) / 2.0, (size - 1) / 2.0
    radius = (size - 1) / 2.0
    
    rgba = bytearray()
    for y in range(size):
        for x in range(size):
            r, g, b = rows[y][x]
            dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            if dist <= radius - 0.75:
                alpha = 255
            elif dist > radius + 0.75:
                alpha = 0
            else:
                # Antialias edge
                alpha = int(255 * (1.0 - (dist - (radius - 0.75)) / 1.5))
                alpha = max(0, min(255, alpha))
            
            rgba.extend([r, g, b, alpha])
    
    write_png(dst_png, size, size, bytes(rgba))

def main():
    print("Generating InvestLearn app icons from Option 2 logo...")

    # Mipmap configurations
    configs = [
        ("mipmap-mdpi", 48, 108),
        ("mipmap-hdpi", 72, 162),
        ("mipmap-xhdpi", 96, 216),
        ("mipmap-xxhdpi", 144, 324),
        ("mipmap-xxxhdpi", 192, 432),
    ]

    for folder, icon_size, fg_size in configs:
        target_dir = os.path.join(RES_DIR, folder)
        os.makedirs(target_dir, exist_ok=True)
        
        # 1. Standard ic_launcher.png
        launcher_path = os.path.join(target_dir, "ic_launcher.png")
        resize_sips(SOURCE_IMG, launcher_path, icon_size, icon_size)
        print(f"Generated {launcher_path} ({icon_size}x{icon_size})")

        # 2. Round ic_launcher_round.png
        round_path = os.path.join(target_dir, "ic_launcher_round.png")
        make_round_icon(launcher_path, round_path, icon_size)
        print(f"Generated {round_path} ({icon_size}x{icon_size} circular)")

        # 3. Foreground ic_launcher_foreground.png
        fg_path = os.path.join(target_dir, "ic_launcher_foreground.png")
        resize_sips(SOURCE_IMG, fg_path, fg_size, fg_size)
        print(f"Generated {fg_path} ({fg_size}x{fg_size})")

    # Generate public web assets
    logo_512 = os.path.join(PUBLIC_DIR, "logo.png")
    resize_sips(SOURCE_IMG, logo_512, 512, 512)
    print(f"Generated {logo_512} (512x512)")

    favicon_png = os.path.join(PUBLIC_DIR, "favicon.png")
    resize_sips(SOURCE_IMG, favicon_png, 64, 64)
    print(f"Generated {favicon_png} (64x64)")

    print("All image assets generated successfully!")

if __name__ == "__main__":
    main()
