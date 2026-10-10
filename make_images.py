#!/usr/bin/env python3
"""Generate placeholder SVG food images for Dewanya Nyemil."""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "img")
os.makedirs(OUT, exist_ok=True)

BLUE = "#002EE6"; YELLOW = "#FFE600"; WARM = "#FFF7EA"; WARM2 = "#FFEFD6"
GREY = "#E6E6E6"; INK = "#1A1A1A"

# emoji-ish simple glyphs per item; we draw a plate + glyph text
ITEMS = {
    "dimsum-ayam":     ("Dimsum Ayam",     "🥟", WARM),
    "dimsum-udang":    ("Dimsum Udang",    "🥟", WARM2),
    "dimsum-mentai":   ("Dimsum Mentai",   "🍥", WARM),
    "siomay":          ("Siomay Bandung",  "🥟", WARM2),
    "mie-ayam":        ("Mie Ayam",        "🍜", WARM),
    "mie-ayam-bakso":  ("Mie Ayam Bakso",  "🍜", WARM2),
    "mie-ayam-jumbo":  ("Mie Ayam Jumbo",  "🍜", WARM),
    "mie-yamin":       ("Mie Yamin",       "🍝", WARM2),
    "kebab-ayam":      ("Kebab Ayam",      "🌯", WARM),
    "kebab-sapi":      ("Kebab Sapi",      "🌯", WARM2),
    "kebab-sosis":     ("Kebab Sosis",     "🌭", WARM),
    "kebab-duo":       ("Kebab Duo",       "🌯", WARM2),
    "es-teh":          ("Es Teh Jumbo",    "🧋", WARM),
    "lemon-tea":       ("Lemon Tea",       "🍋", WARM2),
    "matcha-latte":    ("Matcha Latte",    "🍵", WARM),
    "choco-ice":       ("Chocolate Ice",   "🍫", WARM2),
    "thai-tea":        ("Thai Tea",        "🧋", WARM),
    "mango-yakult":    ("Mango Yakult",    "🥭", WARM2),
}

TPL = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450" role="img" aria-label="{label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{bg}"/>
      <stop offset="1" stop-color="#FFFFFF"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bg)"/>
  <circle cx="470" cy="80" r="130" fill="{blue}" opacity="0.06"/>
  <circle cx="120" cy="390" r="110" fill="{yellow}" opacity="0.22"/>
  <circle cx="300" cy="215" r="128" fill="#FFFFFF" stroke="{grey}" stroke-width="2"/>
  <circle cx="300" cy="215" r="104" fill="{bg2}" opacity="0.7"/>
  <text x="300" y="258" text-anchor="middle" font-size="118"
        font-family="Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif">{glyph}</text>
  <text x="300" y="392" text-anchor="middle" font-family="DM Sans, system-ui, sans-serif"
        font-size="27" font-weight="600" fill="{blue}">{label}</text>
</svg>
"""

for slug, (label, glyph, bg) in ITEMS.items():
    svg = TPL.format(label=label, glyph=glyph, bg=bg, bg2=WARM2 if bg == WARM else WARM,
                     blue=BLUE, yellow=YELLOW, grey=GREY)
    with open(os.path.join(OUT, slug + ".svg"), "w", encoding="utf-8") as f:
        f.write(svg)

# hero image (bigger, brand-flavoured)
hero = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 640" width="900" height="640" role="img" aria-label="Aneka camilan dan minuman Dewanya Nyemil">
  <defs>
    <linearGradient id="h" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFF7EA"/><stop offset="1" stop-color="#E5E9FD"/>
    </linearGradient>
  </defs>
  <rect width="900" height="640" fill="url(#h)"/>
  <circle cx="760" cy="120" r="180" fill="#002EE6" opacity="0.07"/>
  <circle cx="140" cy="540" r="150" fill="#FFE600" opacity="0.25"/>
  <g font-family="DM Sans, system-ui, sans-serif">
    <g transform="translate(140 150)">
      <rect x="-90" y="-90" width="180" height="180" rx="28" fill="#FFFFFF" stroke="#E6E6E6"/>
      <text x="0" y="26" text-anchor="middle" font-size="86" font-family="Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif">🥟</text>
      <text x="0" y="128" text-anchor="middle" font-size="20" font-weight="600" fill="#002EE6">Dimsum</text>
    </g>
    <g transform="translate(450 150)">
      <rect x="-90" y="-90" width="180" height="180" rx="28" fill="#FFFFFF" stroke="#E6E6E6"/>
      <text x="0" y="26" text-anchor="middle" font-size="86" font-family="Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif">🍜</text>
      <text x="0" y="128" text-anchor="middle" font-size="20" font-weight="600" fill="#002EE6">Mie Ayam</text>
    </g>
    <g transform="translate(760 150)">
      <rect x="-90" y="-90" width="180" height="180" rx="28" fill="#FFFFFF" stroke="#E6E6E6"/>
      <text x="0" y="26" text-anchor="middle" font-size="86" font-family="Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif">🌯</text>
      <text x="0" y="128" text-anchor="middle" font-size="20" font-weight="600" fill="#002EE6">Kebab</text>
    </g>
    <g transform="translate(300 400)">
      <rect x="-90" y="-90" width="180" height="180" rx="28" fill="#FFFFFF" stroke="#E6E6E6"/>
      <text x="0" y="26" text-anchor="middle" font-size="86" font-family="Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif">🧋</text>
      <text x="0" y="128" text-anchor="middle" font-size="20" font-weight="600" fill="#002EE6">Minuman</text>
    </g>
    <g transform="translate(610 400)">
      <rect x="-90" y="-90" width="180" height="180" rx="28" fill="#FFE600" stroke="#E6CF00"/>
      <text x="0" y="26" text-anchor="middle" font-size="86" font-family="Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif">🍋</text>
      <text x="0" y="128" text-anchor="middle" font-size="20" font-weight="700" fill="#002EE6">Seri Segar</text>
    </g>
  </g>
</svg>
"""
with open(os.path.join(OUT, "hero.svg"), "w", encoding="utf-8") as f:
    f.write(hero)

print("written:", len(ITEMS) + 1, "files ->", OUT)
