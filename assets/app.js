/* ==========================================================================
   DEWANYA NYEMIL — Katalog & Order (dengan keranjang)
   Vanilla JS, tanpa dependensi.
   1. Render katalog         5. Tambah ke keranjang
   2. Pencarian & kategori   6. Panel keranjang
   3. Header                 7. Kirim semua ke WhatsApp / toast
   4. Popup pilih item
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;

  /* ---------- Konfigurasi ---------- */
  // Nomor WhatsApp tujuan order (format internasional tanpa "+").
  var WA_NUMBER = '628976255469';
  var STORE = 'Dewanya Nyemil';
  var CURRENCY = function (n) { return 'Rp' + Number(n).toLocaleString('id-ID'); };

  /* ---------- Data menu ---------------------------------------------------
     `opts` = pilihan tambahan yang muncul di popup order. Tiap grup:
       { key: id unik, label: judul, type: 'radio'|'check', required: bool,
         choices: [{ id, label, add: tambahan harga (opsional) }] }
     `img` boleh SVG lokal atau link foto.                                        */
  var MENU = [
    // -------- Kebab & Burger --------
    { id: 'kebab', name: 'Kebab', cat: 'Kebab & Burger', price: 6000, flag: 'Best Seller', hot: true,
      desc: 'Kebab isi ayam panggang, sayuran segar, dan saus spesial dalam kulit tortilla lembut.',
      img: 'assets/img/kebeb.webp',
      opts: [
        { key: 'level', label: 'Level pedas', type: 'radio', required: true, choices: [
          { id: 'l0', label: 'Tidak pedas', add: 0 },
          { id: 'l1', label: 'Pedas sedang', add: 0 },
          { id: 'l2', label: 'Pedas maksimal', add: 0 }
        ]},
        { key: 'extra', label: 'Tambahan', type: 'check', required: false, choices: [
          { id: 'keju', label: 'Keju ekstra', add: 3000 },
          { id: 'telur', label: 'Telur', add: 2000 }
        ]}
      ]},
    { id: 'burger-biasa', name: 'Burger Biasa', cat: 'Kebab & Burger', price: 7000,
      desc: 'Burger klasik dengan patty ayam, selada, timun, dan saus mayo manis.',
      img: 'assets/img/burger biasa.webp',
      opts: [
        { key: 'saus', label: 'Saus', type: 'radio', required: true, choices: [
          { id: 'mayo', label: 'Mayo', add: 0 },
          { id: 'pedas', label: 'Mayo pedas', add: 0 },
          { id: 'bbq', label: 'Barbekyu', add: 0 }
        ]}
      ]},
    { id: 'burger-beef', name: 'Burger Beef Patties', cat: 'Kebab & Burger', price: 10000, flag: 'Favorit',
      desc: 'Burger dengan patty daging sapi tebal, keju leleh, dan saus barbekyu.',
      img: 'assets/img/burger peties.webp' },
    { id: 'mac-cheese-kecil', name: 'Mac and Cheese Cup Kecil', cat: 'Kebab & Burger', price: 5000,
      desc: 'Makaroni creamy saus keju dalam cup praktis, gurih dan mengenyangkan.',
      img: 'assets/img/Mac and Cheese Cup Kecil.webp' },
    { id: 'mac-cheese-beef', name: 'Mac and Cheese + Beef Patties', cat: 'Kebab & Burger', price: 10000, flag: 'Porsi Lengkap',
      desc: 'Mac and cheese creamy ditambah patty daging sapi, porsi lebih lengkap.',
      img: 'assets/img/Mac and Cheese Beef Patties.webp' },
    { id: 'spaghetti-bolognese', name: 'Spaghetti Bolognese Cup Kecil', cat: 'Kebab & Burger', price: 5000,
      desc: 'Spaghetti saus bolognese daging dalam cup kecil, praktis buat ngemil.',
      img: 'assets/img/Spaghetti Bolognese Cup Kecil.webp',
      opts: [
        { key: 'varian', label: 'Varian', type: 'radio', required: true, choices: [
          { id: 'reguler', label: 'Reguler', add: 0 },
          { id: 'daging', label: 'Extra daging', add: 5000 }
        ]}
      ]},

    // -------- Sosis --------
    { id: 'sosis-chili-oil', name: 'Sosis Chili Oil', cat: 'Sosis', price: 1000, from: true,
      desc: 'Sosis goreng disiram chili oil pedas gurih. Harga mulai dari Rp1.000, atur jumlah sesuai selera.',
      img: 'assets/img/Sosis Chili Oil.webp' },
    { id: 'sosis-bumbu', name: 'Sosis Goreng Bumbu Tabur', cat: 'Sosis', price: 1000, from: true,
      desc: 'Sosis goreng ditabur bumbu tabur aneka rasa. Harga mulai dari Rp1.000, atur jumlah sesuai selera.',
      img: 'assets/img/Sosis Goreng Bumbu Tabur.webp',
      opts: [
        { key: 'rasa', label: 'Rasa bumbu', type: 'radio', required: true, choices: [
          { id: 'original', label: 'Original', add: 0 },
          { id: 'pedas', label: 'Pedas', add: 0 },
          { id: 'jagung', label: 'Jagung manis', add: 0 },
          { id: 'keju', label: 'Keju', add: 0 }
        ]}
      ]},

    // -------- Cireng & Basreng --------
    { id: 'basreng-chili-oil', name: 'Basreng Chili Oil', cat: 'Cireng & Basreng', price: 5000, flag: 'Best Seller', hot: true,
      desc: 'Baso aci goreng renyah disiram chili oil pedas, camilan favorit.',
      img: 'assets/img/Basreng Chili Oil.webp',
      opts: [
        { key: 'level', label: 'Level pedas', type: 'radio', required: true, choices: [
          { id: 'l1', label: 'Pedas sedang', add: 0 },
          { id: 'l2', label: 'Pedas maksimal', add: 0 }
        ]}
      ]},
    { id: 'cireng-chili-oil', name: 'Cireng Chili Oil', cat: 'Cireng & Basreng', price: 5000,
      desc: 'Cireng kenyal goreng dengan siraman chili oil pedas gurih.',
      img: 'assets/img/Cireng Chili Oil.webp',
      opts: [
        { key: 'level', label: 'Level pedas', type: 'radio', required: true, choices: [
          { id: 'l1', label: 'Pedas sedang', add: 0 },
          { id: 'l2', label: 'Pedas maksimal', add: 0 }
        ]}
      ]},
    { id: 'cireng-kuah-keju', name: 'Cireng Kuah Keju', cat: 'Cireng & Basreng', price: 7000, flag: 'Favorit',
      desc: 'Cireng kenyal dengan kuah keju creamy yang gurih, disajikan hangat.',
      img: 'assets/img/Cireng Kuah Keju.webp' },

    // -------- Dimsum --------
    { id: 'dimsum', name: 'Dimsum', cat: 'Dimsum', price: 3500, flag: 'Best Seller', hot: true,
      desc: 'Dimsum ayam lembut dikukus fresh, disajikan dengan saus spesial. Pilih porsi sesuai selera.',
      img: 'assets/img/Dimsum.webp',
      opts: [
        { key: 'porsi', label: 'Porsi', type: 'radio', required: true, choices: [
          { id: 'isi4', label: 'Isi 4', add: 0 },
          { id: 'isi6', label: 'Isi 6', add: 1500 },
          { id: 'isi10', label: 'Isi 10', add: 4500 }
        ]},
        { key: 'saus', label: 'Saus tambahan', type: 'check', required: false, choices: [
          { id: 'mentai', label: 'Saus mentai', add: 3000 },
          { id: 'pedas', label: 'Saus pedas', add: 0 }
        ]}
      ]},
    { id: 'dimsum-kuah-keju', name: 'Dimsum Kuah Keju', cat: 'Dimsum', price: 9000,
      desc: 'Dimsum ayam disiram kuah keju creamy, hangat dan gurih.',
      img: 'assets/img/Dimsum Kuah Keju.webp' },

    // -------- Kwetiaw & Mie --------
    { id: 'kwetiaw-chili-oil', name: 'Kwetiaw Chili Oil', cat: 'Kwetiaw & Mie', price: 10000, flag: 'Baru', hot: true,
      desc: 'Kwetiaw kenyal goreng dengan siraman chili oil pedas gurih, topping melimpah.',
      img: 'assets/img/kwetiaw-chili-oil.webp',
      opts: [
        { key: 'level', label: 'Level pedas', type: 'radio', required: true, choices: [
          { id: 'l0', label: 'Tidak pedas', add: 0 },
          { id: 'l1', label: 'Pedas sedang', add: 0 },
          { id: 'l2', label: 'Pedas maksimal', add: 0 }
        ]}
      ]},

    // -------- Minuman --------
    { id: 'es-ubi-ungu', name: 'Es Ubi Ungu Original', cat: 'Minuman', price: 6000, flag: 'Segar',
      desc: 'Es ubi ungu asli yang creamy dan manis alami, warnanya cantik.',
      img: 'assets/img/Es Ubi Ungu Original.webp',
      opts: [
        { key: 'manis', label: 'Tingkat manis', type: 'radio', required: true, choices: [
          { id: 'normal', label: 'Normal', add: 0 },
          { id: 'less', label: 'Kurang manis', add: 0 }
        ]}
      ]},
    { id: 'es-ubi-ungu-keju', name: 'Es Ubi Ungu Double Keju', cat: 'Minuman', price: 7000, flag: 'Favorit',
      desc: 'Es ubi ungu dengan topping keju melimpah dua kali, manis gurih.',
      img: 'assets/img/Es Ubi Ungu Double Keju.webp' },
    { id: 'es-cendol-kecebong', name: 'Es Cendol Kecebong', cat: 'Minuman', price: 6000,
      desc: 'Es cendol dengan butiran kecebong kenyal, santan, dan gula aren segar.',
      img: 'assets/img/Condensed Green Cendol Iced Dessert.webp' }
  ];

  var CATS = ['Semua', 'Kebab & Burger', 'Sosis', 'Cireng & Basreng', 'Dimsum', 'Kwetiaw & Mie', 'Minuman'];
  var CAT_META = {
    'Semua':          { ico: 'fa-utensils',        short: 'Semua' },
    'Kebab & Burger': { ico: 'fa-burger',          short: 'Kebab & Burger' },
    'Sosis':          { ico: 'fa-hotdog',          short: 'Sosis' },
    'Cireng & Basreng': { ico: 'fa-cookie-bite',   short: 'Cireng & Basreng' },
    'Dimsum':         { ico: 'fa-bowl-food',       short: 'Dimsum' },
    'Kwetiaw & Mie':  { ico: 'fa-utensils',        short: 'Kwetiaw & Mie' },
    'Minuman':        { ico: 'fa-mug-hot',         short: 'Minuman' }
  };

  var grid = doc.getElementById('menu-grid');
  if (!grid) return;

  var activeCat = 'Semua';
  var query = '';

  /* ---------- Util ---------- */
  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function openWA(text) { window.open(waLink(text), '_blank'); }
  function byId(id) { return MENU.filter(function (m) { return m.id === id; })[0]; }
  function catIco(c) { return CAT_META[c] ? CAT_META[c].ico : 'fa-utensils'; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var toastEl = null;
  function toast() {}

  /* ---------- Label opsi terpilih (dipakai popup & keranjang) ---------- */
  function pickedLabels(item, choices) {
    var out = [];
    if (!item.opts) return out;
    item.opts.forEach(function (g) {
      var picked = (choices && choices[g.key]) || [];
      var labels = g.choices
        .filter(function (ch) { return picked.indexOf(ch.id) > -1; })
        .map(function (ch) { return ch.label; });
      if (labels.length) out.push({ label: g.label, text: labels.join(', ') });
    });
    return out;
  }
  function extraFromChoices(item, choices) {
    if (!item.opts) return 0;
    var extra = 0;
    item.opts.forEach(function (g) {
      var picked = (choices && choices[g.key]) || [];
      g.choices.forEach(function (ch) { if (picked.indexOf(ch.id) > -1 && ch.add) extra += ch.add; });
    });
    return extra;
  }

  /* ---------- 1. Render katalog ---------- */
  function cardHtml(item) {
    var flag = item.flag
      ? '<span class="mcard__flag' + (item.hot ? ' mcard__flag--hot' : '') + '">' + item.flag + '</span>'
      : '';
    var was = item.was ? '<span class="mcard__price-was">' + CURRENCY(item.was) + '</span>' : '';
    var fromTag = item.from ? '<span class="mcard__price-from">Mulai dari</span>' : '';
    return '' +
      '<article class="mcard" data-id="' + item.id + '" data-cat="' + item.cat + '" tabindex="0" role="button" ' +
              'aria-label="' + item.name + ', ' + CURRENCY(item.price) + '. Ketuk untuk pesan">' +
        '<div class="mcard__img">' +
          '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy" decoding="async" width="600" height="450">' +
          '<span class="mcard__cat"><i class="fas ' + catIco(item.cat) + '"></i> ' + item.cat + '</span>' +
          flag +
        '</div>' +
        '<div class="mcard__body">' +
          '<h3 class="mcard__title">' + item.name + '</h3>' +
          '<p class="mcard__desc">' + item.desc + '</p>' +
          '<div class="mcard__foot">' +
            '<div class="mcard__price">' + fromTag + '<span class="mcard__price-now">' + CURRENCY(item.price) + '</span>' + was + '</div>' +
            '<span class="mcard__cta"><i class="fas fa-plus" aria-hidden="true"></i> Pilih</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function render() {
    var q = query.trim().toLowerCase();
    var list = MENU.filter(function (m) {
      var okCat = activeCat === 'Semua' || m.cat === activeCat;
      var okQ = !q || m.name.toLowerCase().indexOf(q) > -1 || m.desc.toLowerCase().indexOf(q) > -1;
      return okCat && okQ;
    });

    if (!list.length) {
      grid.innerHTML = '<div class="empty">' +
        '<i class="fas fa-face-frown" aria-hidden="true"></i>' +
        '<p>Jajanan tidak ditemukan.<br>Coba kata kunci atau kategori lain.</p></div>';
      return;
    }
    grid.innerHTML = list.map(cardHtml).join('');
  }

  /* ---------- 2. Filter kategori (dinonaktifkan) ---------- */
  function setCat(cat) {
    activeCat = cat;
    render();
  }

  /* ---------- 3. Pencarian ---------- */
  var searchInput = doc.getElementById('menu-search');
  var searchClear = doc.getElementById('search-clear');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      query = searchInput.value;
      if (searchClear) searchClear.hidden = !query;
      render();
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', function () {
      searchInput.value = ''; query = ''; searchClear.hidden = true;
      searchInput.focus(); render();
    });
  }

  /* ==========================================================================
     4. POPUP PILIH ITEM
     ========================================================================== */
  var sheet = doc.getElementById('order-sheet');
  var state = { item: null, qty: 1, choices: {} };

  function openSheet(item) {
    state.item = item;
    state.qty = 1;
    state.choices = {};

    doc.getElementById('order-img').src = item.img;
    doc.getElementById('order-img').alt = item.name;
    doc.getElementById('order-cat').textContent = item.cat;
    doc.getElementById('order-title').textContent = item.name;
    doc.getElementById('order-desc').textContent = item.desc;
    doc.getElementById('order-price').textContent = CURRENCY(item.price);
    var fromEl = doc.getElementById('order-from');
    if (fromEl) { fromEl.textContent = item.from ? 'Mulai dari' : ''; fromEl.hidden = !item.from; }
    var wasEl = doc.getElementById('order-was');
    wasEl.textContent = item.was ? CURRENCY(item.was) : '';
    wasEl.hidden = !item.was;
    doc.getElementById('order-qty').textContent = '1';
    doc.getElementById('order-note').value = '';

    var wrap = doc.getElementById('opt-groups');
    if (item.opts && item.opts.length) {
      wrap.innerHTML = item.opts.map(function (g) {
        var required = !!g.required;
        var choicesHtml = g.choices.map(function (ch) {
          var inputType = g.type === 'check' ? 'checkbox' : 'radio';
          var add = ch.add ? '<span class="choice__add">+' + CURRENCY(ch.add).replace('Rp', 'Rp ') + '</span>' : '';
          return '<label class="choice">' +
            '<input type="' + inputType + '" name="opt-' + g.key + '" value="' + ch.id + '"' +
              ' data-add="' + (ch.add || 0) + '"' +
              (g.type === 'radio' && g.choices[0] && ch.id === g.choices[0].id ? ' checked' : '') + '>' +
            '<span class="choice__box"><i class="fas fa-check" aria-hidden="true"></i></span>' +
            '<span class="choice__label">' + ch.label + '</span>' + add +
          '</label>';
        }).join('');
        return '<fieldset class="opt-group">' +
          '<legend class="opt-group__label">' + g.label +
            (required ? ' <span class="req">wajib</span>' : ' <span>(opsional)</span>') + '</legend>' +
          '<div class="choices choices--' + g.type + '">' + choicesHtml + '</div>' +
        '</fieldset>';
      }).join('');

      item.opts.forEach(function (g) {
        if (g.type === 'radio') state.choices[g.key] = [g.choices[0].id];
        else state.choices[g.key] = [];
      });
      wrap.hidden = false;
    } else {
      wrap.innerHTML = '';
      wrap.hidden = true;
    }

    updateTotal();
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    doc.body.style.overflow = 'hidden';
    var sc = sheet.querySelector('.sheet__scroll');
    if (sc) sc.scrollTop = 0;
  }

  function closeSheet() {
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    if (!doc.getElementById('cart-sheet').classList.contains('is-open')) doc.body.style.overflow = '';
  }

  doc.getElementById('opt-groups').addEventListener('change', function (e) {
    var input = e.target;
    if (input.tagName !== 'INPUT') return;
    var key = input.name.replace('opt-', '');
    if (input.type === 'radio') {
      state.choices[key] = [input.value];
    } else {
      var arr = state.choices[key] || [];
      var idx = arr.indexOf(input.value);
      if (input.checked && idx === -1) arr.push(input.value);
      if (!input.checked && idx > -1) arr.splice(idx, 1);
      state.choices[key] = arr;
    }
    updateTotal();
  });

  sheet.addEventListener('click', function (e) {
    var q = e.target.closest('[data-qty]');
    if (q) {
      state.qty = Math.max(1, state.qty + (q.getAttribute('data-qty') === 'inc' ? 1 : -1));
      doc.getElementById('order-qty').textContent = state.qty;
      updateTotal();
      return;
    }
    if (e.target.closest('[data-close]')) closeSheet();
  });

  function unitPrice() { return (state.item ? state.item.price : 0) + extraFromChoices(state.item, state.choices); }

  function updateTotal() {
    doc.getElementById('order-total').textContent = CURRENCY(unitPrice() * state.qty);
  }

  /* ==========================================================================
     5. KERANJANG — state, render, tambah, hapus
     ========================================================================== */
  var cart = [];
  var cartBar = doc.getElementById('cartbar');
  var cartSheet = doc.getElementById('cart-sheet');
  var cartList = doc.getElementById('cart-list');

  function cartCount() {
    return cart.reduce(function (n, r) { return n + r.qty; }, 0);
  }
  function cartTotal() {
    return cart.reduce(function (n, r) { return n + r.qty * r.unit; }, 0);
  }
  /* Kunci baris = item + kombinasi opsi, supaya yang sama digabung qty-nya */
  function lineKey(item, choices) {
    var parts = [];
    if (item.opts) {
      item.opts.forEach(function (g) {
        parts.push(g.key + ':' + ((choices && choices[g.key]) || []).slice().sort().join('|'));
      });
    }
    return item.id + '#' + parts.join(';');
  }

  function addToCart(item, choices, qty, note) {
    var key = lineKey(item, choices);
    var existing = null;
    for (var i = 0; i < cart.length; i++) { if (cart[i].key === key) { existing = cart[i]; break; } }
    if (existing) {
      existing.qty += qty;
      if (note) existing.note = note;
    } else {
      cart.push({
        key: key, id: item.id, name: item.name, img: item.img, cat: item.cat,
        qty: qty, unit: item.price + extraFromChoices(item, choices),
        labels: pickedLabels(item, choices), note: note || ''
      });
    }
    renderCart();
  }

  function renderCart() {
    var n = cartCount(), total = cartTotal();

    // badge tombol keranjang di header
    var hb = doc.getElementById('head-cart-badge');
    if (hb) {
      if (n > 0) { hb.hidden = false; hb.textContent = n > 99 ? '99+' : n; }
      else { hb.hidden = true; }
    }

    // bar mengambang
    if (n > 0) {
      cartBar.hidden = false;
      doc.body.classList.add('has-cart');
      doc.getElementById('cart-count').textContent = n + ' item';
      doc.getElementById('cart-total').textContent = CURRENCY(total);
    } else {
      cartBar.hidden = true;
      doc.body.classList.remove('has-cart');
    }

    // panel
    doc.getElementById('cart-sub').textContent = n
      ? 'Periksa pesananmu, lalu kirim lewat WhatsApp.'
      : 'Belum ada item. Pilih menu dulu ya.';
    doc.getElementById('cart-n').textContent = '(' + n + ' item)';
    doc.getElementById('cart-sum').textContent = CURRENCY(total);
    var submit = doc.getElementById('cart-submit');
    submit.disabled = n === 0;
    doc.getElementById('cart-clear').hidden = n === 0;

    if (!n) {
      cartList.innerHTML = '<div class="cart-empty">' +
        '<i class="fas fa-cart-shopping" aria-hidden="true"></i>' +
        '<p>Keranjangmu masih kosong.<br>Tap menu favoritmu untuk mulai pesan.</p>' +
        '<button class="btn btn--red" type="button" data-close>' +
        '<i class="fas fa-utensils" aria-hidden="true"></i> Lihat Menu</button></div>';
      return;
    }

    cartList.innerHTML = cart.map(function (r, i) {
      var optsHtml = r.labels.map(function (o) {
        return '<b>' + esc(o.label) + ':</b> ' + esc(o.text);
      }).join(' · ');
      if (r.note) optsHtml += (optsHtml ? ' · ' : '') + '<b>Catatan:</b> ' + esc(r.note);
      return '<div class="cart-row" data-i="' + i + '">' +
        '<img class="cart-row__img" src="' + r.img + '" alt="" width="62" height="62" loading="lazy">' +
        '<div class="cart-row__body">' +
          '<div class="cart-row__name">' + esc(r.name) + '</div>' +
          '<div class="cart-row__opts">' + optsHtml + '</div>' +
          '<div class="cart-row__under">' +
            '<span class="cart-row__price">' + CURRENCY(r.unit) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="cart-row__right">' +
          '<button class="cart-row__del" type="button" data-del aria-label="Hapus ' + esc(r.name) + '">' +
            '<i class="fas fa-trash-can" aria-hidden="true"></i></button>' +
          '<div class="qty qty--sm">' +
            '<button class="qty__btn" type="button" data-q="-1" aria-label="Kurangi">&minus;</button>' +
            '<span class="qty__val">' + r.qty + '</span>' +
            '<button class="qty__btn" type="button" data-q="1" aria-label="Tambah">+</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('') +
      '<button class="cart-more" type="button" data-close>' +
        '<i class="fas fa-plus" aria-hidden="true"></i> Tambah menu lain</button>';
  }

  /* -- Tambah ke keranjang dari popup -- */
  doc.getElementById('order-add').addEventListener('click', function () {
    var item = state.item;
    if (!item) return;
    addToCart(item, state.choices, state.qty, doc.getElementById('order-note').value.trim());
    closeSheet();
    toast(item.name + ' x' + state.qty + ' masuk keranjang.');
  });

  /* -- Buka / tutup panel keranjang -- */
  function openCart() {
    cartSheet.classList.add('is-open');
    cartSheet.setAttribute('aria-hidden', 'false');
    doc.body.style.overflow = 'hidden';
    var sc = cartSheet.querySelector('.sheet__scroll');
    if (sc) sc.scrollTop = 0;
  }
  function closeCart() {
    cartSheet.classList.remove('is-open');
    cartSheet.setAttribute('aria-hidden', 'true');
    if (!sheet.classList.contains('is-open')) doc.body.style.overflow = '';
  }

  doc.getElementById('cart-open').addEventListener('click', openCart);
  var headCartBtn = doc.getElementById('head-cart-btn');
  if (headCartBtn) headCartBtn.addEventListener('click', openCart);
  cartSheet.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) { closeCart(); return; }

    var row = e.target.closest('.cart-row');
    if (!row) return;
    var i = Number(row.getAttribute('data-i'));

    if (e.target.closest('[data-del]')) {
      var removed = cart[i];
      cart.splice(i, 1);
      renderCart();
      if (removed) toast(removed.name + ' dihapus dari keranjang.');
      return;
    }
    var q = e.target.closest('[data-q]');
    if (q) {
      cart[i].qty = Math.max(1, cart[i].qty + Number(q.getAttribute('data-q')));
      renderCart();
    }
  });

  doc.getElementById('cart-clear').addEventListener('click', function () {
    if (!cart.length) return;
    cart = [];
    renderCart();
    toast('Keranjang dikosongkan.');
  });

  /* ==========================================================================
     6. KIRIM KE WHATSAPP
     ========================================================================== */
  doc.getElementById('cart-submit').addEventListener('click', function () {
    if (!cart.length) return;

    var lines = ['Halo ' + STORE + ', saya mau pesan:', ''];
    cart.forEach(function (r, i) {
      lines.push((i + 1) + '. ' + r.name + ' x' + r.qty);
      r.labels.forEach(function (o) { lines.push('    ' + o.label + ': ' + o.text); });
      lines.push('    Subtotal: ' + CURRENCY(r.unit * r.qty));
    });

    lines.push('');
    lines.push('Total: ' + CURRENCY(cartTotal()) + ' (' + cartCount() + ' item)');

    var name = doc.getElementById('cust-name').value.trim();
    var note = doc.getElementById('cust-note').value.trim();
    if (name) lines.push('Nama: ' + name);
    if (note) lines.push('Catatan: ' + note);
    lines.push('');
    lines.push('Mohon konfirmasi ketersediaan & ongkir. Terima kasih!');

    const payload = btoa(JSON.stringify({ nama: name || 'Pelanggan', nomor: '0', nominal: cartTotal() }));
    lines.push('');
    lines.push('💳 Link Pembayaran (QRIS):');
    lines.push(`https://dewanyanyemil.siindev.web.id/pay/${payload}`);
    openWA(lines.join('\n'));
    closeCart();
  });

  /* -- Esc menutup panel yang terbuka -- */
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (cartSheet.classList.contains('is-open')) closeCart();
    else closeSheet();
  });

  /* -- Ketuk kartu -> buka popup -- */
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.mcard');
    if (card) openSheet(byId(card.getAttribute('data-id')));
  });
  grid.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest('.mcard');
    if (card) { e.preventDefault(); openSheet(byId(card.getAttribute('data-id'))); }
  });

  /* -- Tombol "Chat" di header & footer: WA umum -- */
  doc.querySelectorAll('[data-order-now]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openWA('Halo ' + STORE + ', saya mau pesan. Boleh info menu & ongkirnya?');
    });
  });

  /* ---------- 7. Header shadow saat scroll ---------- */
  var head = doc.querySelector('.site-head');
  var onScroll = function () { if (head) head.classList.toggle('is-stuck', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Inisialisasi ---------- */
  render();
  renderCart();
})();
