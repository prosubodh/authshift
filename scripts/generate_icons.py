import os
from PIL import Image, ImageDraw

os.makedirs('public/icons', exist_ok=True)

# Generate icon for 16, 48, 128
for size in [16, 48, 128]:
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    margin = max(1, size // 16)
    
    # Modern rounded squircle background (deep indigo/violet)
    corner_radius = max(2, size // 4)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=corner_radius,
        fill='#4F46E5',  # Indigo 600
        outline='#6366F1' if size > 16 else None, # Indigo 500 border
        width=max(1, size // 32)
    )
    
    # Draw a stylized "A" or "Shift / Key" symbol
    # Let's draw a sleek dual-shift arrow symbol (representing Auth + Shift)
    w = size
    mid_x = w / 2
    mid_y = w / 2
    stroke_w = max(1, size // 10)
    
    if size == 16:
        # Simple high contrast 'A' for 16x16
        draw.line([(5, 12), (8, 4)], fill='#FFFFFF', width=2)
        draw.line([(8, 4), (11, 12)], fill='#FFFFFF', width=2)
        draw.line([(6, 9), (10, 9)], fill='#38BDF8', width=1) # cyan accent bar
    else:
        # Elegant shift chevrons / auth badge for 48 and 128
        scale = size / 128.0
        # Upper chevron
        p1 = (mid_x, 28 * scale)
        p2 = (mid_x - 30 * scale, 58 * scale)
        p3 = (mid_x + 30 * scale, 58 * scale)
        draw.line([p2, p1, p3], fill='#FFFFFF', width=int(10 * scale), joint='curve')
        
        # Lower chevron with cyan accent
        p4 = (mid_x, 58 * scale)
        p5 = (mid_x - 30 * scale, 88 * scale)
        p6 = (mid_x + 30 * scale, 88 * scale)
        draw.line([p5, p4, p6], fill='#38BDF8', width=int(10 * scale), joint='curve')
        
        # Center keyhole dot
        dot_r = int(5 * scale)
        draw.ellipse([mid_x - dot_r, 96 * scale - dot_r, mid_x + dot_r, 96 * scale + dot_r], fill='#FFFFFF')

    img.save(f'public/icons/icon-{size}.png', 'PNG')
    print(f'Generated public/icons/icon-{size}.png ({size}x{size})')
