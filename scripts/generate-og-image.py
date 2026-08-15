#!/usr/bin/env python3
"""生成 Open Graph 分享图（1200x630 PNG）到 public/og-image.png"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
BG = (28, 25, 23)        # #1C1917 深棕黑
FG = (250, 250, 249)     # #FAFAF9 暖白
ACCENT = (255, 107, 53)  # 橙色强调
MUTED = (168, 162, 158)  # #A8A29E

FONT_DIRS = [
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/STHeiti Light.ttc',
    '/System/Library/Fonts/Hiragino Sans GB.ttc',
]

def load_font(size):
    for path in FONT_DIRS:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()

img = Image.new('RGB', (W, H), BG)
draw = ImageDraw.Draw(img)

# 装饰：左侧橙色竖线
draw.rectangle([80, 0, 84, H], fill=ACCENT)

# 姓名
font_name = load_font(96)
draw.text((140, 200), '侯伟轩', font=font_name, fill=FG)

# 职位
font_title = load_font(44)
draw.text((144, 340), 'AI应用工程师', font=font_title, fill=MUTED)

# 底部小字
font_foot = load_font(28)
draw.text((144, 520), 'LangChain · RAG · Dify · AI Agent · MCP', font=font_foot, fill=MUTED)

os.makedirs('public', exist_ok=True)
img.save('public/og-image.png', 'PNG')
print('已生成 public/og-image.png')
