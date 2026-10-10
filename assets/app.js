/* ==========================================================================
   DEWANYA NYEMIL — Interaksi
   Vanilla JS, tanpa dependensi.
   1. Header + tombol ke atas      4. Filter & pencarian menu
   2. Drawer mobile                5. Keranjang → pesan WhatsApp
   3. Reveal saat scroll           6. Render kartu menu
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  root.classList.add('js-reveal');

  /* ---------- Konfigurasi ---------- */
  // Nomor WhatsApp tujuan order (format internasional tanpa "+").
  var WA_NUMBER = '6285225617090';
  var STORE = 'Dewanya Nyemil';
  var CURRENCY = function (n) { return 'Rp' + Number(n).toLocaleString('id-ID'); };

  /* ---------- 1. Header + to-top ---------- */
  var head = doc.querySelector('.site-head');
  var topBtn = doc.querySelector('.to-top');
  var onScroll = function () {
    var y = window.scrollY;
    if (head) head.classList.toggle('is-stuck', y > 8);
    if (topBtn) topBtn.classList.toggle('is-show', y > 480);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- 2. Drawer mobile ---------- */
  var toggle = doc.querySelector('.nav-toggle');
  var drawer = doc.getElementById('menu-mobile');
  if (toggle && drawer) {
    var setDrawer = function (open) {
      drawer.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      var icon = toggle.querySelector('i');
      if (icon) icon.className = open ? 'fas fa-xmark' : 'fas fa-bars';
    };
    toggle.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
  }

  /* ---------- 3. Reveal ---------- */
  var reveals = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ==========================================================================
     4-6. MENU, FILTER, DAN KERANJANG
     ========================================================================== */

  /* --- Data menu ---------------------------------------------------------
     Ganti nama/harga/deskripsi di sini. `img` boleh URL gambar apa pun
     (lokal di assets/img/ atau link). `flag` opsional: 'Best Seller' /
     'Baru' / 'Pedas'. `hot: true` membuat badge jadi biru.               */
  var MENU = [
    // -------- Dimsum --------
    { id: 'dimsum-ayam',   name: 'Dimsum Ayam',            cat: 'Dimsum',  price: 15000, was: 18000, flag: 'Best Seller', hot: true,
      desc: 'Dimsum ayam lembut dengan topping wortel, dikukus fresh, disajikan dengan saus spesial.',
      img: 'assets/img/dimsum-ayam.svg' },
    { id: 'dimsum-udang',  name: 'Dimsum Udang',           cat: 'Dimsum',  price: 18000,
      desc: 'Dimsum isi udang utuh yang kenyal dan manis, aroma bawang putih yang menggoda.',
      img: 'assets/img/dimsum-udang.svg' },
    { id: 'dimsum-mentai', name: 'Dimsum Mentai',          cat: 'Dimsum',  price: 22000, flag: 'Favorit',
      desc: 'Dimsum ayam disiram saus mentai creamy, dibakar sebentar hingga wangi.',
      img: 'assets/img/dimsum-mentai.svg' },
    { id: 'siomay',        name: 'Siomay Bandung',         cat: 'Dimsum',  price: 12000,
      desc: 'Siomay ikan tenggiri dengan bumbu kacang gurih, kecap, dan perasan jeruk limau.',
      img: 'assets/img/siomay.svg' },

    // -------- Mie Ayam --------
    { id: 'mie-ayam',      name: 'Mie Ayam Original',      cat: 'Mie Ayam', price: 15000, flag: 'Best Seller', hot: true,
      desc: 'Mie kenyal dengan ayam kecap manis gurih, sawi segar, dan kuah kaldu bening.',
      img: 'assets/img/mie-ayam.svg' },
    { id: 'mie-ayam-bakso', name: 'Mie Ayam Bakso',        cat: 'Mie Ayam', price: 20000,
      desc: 'Mie ayam lengkap dengan 3 bakso sapi kenyal dan pangsit goreng renyah.',
      img: 'assets/img/mie-ayam-bakso.svg' },
    { id: 'mie-ayam-jumbo', name: 'Mie Ayam Jumbo',        cat: 'Mie Ayam', price: 25000, flag: 'Porsi Besar',
      desc: 'Porsi jumbo untuk yang lapar berat: mie, ayam, bakso, pangsit, dan telur rebus.',
      img: 'assets/img/mie-ayam-jumbo.svg' },
    { id: 'mie-yamin',     name: 'Mie Yamin Manis',        cat: 'Mie Ayam', price: 15000,
      desc: 'Mie yamin kecap manis tanpa kuah, ayam gurih, dan taburan bawang goreng.',
      img: 'assets/img/mie-yamin.svg' },

    // -------- Kebab Berger --------
    { id: 'kebab-ayam',    name: 'Kebab Ayam Berger',      cat: 'Kebab',   price: 17000, flag: 'Best Seller', hot: true,
      desc: 'Kebab ayam panggang dengan saus mayo, keju, dan sayuran segar dalam tortilla lembut.',
      img: 'assets/img/kebab-ayam.svg' },
    { id: 'kebab-sapi',    name: 'Kebab Sapi Berger',      cat: 'Kebab',   price: 22000,
      desc: 'Daging sapi bumbu lada hitam, keju mozzarella, dan saus barbekyu spesial.',
      img: 'assets/img/kebab-sapi.svg' },
    { id: 'kebab-sosis',   name: 'Kebab Sosis Mozzarella', cat: 'Kebab',   price: 20000,
      desc: 'Sosis jumbo dan mozzarella meleleh, camilan favorit anak-anak.',
      img: 'assets/img/kebab-sosis.svg' },
    { id: 'kebab-duo',     name: 'Kebab Duo Combo',        cat: 'Kebab',   price: 35000, was: 40000, flag: 'Combo',
      desc: 'Dua kebab pilihan (ayam + sapi) dengan kentang goreng, cocok untuk berdua.',
      img: 'assets/img/kebab-duo.svg' },

    // -------- Seri Minuman --------
    { id: 'es-teh',        name: 'Es Teh Jumbo',           cat: 'Minuman', price: 8000,
      desc: 'Teh tubruk segar dengan es batu, manisnya bisa request sesuai selera.',
      img: 'assets/img/es-teh.svg' },
    { id: 'lemon-tea',     name: 'Lemon Tea Segar',        cat: 'Minuman', price: 12000, flag: 'Segar',
      desc: 'Teh dingin dengan perasan lemon asli dan potongan lemon segar.',
      img: 'assets/img/lemon-tea.svg' },
    { id: 'matcha-latte',  name: 'Matcha Latte',           cat: 'Minuman', price: 18000,
      desc: 'Matcha premium dengan susu segar, creamy dan tidak terlalu manis.',
      img: 'assets/img/matcha-latte.svg' },
    { id: 'choco-ice',     name: 'Chocolate Ice',          cat: 'Minuman', price: 16000, flag: 'Favorit',
      desc: 'Cokelat kental dingin dengan whipped cream dan taburan cokelat serut.',
      img: 'assets/img/choco-ice.svg' },
    { id: 'thai-tea',      name: 'Thai Tea Original',      cat: 'Minuman', price: 14000,
      desc: 'Thai tea autentik, manis creamy dengan susu evaporasi.',
      img: 'assets/img/thai-tea.svg' },
    { id: 'mango-yakult',  name: 'Mango Yakult',           cat: 'Minuman', price: 15000, flag: 'Baru',
      desc: 'Mangga segar dipadu yakult, asam manis menyegarkan.',
      img: 'assets/img/mango-yakult.svg' }
  ];

  var CAT_META = {
    'Semua':   { ico: 'fa-utensils' },
    'Dimsum':  { ico: 'fa-bowl-food' },
    'Mie Ayam':{ ico: 'fa-bowl-rice' },
    'Kebab':   { ico: 'fa-drumstick-bite' },
    'Minuman': { ico: 'fa-mug-hot' }
  };

  var menuRoot = doc.getElementById('menu-grid');
  if (!menuRoot) return;   // halaman ini tidak punya daftar menu

  var cart = {};           // id -> qty
  var activeCat = 'Semua';
  var query = '';

  /* --- Render kartu menu -------------------------------------------------- */
  function cardHtml(item) {
    var flag = item.flag
      ? '<span class="mcard__flag' + (item.hot ? ' mcard__flag--hot' : '') + '">' + item.flag + '</span>'
      : '';
    var was = item.was ? '<span class="mcard__price-was">' + CURRENCY(item.was) + '</span>' : '';
    return '' +
      '<article class="mcard reveal" data-id="' + item.id + '" data-cat="' + item.cat + '">' +
        '<div class="mcard__img">' +
          '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy" width="600" height="450">' +
          '<span class="mcard__cat"><i class="fas ' + (CAT_META[item.cat] ? CAT_META[item.cat].ico : 'fa-utensils') + '"></i> ' + item.cat + '</span>' +
          flag +
        '</div>' +
        '<div class="mcard__body">' +
          '<h3 class="mcard__title">' + item.name + '</h3>' +
          '<p class="mcard__desc">' + item.desc + '</p>' +
          '<div class="mcard__price"><span class="mcard__price-now">' + CURRENCY(item.price) + '</span>' + was + '</div>' +
          '<div class="mcard__foot">' +
            '<div class="qty">' +
              '<button class="qty__btn" type="button" data-act="dec" aria-label="Kurangi ' + item.name + '">&minus;</button>' +
              '<span class="qty__val" data-qty="' + item.id + '">0</span>' +
              '<button class="qty__btn" type="button" data-act="inc" aria-label="Tambah ' + item.name + '">+</button>' +
            '</div>' +
            '<button class="btn btn--outline btn--sm" type="button" data-act="add" style="flex:1">Tambah</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderMenu() {
    var list = MENU.filter(function (m) {
      var okCat = activeCat === 'Semua' || m.cat === activeCat;
      var q = query.trim().toLowerCase();
      var okQ = !q || m.name.toLowerCase().indexOf(q) > -1 || m.desc.toLowerCase().indexOf(q) > -1;
      return okCat && okQ;
    });

    if (!list.length) {
      menuRoot.innerHTML = '<p class="pill-note" style="grid-column:1/-1"><i class="fas fa-circle-info"></i> Menu tidak ditemukan. Coba kata kunci lain.</p>';
      return;
    }
    menuRoot.innerHTML = list.map(cardHtml).join('');
    syncQtyLabels();
    // reveal kartu baru
    requestAnimationFrame(function () {
      menuRoot.querySelectorAll('.reveal').forEach(function (el, i) {
        setTimeout(function () { el.classList.add('is-in'); }, Math.min(i * 40, 320));
      });
    });
  }

  /* --- Chip kategori ------------------------------------------------------ */
  var chipBar = doc.getElementById('menu-chips');
  if (chipBar) {
    var cats = ['Semua', 'Dimsum', 'Mie Ayam', 'Kebab', 'Minuman'];
    chipBar.innerHTML = cats.map(function (c) {
      var ico = CAT_META[c] ? CAT_META[c].ico : 'fa-utensils';
      return '<button class="chip' + (c === 'Semua' ? ' is-active' : '') + '" type="button" data-cat="' + c + '">' +
             '<i class="fas ' + ico + ' chip__ico"></i> ' + c + '</button>';
    }).join('');
    chipBar.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      activeCat = b.getAttribute('data-cat');
      chipBar.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('is-active', c === b); });
      renderMenu();
    });
  }

  /* --- Pencarian ---------------------------------------------------------- */
  var searchInput = doc.getElementById('menu-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () { query = searchInput.value; renderMenu(); });
  }

  /* --- Keranjang ---------------------------------------------------------- */
  function syncQtyLabels() {
    MENU.forEach(function (m) {
      var el = menuRoot.querySelector('[data-qty="' + m.id + '"]');
      if (el) el.textContent = cart[m.id] || 0;
    });
  }

  function cartCount() {
    return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0);
  }
  function cartTotal() {
    return Object.keys(cart).reduce(function (s, k) {
      var item = MENU.filter(function (m) { return m.id === k; })[0];
      return s + (item ? item.price * cart[k] : 0);
    }, 0);
  }

  function addToCart(id, delta) {
    cart[id] = Math.max(0, (cart[id] || 0) + delta);
    if (!cart[id]) delete cart[id];
    syncQtyLabels();
    renderCart();
    var fab = doc.getElementById('cart-fab');
    if (fab && delta > 0) {
      fab.style.transform = 'translateY(-2px) scale(1.04)';
      setTimeout(function () { fab.style.transform = ''; }, 180);
    }
  }

  menuRoot.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var card = e.target.closest('.mcard');
    if (!card) return;
    var id = card.getAttribute('data-id');
    var act = btn.getAttribute('data-act');
    if (act === 'inc') addToCart(id, 1);
    if (act === 'dec') addToCart(id, -1);
    if (act === 'add') addToCart(id, 1);
  });

  /* --- Render isi keranjang ---------------------------------------------- */
  var cartBody = doc.getElementById('cart-body');
  var cartFoot = doc.getElementById('cart-foot');
  var fabCount = doc.getElementById('cart-count');

  function renderCart() {
    var count = cartCount();
    if (fabCount) {
      fabCount.textContent = count;
      fabCount.setAttribute('data-empty', count === 0 ? 'true' : 'false');
    }
    if (!cartBody) return;

    if (!count) {
      cartBody.innerHTML = '<div class="cart-empty"><div class="cart-empty__ico"><i class="fas fa-basket-shopping"></i></div>' +
        '<p>Keranjangmu masih kosong.<br>Pilih menu favoritmu dulu ya.</p></div>';
      if (cartFoot) cartFoot.style.display = 'none';
      return;
    }
    if (cartFoot) cartFoot.style.display = '';

    var rows = Object.keys(cart).map(function (id) {
      var item = MENU.filter(function (m) { return m.id === id; })[0];
      if (!item) return '';
      return '<div class="citem">' +
        '<img class="citem__img" src="' + item.img + '" alt="' + item.name + '">' +
        '<div class="citem__info">' +
          '<div class="citem__name">' + item.name + '</div>' +
          '<div class="citem__price">' + CURRENCY(item.price) + ' &times; ' + cart[id] + '</div>' +
        '</div>' +
        '<div class="qty">' +
          '<button class="qty__btn" type="button" data-cart-act="dec" data-id="' + id + '" aria-label="Kurangi">&minus;</button>' +
          '<span class="qty__val">' + cart[id] + '</span>' +
          '<button class="qty__btn" type="button" data-cart-act="inc" data-id="' + id + '" aria-label="Tambah">+</button>' +
        '</div>' +
        '<div class="citem__sub">' + CURRENCY(item.price * cart[id]) + '</div>' +
      '</div>';
    }).join('');
    cartBody.innerHTML = rows;

    var totalEl = doc.getElementById('cart-total-val');
    if (totalEl) totalEl.textContent = CURRENCY(cartTotal());
  }

  if (cartBody) {
    cartBody.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cart-act]');
      if (!b) return;
      var id = b.getAttribute('data-id');
      addToCart(id, b.getAttribute('data-cart-act') === 'inc' ? 1 : -1);
    });
  }

  /* --- Buka/tutup sheet keranjang ---------------------------------------- */
  var sheet = doc.getElementById('cart-sheet');
  var fab = doc.getElementById('cart-fab');
  var openSheet = function (open) {
    if (!sheet) return;
    sheet.classList.toggle('is-open', open);
    doc.body.style.overflow = open ? 'hidden' : '';
  };
  if (fab) fab.addEventListener('click', function () { openSheet(true); });
  if (sheet) {
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) openSheet(false);
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') openSheet(false); });
  }

  /* --- Kirim pesanan ke WhatsApp ----------------------------------------- */
  var waBtn = doc.getElementById('cart-wa');
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      if (!cartCount()) return;
      var nameEl = doc.getElementById('cust-name');
      var noteEl = doc.getElementById('cust-note');
      var name = nameEl && nameEl.value.trim();
      var note = noteEl && noteEl.value.trim();

      var lines = ['Halo ' + STORE + ', saya mau pesan:', ''];
      Object.keys(cart).forEach(function (id) {
        var item = MENU.filter(function (m) { return m.id === id; })[0];
        if (item) lines.push('- ' + item.name + ' x' + cart[id] + ' = ' + CURRENCY(item.price * cart[id]));
      });
      lines.push('');
      lines.push('Total: ' + CURRENCY(cartTotal()));
      if (name) lines.push('Nama: ' + name);
      if (note) lines.push('Catatan: ' + note);
      lines.push('');
      lines.push('Mohon konfirmasi ketersediaan & ongkir. Terima kasih!');

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank');
    });
  }

  /* --- Tombol "Pesan" pada kartu (kalau ada) ----------------------------- */
  doc.querySelectorAll('[data-order-now]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Halo ' + STORE + ', saya mau pesan. Boleh info menu & ongkirnya?');
      window.open(url, '_blank');
    });
  });

  /* --- Kartu kategori: lompat ke menu + filter kategori ------------------ */
  doc.querySelectorAll('[data-jump]').forEach(function (el) {
    el.addEventListener('click', function () {
      var cat = el.getAttribute('data-jump');
      activeCat = cat;
      if (chipBar) {
        chipBar.querySelectorAll('.chip').forEach(function (c) {
          c.classList.toggle('is-active', c.getAttribute('data-cat') === cat);
        });
      }
      if (searchInput) { searchInput.value = ''; query = ''; }
      renderMenu();
    });
  });

  /* --- Inisialisasi ------------------------------------------------------ */
  renderMenu();
  renderCart();
})();
