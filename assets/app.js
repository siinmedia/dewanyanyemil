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
  var WA_NUMBER = '6285225617090';
  var STORE = 'Dewanya Nyemil';
  var CURRENCY = function (n) { return 'Rp' + Number(n).toLocaleString('id-ID'); };

  /* ---------- Data menu ---------------------------------------------------
     `opts` = pilihan tambahan yang muncul di popup order. Tiap grup:
       { key: id unik, label: judul, type: 'radio'|'check', required: bool,
         choices: [{ id, label, add: tambahan harga (opsional) }] }
     `img` boleh SVG lokal atau link foto.                                        */
  var MENU = [
    // -------- Dimsum --------
    { id: 'dimsum-ayam', name: 'Dimsum Ayam', cat: 'Dimsum', price: 15000, was: 18000, flag: 'Best Seller', hot: true,
      desc: 'Dimsum ayam lembut dengan topping wortel, dikukus fresh, disajikan dengan saus spesial.',
      img: 'assets/img/dimsum-ayam.svg',
      opts: [
        { key: 'porsi', label: 'Porsi', type: 'radio', required: true, choices: [
          { id: 'isi4', label: 'Isi 4', add: 0 },
          { id: 'isi6', label: 'Isi 6', add: 7000 },
          { id: 'isi10', label: 'Isi 10', add: 18000 }
        ]},
        { key: 'saus', label: 'Saus tambahan', type: 'check', required: false, choices: [
          { id: 'mentai', label: 'Saus mentai', add: 3000 },
          { id: 'pedas', label: 'Saus pedas', add: 0 },
          { id: 'keju', label: 'Saus keju', add: 3000 }
        ]}
      ]},
    { id: 'dimsum-udang', name: 'Dimsum Udang', cat: 'Dimsum', price: 18000,
      desc: 'Dimsum isi udang utuh yang kenyal dan manis, aroma bawang putih yang menggoda.',
      img: 'assets/img/dimsum-udang.svg',
      opts: [
        { key: 'porsi', label: 'Porsi', type: 'radio', required: true, choices: [
          { id: 'isi4', label: 'Isi 4', add: 0 },
          { id: 'isi6', label: 'Isi 6', add: 9000 }
        ]}
      ]},
    { id: 'dimsum-mentai', name: 'Dimsum Mentai', cat: 'Dimsum', price: 22000, flag: 'Favorit',
      desc: 'Dimsum ayam disiram saus mentai creamy, dibakar sebentar hingga wangi.',
      img: 'assets/img/dimsum-mentai.svg' },
    { id: 'siomay', name: 'Siomay Bandung', cat: 'Dimsum', price: 12000,
      desc: 'Siomay ikan tenggiri dengan bumbu kacang gurih, kecap, dan perasan jeruk limau.',
      img: 'assets/img/siomay.svg',
      opts: [
        { key: 'level', label: 'Level bumbu kacang', type: 'radio', required: true, choices: [
          { id: 'normal', label: 'Normal', add: 0 },
          { id: 'pedas', label: 'Pedas', add: 0 }
        ]}
      ]},

    // -------- Mie Ayam --------
    { id: 'mie-ayam', name: 'Mie Ayam Original', cat: 'Mie Ayam', price: 15000, flag: 'Best Seller', hot: true,
      desc: 'Mie kenyal dengan ayam kecap manis gurih, sawi segar, dan kuah kaldu bening.',
      img: 'assets/img/mie-ayam.svg',
      opts: [
        { key: 'mie', label: 'Pilih mie', type: 'radio', required: true, choices: [
          { id: 'kuning', label: 'Mie kuning', add: 0 },
          { id: 'yamin', label: 'Mie yamin (manis)', add: 0 },
          { id: 'bihun', label: 'Bihun', add: 0 }
        ]},
        { key: 'pedas', label: 'Sambal & level', type: 'check', required: false, choices: [
          { id: 'sambal', label: 'Pakai sambal', add: 0 },
          { id: 'kuah', label: 'Kuah dipisah', add: 0 },
          { id: 'bawang', label: 'Bawang goreng ekstra', add: 2000 }
        ]}
      ]},
    { id: 'mie-ayam-bakso', name: 'Mie Ayam Bakso', cat: 'Mie Ayam', price: 20000,
      desc: 'Mie ayam lengkap dengan 3 bakso sapi kenyal dan pangsit goreng renyah.',
      img: 'assets/img/mie-ayam-bakso.svg',
      opts: [
        { key: 'mie', label: 'Pilih mie', type: 'radio', required: true, choices: [
          { id: 'kuning', label: 'Mie kuning', add: 0 },
          { id: 'yamin', label: 'Mie yamin (manis)', add: 0 }
        ]}
      ]},
    { id: 'mie-ayam-jumbo', name: 'Mie Ayam Jumbo', cat: 'Mie Ayam', price: 25000, flag: 'Porsi Besar',
      desc: 'Porsi jumbo untuk yang lapar berat: mie, ayam, bakso, pangsit, dan telur rebus.',
      img: 'assets/img/mie-ayam-jumbo.svg' },
    { id: 'mie-yamin', name: 'Mie Yamin Manis', cat: 'Mie Ayam', price: 15000,
      desc: 'Mie yamin kecap manis tanpa kuah, ayam gurih, dan taburan bawang goreng.',
      img: 'assets/img/mie-yamin.svg' },

    // -------- Kebab Berger --------
    { id: 'kebab-ayam', name: 'Kebab Ayam Berger', cat: 'Kebab', price: 17000, flag: 'Best Seller', hot: true,
      desc: 'Kebab ayam panggang dengan saus mayo, keju, dan sayuran segar dalam tortilla lembut.',
      img: 'assets/img/kebab-ayam.svg',
      opts: [
        { key: 'level', label: 'Level pedas', type: 'radio', required: true, choices: [
          { id: 'l0', label: 'Tidak pedas', add: 0 },
          { id: 'l1', label: 'Pedas sedang', add: 0 },
          { id: 'l2', label: 'Pedas maksimal', add: 0 }
        ]},
        { key: 'extra', label: 'Tambahan', type: 'check', required: false, choices: [
          { id: 'keju', label: 'Keju mozzarella ekstra', add: 5000 },
          { id: 'telur', label: 'Telur', add: 3000 },
          { id: 'saus', label: 'Saus ekstra', add: 2000 }
        ]}
      ]},
    { id: 'kebab-sapi', name: 'Kebab Sapi Berger', cat: 'Kebab', price: 22000,
      desc: 'Daging sapi bumbu lada hitam, keju mozzarella, dan saus barbekyu spesial.',
      img: 'assets/img/kebab-sapi.svg',
      opts: [
        { key: 'level', label: 'Level pedas', type: 'radio', required: true, choices: [
          { id: 'l0', label: 'Tidak pedas', add: 0 },
          { id: 'l1', label: 'Pedas sedang', add: 0 },
          { id: 'l2', label: 'Pedas maksimal', add: 0 }
        ]}
      ]},
    { id: 'kebab-sosis', name: 'Kebab Sosis Mozzarella', cat: 'Kebab', price: 20000,
      desc: 'Sosis jumbo dan mozzarella meleleh, camilan favorit anak-anak.',
      img: 'assets/img/kebab-sosis.svg' },
    { id: 'kebab-duo', name: 'Kebab Duo Combo', cat: 'Kebab', price: 35000, was: 40000, flag: 'Combo',
      desc: 'Dua kebab pilihan (ayam + sapi) dengan kentang goreng, cocok untuk berdua.',
      img: 'assets/img/kebab-duo.svg' },

    // -------- Seri Minuman --------
    { id: 'es-teh', name: 'Es Teh Jumbo', cat: 'Minuman', price: 8000,
      desc: 'Teh tubruk segar dengan es batu, manisnya bisa request sesuai selera.',
      img: 'assets/img/es-teh.svg',
      opts: [
        { key: 'manis', label: 'Tingkat manis', type: 'radio', required: true, choices: [
          { id: 'normal', label: 'Normal', add: 0 },
          { id: 'less', label: 'Kurang manis', add: 0 },
          { id: 'no', label: 'Tanpa gula', add: 0 }
        ]}
      ]},
    { id: 'lemon-tea', name: 'Lemon Tea Segar', cat: 'Minuman', price: 12000, flag: 'Segar',
      desc: 'Teh dingin dengan perasan lemon asli dan potongan lemon segar.',
      img: 'assets/img/lemon-tea.svg',
      opts: [
        { key: 'es', label: 'Es', type: 'radio', required: true, choices: [
          { id: 'normal', label: 'Es normal', add: 0 },
          { id: 'less', label: 'Sedikit es', add: 0 },
          { id: 'no', label: 'Tanpa es', add: 0 }
        ]},
        { key: 'manis', label: 'Tingkat manis', type: 'radio', required: true, choices: [
          { id: 'normal', label: 'Normal', add: 0 },
          { id: 'less', label: 'Kurang manis', add: 0 }
        ]}
      ]},
    { id: 'matcha-latte', name: 'Matcha Latte', cat: 'Minuman', price: 18000,
      desc: 'Matcha premium dengan susu segar, creamy dan tidak terlalu manis.',
      img: 'assets/img/matcha-latte.svg',
      opts: [
        { key: 'susu', label: 'Pilihan susu', type: 'radio', required: true, choices: [
          { id: 'fresh', label: 'Susu segar', add: 0 },
          { id: 'oat', label: 'Susu oat', add: 4000 }
        ]}
      ]},
    { id: 'choco-ice', name: 'Chocolate Ice', cat: 'Minuman', price: 16000, flag: 'Favorit',
      desc: 'Cokelat kental dingin dengan whipped cream dan taburan cokelat serut.',
      img: 'assets/img/choco-ice.svg' },
    { id: 'thai-tea', name: 'Thai Tea Original', cat: 'Minuman', price: 14000,
      desc: 'Thai tea autentik, manis creamy dengan susu evaporasi.',
      img: 'assets/img/thai-tea.svg' },
    { id: 'mango-yakult', name: 'Mango Yakult', cat: 'Minuman', price: 15000, flag: 'Baru',
      desc: 'Mangga segar dipadu yakult, asam manis menyegarkan.',
      img: 'assets/img/mango-yakult.svg' }
  ];

  var CATS = ['Semua', 'Dimsum', 'Mie Ayam', 'Kebab', 'Minuman'];
  var CAT_META = {
    'Semua':   { ico: 'fa-utensils',        short: 'Semua' },
    'Dimsum':  { ico: 'fa-bowl-food',       short: 'Dimsum' },
    'Mie Ayam':{ ico: 'fa-bowl-rice',       short: 'Mie Ayam' },
    'Kebab':   { ico: 'fa-drumstick-bite',  short: 'Kebab' },
    'Minuman': { ico: 'fa-mug-hot',         short: 'Minuman' }
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

  var toastEl = doc.getElementById('toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2600);
  }

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
            '<div class="mcard__price"><span class="mcard__price-now">' + CURRENCY(item.price) + '</span>' + was + '</div>' +
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

  /* ---------- 2. Chip kategori ---------- */
  var chipBar = doc.getElementById('menu-chips');
  if (chipBar) {
    chipBar.innerHTML = CATS.map(function (c) {
      var meta = CAT_META[c] || { ico: 'fa-utensils', short: c };
      var n = c === 'Semua' ? MENU.length : MENU.filter(function (m) { return m.cat === c; }).length;
      return '<button class="chip' + (c === 'Semua' ? ' is-active' : '') + '" type="button" role="tab" ' +
             'aria-selected="' + (c === 'Semua') + '" data-cat="' + c + '">' +
             '<i class="fas ' + meta.ico + ' chip__ico"></i> ' + meta.short +
             '<span class="chip__n">' + n + '</span></button>';
    }).join('');

    chipBar.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      setCat(b.getAttribute('data-cat'));
    });
  }

  function setCat(cat) {
    activeCat = cat;
    if (chipBar) {
      chipBar.querySelectorAll('.chip').forEach(function (c) {
        var on = c.getAttribute('data-cat') === cat;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      var act = chipBar.querySelector('.chip.is-active');
      if (act && act.scrollIntoView) {
        try { act.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); } catch (err) {}
      }
    }
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

    openWA(lines.join('\n'));
    closeCart();
    toast('Pesanan dibuka di WhatsApp. Tekan kirim untuk menyelesaikan.');
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

  /* -- Lompat ke kategori dari footer -- */
  doc.querySelectorAll('[data-jump]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      if (searchInput) { searchInput.value = ''; query = ''; if (searchClear) searchClear.hidden = true; }
      setCat(el.getAttribute('data-jump'));
      var bar = doc.getElementById('menu-bar');
      if (bar) window.scrollTo({ top: bar.offsetTop - 4, behavior: 'smooth' });
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
