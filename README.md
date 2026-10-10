# Dewanya Nyemil

Website katalog & pemesanan untuk **Dewanya Nyemil** — dimsum, mie ayam, kebab berger, dan seri minuman.
Pesanan disusun di halaman lalu dikirim langsung ke **WhatsApp**.

Layout, font (DM Sans self-hosted), dan sistem warna mengikuti design system proyek **UT SALUT Mandalika**
(Reflex Blue `#002EE6` · Yellow `#FFE600` · Cool Gray `#E6E6E6` · off-white `#FAFAFA`).

---

## Menjalankan lokal

```bash
cd dewanyanyemil
python3 -m http.server 8091 --bind 127.0.0.1
# buka http://127.0.0.1:8091
```

> Pakai server HTTP (bukan `file://`) supaya font, gambar, dan script termuat normal.

---

## Struktur

```
dewanyanyemil/
├── index.html            # satu halaman: hero, kategori, menu, cara pesan, CTA, footer
├── assets/
│   ├── style.css         # design system (token, kartu, keranjang, tombol WA)
│   ├── app.js            # data menu, filter, keranjang, generator pesan WhatsApp
│   ├── fonts/            # DM Sans (woff2, self-hosted)
│   └── img/              # gambar menu (SVG placeholder) + hero + favicon
├── make_images.py        # generator ulang gambar placeholder SVG
└── README.md
```

---

## Hal yang paling sering diubah

### 1. Nomor WhatsApp

`assets/app.js`, baris paling atas:

```js
var WA_NUMBER = '6285225617090';   // format 62…, tanpa "+" atau "0" di depan
```

⚠️ Ini **nomor default** (nomor proyek Mandalika). Ganti dengan nomor resmi Dewanya Nyemil.
Nomor juga tampil di footer `index.html` (bagian Kontak) — ubah manual agar konsisten:

```html
<li><span><i class="fab fa-whatsapp"></i> +62 852-2561-7090</span></li>
```

### 2. Menu, harga, dan deskripsi

Semua ada di array `MENU` pada `assets/app.js`. Tiap item:

```js
{ id: 'dimsum-ayam',            // unik, dipakai keranjang
  name: 'Dimsum Ayam',
  cat: 'Dimsum',                // harus salah satu: Dimsum | Mie Ayam | Kebab | Minuman
  price: 15000,                 // harga normal (angka, tanpa titik)
  was: 18000,                   // opsional: harga coret
  flag: 'Best Seller',          // opsional: badge di sudut kanan atas
  hot: true,                    // opsional: badge jadi biru (bukan kuning)
  desc: 'Deskripsi singkat...',
  img: 'assets/img/dimsum-ayam.svg' }
```

Harga contoh sudah diisi wajar — **silakan koreksi** sesuai daftar harga asli.

### 3. Menambah kategori baru

1. Tambah item dengan `cat` baru di array `MENU`.
2. Tambah nama kategori di `var cats = [...]` pada `app.js`.
3. Tambah ikonnya di `CAT_META` (nama class Font Awesome).
4. (Opsional) Tambah kartu di seksi `#kategori` pada `index.html`.

### 4. Gambar menu

Saat ini memakai **placeholder SVG** (dibuat oleh `make_images.py`) supaya situs langsung rapi
tanpa file foto. Untuk pakai foto asli:

- Taruh foto di `assets/img/` (mis. `dimsum-ayam.jpg`, rasio ideal **4:3**).
- Ubah `img` pada item terkait: `img: 'assets/img/dimsum-ayam.jpg'`.

Untuk regenerate placeholder: `python3 make_images.py`

---

## Fitur

- **Order sekali klik**: tombol **Order Sekarang** di tiap kartu langsung membuka WhatsApp dengan
  pesan siap kirim (`Halo Dewanya Nyemil, saya mau pesan: - Nama Menu (Rp…)`). Pembeli tinggal tekan kirim.
- **Pesan beberapa sekaligus** (opsional): **Tambah ke keranjang** -> panel keranjang terbuka otomatis,
  jumlah diatur dengan tombol −/+, total dihitung otomatis, lalu kirim sebagai satu pesanan.
- **Filter kategori** (chip) + **pencarian** menu real-time.
- **Nama & catatan** opsional saat order lewat keranjang.
- Responsif: desktop / tablet / mobile (drawer menu di layar kecil).
- Tema kuning-biru khas design system Mandalika.

## Verifikasi yang sudah dilakukan

- 3 viewport (1440 / 768 / 390) × halaman: **0 error console**, **0 horizontal overflow**.
- 19 gambar termuat (semua HTTP 200, tidak ada yang broken).
- 14 pemeriksaan **kontras warna lolos WCAG AA** (terendah 4.5:1).
- Alur keranjang diuji otomatis: tambah, kurangi, total, generator pesan WA — semua benar.
- **Order 1 klik diuji di LIVE**: klik tombol pada kartu langsung menghasilkan link `wa.me` dengan
  nama menu + harga; tap di mobile (viewport 390px) juga membuka WhatsApp.
- Font DM Sans terkonfirmasi aktif (`document.fonts.check`).

## Catatan sebelum online

- Ganti `WA_NUMBER`, nomor di footer, dan URL `canonical`/`og:url` (`https://dewanyanyemil.com/`)
  sesuai domain asli.
- Link Instagram/TikTok di footer masih placeholder (`instagram.com/`, `tiktok.com/`).
- Alamat & jam buka di footer masih contoh (Jepara, 09.00–21.00).
