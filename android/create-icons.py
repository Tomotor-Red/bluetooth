from PIL import Image, ImageDraw, ImageFont
import os

# 创建不同尺寸的图标
sizes = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192,
}

# 创建图标
for dpi, size in sizes.items():
    img = Image.new('RGBA', (size, size), (26, 115, 232, 255))
    draw = ImageDraw.Draw(img)

    # 绘制蓝牙标志
    margin = size // 8
    line_width = size // 16

    # 垂直线
    draw.line([(margin + size//3, margin), (margin + size//3, size - margin)], fill='white', width=line_width)
    draw.line([(margin + size*2//3, margin), (margin + size*2//3, size - margin)], fill='white', width=line_width)

    # 斜线
    draw.line([(margin + size//3, size//3), (margin + size*2//3, size*2//3)], fill='white', width=line_width)
    draw.line([(margin + size//3, size*2//3), (margin + size*2//3, size//3)], fill='white', width=line_width)

    # 斜线延伸
    draw.line([(margin + size//3, margin), (margin + size*2//3, size - margin)], fill='white', width=line_width)
    draw.line([(margin + size*2//3, margin), (margin + size//3, size - margin)], fill='white', width=line_width)

    # 保存
    img.save(f'create_ic_launcher_{dpi}.png')

# 创建圆角图标
for dpi, size in sizes.items():
    img = Image.new('RGBA', (size, size), (26, 115, 232, 255))
    draw = ImageDraw.Draw(img)

    # 圆角效果
    radius = size // 4
    draw.ellipse([0, 0, radius*2, radius*2], fill='white')
    draw.ellipse([size-radius*2, 0, size, radius*2], fill='white')
    draw.ellipse([0, size-radius*2, radius*2, size], fill='white')
    draw.ellipse([size-radius*2, size-radius*2, size, size], fill='white')

    # 蓝牙符号
    center = size // 2
    margin = size // 5
    line_width = size // 12

    # 顶部两条竖线
    draw.line([(center - size//4, margin), (center - size//4, size - margin)], fill='white', width=line_width)
    draw.line([(center + size//4, margin), (center + size//4, size - margin)], fill='white', width=line_width)

    # 交叉的斜线
    draw.line([(center - size//4, center), (center + size//4, center)], fill='white', width=line_width)
    draw.line([(center, margin), (center, size - margin)], fill='white', width=line_width)

    img.save(f'ic_launcher_{dpi}.png')
    img.save(f'ic_launcher_round_{dpi}.png')

print("图标生成完成！")
