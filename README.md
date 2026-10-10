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

### 2. Menu, harga, opsi, dan deskripsi

Semua ada di array `MENU` pada `assets/app.js`. Tiap item:

```js
{ id: 'dimsum-ayam',            // unik, dipakai saat order
  name: 'Dimsum Ayam',
  cat: 'Dimsum',                // Dimsum | Mie Ayam | Kebab | Minuman
  price: 15000,                 // harga dasar (angka, tanpa titik)
  was: 18000,                   // opsional: harga coret
  flag: 'Best Seller',          // opsional: badge sudut kanan atas
  hot: true,                    // opsional: badge jadi biru (bukan kuning)
  desc: 'Deskripsi singkat...',
  img: 'assets/img/dimsum-ayam.svg',
  opts: [                       // opsional: pilihan di popup order
    { key: 'porsi', label: 'Porsi', type: 'radio', required: true, choices: [
      { id: 'isi4',  label: 'Isi 4',  add: 0 },
      { id: 'isi6',  label: 'Isi 6',  add: 7000 },   // add = tambahan harga
      { id: 'isi10', label: 'Isi 10', add: 18000 }
    ]},
    { key: 'saus', label: 'Saus tambahan', type: 'check', required: false, choices: [
      { id: 'mentai', label: 'Saus mentai', add: 3000 }
    ]}
  ]}
```

- `type: 'radio'` = pilih satu (pilihan pertama otomatis terpilih).
- `type: 'check'` = boleh pilih beberapa (tampil 2 kolom).
- `add` menambah harga satuan sebelum dikali jumlah.

Harga contoh sudah diisi wajar - **silakan koreksi** sesuai daftar harga asli.

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

- **Langsung katalog**: tanpa hero. Begitu dibuka, chip kategori + kartu jajanan sudah terlihat
  di layar pertama, termasuk di HP.
- **Ketuk kartu -> popup order**: pilih jumlah, opsi (porsi, level pedas, pilihan mie, tingkat manis,
  susu, dll), isi nama & catatan opsional. Total dihitung otomatis termasuk tambahan harga opsi.
- **Kirim ke WhatsApp**: pesan tersusun rapi (menu, opsi terpilih, subtotal, total, nama, catatan),
  lalu dibuka di `wa.me` - pembeli tinggal tekan kirim. Ada notifikasi kecil setelah terkirim.
- **Pencarian + chip kategori** yang menempel (sticky) saat scroll, chip bisa digeser horizontal di HP.
- **Mobile-first**: target sentuh minimal 44px, input 16px (tidak memicu auto-zoom iOS),
  popup bottom-sheet dengan `safe-area-inset`, dan tema kuning-biru khas design system Mandalika.

## Verifikasi yang sudah dilakukan

- 3 viewport (1440 / 768 / 390) × halaman: **0 error console**, **0 horizontal overflow**.
- 19 gambar termuat (semua HTTP 200, tidak ada yang broken).
- 14 pemeriksaan **kontras warna lolos WCAG AA** (terendah 4.5:1).
- Alur order diuji otomatis: ketuk kartu -> popup -> ubah opsi -> naikkan jumlah -> total berubah
  -> kirim ke WA dengan pesan lengkap. Semua benar di desktop, tablet, dan mobile.
- **Order diuji di LIVE** pada viewport HP (390px): kartu terlihat tanpa scroll, tap membuka popup,
  opsi & jumlah mengubah total, link `wa.me` benar.
- **Ergonomi mobile diperiksa**: semua target sentuh >= 44px (kartu, chip, tombol Chat, tombol −/+, tutup),
  input 16px sehingga iOS tidak auto-zoom, popup tidak menjulur keluar layar, chip bisa digeser.
- Font DM Sans terkonfirmasi aktif (`document.fonts.check`).

## Catatan sebelum online

- Ganti `WA_NUMBER`, nomor di footer, dan URL `canonical`/`og:url` (`https://dewanyanyemil.com/`)
  sesuai domain asli.
- Link Instagram/TikTok di footer masih placeholder (`instagram.com/`, `tiktok.com/`).
- Alamat & jam buka di footer masih contoh (Jepara, 09.00–21.00).
