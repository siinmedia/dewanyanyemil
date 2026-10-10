#!/usr/bin/env python3
"""Generate placeholder SVG food images for Dewanya Nyemil.

Palet:
  Chili Red     #D92727  - aksen
  Food Yellow   #FFC928  - highlight
  Warm Cream    #FFF8E8  - latar
  Dark Charcoal #292522  - teks
"""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "img")
os.makedirs(OUT, exist_ok=True)

RED = "#D92727"; GOLD = "#FFC928"; CREAM = "#FFF8E8"; CREAM2 = "#FDF1DC"
INK = "#292522"; LINE = "#E8DFCE"

ITEMS = {
    # Kebab & Burger
    "kebab":              ("Kebab",                "\U0001F32F", CREAM),
    "burger-biasa":       ("Burger Biasa",         "\U0001F354", CREAM2),
    "burger-beef":        ("Burger Beef Patties",  "\U0001F354", CREAM),
    "mac-cheese-kecil":   ("Mac & Cheese",         "\U0001F35D", CREAM2),
    "mac-cheese-beef":    ("Mac & Cheese Beef",    "\U0001F35D", CREAM),
    "spaghetti-bolognese":("Spaghetti Bolognese",  "\U0001F35D", CREAM2),
    # Sosis
    "sosis-chili-oil":    ("Sosis Chili Oil",      "\U0001F32D", CREAM),
    "sosis-bumbu":        ("Sosis Bumbu Tabur",    "\U0001F32D", CREAM2),
    # Cireng & Basreng
    "basreng-chili-oil":  ("Basreng Chili Oil",    "\U0001F95F", CREAM),
    "cireng-chili-oil":   ("Cireng Chili Oil",     "\U0001F95F", CREAM2),
    "cireng-kuah-keju":   ("Cireng Kuah Keju",     "\U0001F9C0", CREAM),
    # Dimsum
    "dimsum":             ("Dimsum",               "\U0001F95F", CREAM2),
    "dimsum-kuah-keju":   ("Dimsum Kuah Keju",     "\U0001F95F", CREAM),
    # Minuman
    "es-ubi-ungu":        ("Es Ubi Ungu",          "\U0001F360", CREAM2),
    "es-ubi-ungu-keju":   ("Es Ubi Ungu Keju",     "\U0001F360", CREAM),
    "es-cendol-kecebong": ("Es Cendol Kecebong",   "\U0001F375", CREAM2),
}

TPL = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450" role="img" aria-label="{label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{bg}"/>
      <stop offset="1" stop-color="#FFFFFF"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bg)"/>
  <circle cx="474" cy="76" r="132" fill="{red}" opacity="0.07"/>
  <circle cx="118" cy="392" r="112" fill="{gold}" opacity="0.30"/>
  <circle cx="300" cy="215" r="128" fill="#FFFFFF" stroke="{line}" stroke-width="2"/>
  <circle cx="300" cy="215" r="104" fill="{bg2}" opacity="0.65"/>
  <text x="300" y="258" text-anchor="middle" font-size="118"
        font-family="Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif">{glyph}</text>
  <text x="300" y="392" text-anchor="middle" font-family="DM Sans, system-ui, sans-serif"
        font-size="27" font-weight="700" fill="{ink}">{label}</text>
</svg>
"""

for slug, (label, glyph, bg) in ITEMS.items():
    bg2 = CREAM if bg == CREAM2 else CREAM2
    lab = label.replace("&", "&amp;")
    svg = TPL.format(label=lab, glyph=glyph, bg=bg, bg2=bg2,
                     red=RED, gold=GOLD, line=LINE, ink=INK)
    with open(os.path.join(OUT, slug + ".svg"), "w", encoding="utf-8") as f:
        f.write(svg)

# ---- hero / og image: grid 5 kartu dengan palet brand ----
def tile(x, y, glyph, label, fill, stroke, label_fill):
    return f"""    <g transform="translate({x} {y})">
      <rect x="-90" y="-90" width="180" height="180" rx="30" fill="{fill}" stroke="{stroke}" stroke-width="2"/>
      <text x="0" y="26" text-anchor="middle" font-size="86"
            font-family="Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif">{glyph}</text>
      <text x="0" y="130" text-anchor="middle" font-size="20" font-weight="700" fill="{label_fill}">{label}</text>
    </g>"""

hero = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 640" width="900" height="640" role="img" aria-label="Aneka camilan dan minuman Dewanya Nyemil">
  <defs>
    <linearGradient id="h" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{CREAM}"/><stop offset="1" stop-color="{CREAM2}"/>
    </linearGradient>
  </defs>
  <rect width="900" height="640" fill="url(#h)"/>
  <circle cx="768" cy="110" r="178" fill="{RED}" opacity="0.08"/>
  <circle cx="132" cy="548" r="152" fill="{GOLD}" opacity="0.32"/>
  <g font-family="DM Sans, system-ui, sans-serif">
{tile(150, 150, "🥟", "Dimsum", "#FFFFFF", LINE, INK)}
{tile(450, 150, "🍜", "Mie Ayam", "#FFFFFF", LINE, INK)}
{tile(750, 150, "🌯", "Kebab", "#FFFFFF", LINE, INK)}
{tile(300, 400, "🧋", "Minuman", "#FFFFFF", LINE, INK)}
{tile(600, 400, "🍋", "Seri Segar", GOLD, "#E5AF10", INK)}
  </g>
</svg>
"""
with open(os.path.join(OUT, "hero.svg"), "w", encoding="utf-8") as f:
    f.write(hero)

# ---- favicon: cabai/bowl merah-kuning ----
fav = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="15" fill="{RED}"/>
  <circle cx="32" cy="31" r="15" fill="{GOLD}"/>
  <path d="M17 31h30" stroke="{RED}" stroke-width="2.2" stroke-linecap="round" opacity=".4"/>
  <circle cx="26" cy="28" r="4.2" fill="#FFFFFF"/>
  <circle cx="38" cy="28" r="4.2" fill="#FFFFFF"/>
  <circle cx="32" cy="38" r="4.6" fill="#FFFFFF"/>
  <path d="M22 47h20" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/>
</svg>
"""
with open(os.path.join(OUT, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(fav)

print("written:", len(ITEMS) + 2, "files ->", OUT)
