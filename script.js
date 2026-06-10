/* ============================================================
   script.js — Lifa Flora E-Commerce (FIXED VERSION)
   ============================================================ */

const products = [
  { id:1, name:"Rose Elegance", price:185000, emoji:"🌹", image:"images/rose.jpg", desc:"Buket mawar merah premium, cocok untuk anniversary atau ungkapan cinta.", category:"anniversary", hot:true },
  { id:2, name:"Cherry Blossom Dream", price:165000, emoji:"🌸", image:"images/chery blosoom.jpeg", desc:"Buket bunga sakura pastel lembut, tampilan aesthetic dan romantis.", category:"ulang tahun", hot:false },
  { id:3, name:"Sunflower Glow", price:145000, emoji:"🌻", image:"images/sunflower glow.jpeg", desc:"Buket bunga matahari ceria, cocok untuk teman wisuda atau hadiah.", category:"wisuda", hot:true },
  { id:4, name:"Pastel Tulip", price:175000, emoji:"🌷", image:"images/pastel tulip.jpeg", desc:"Buket tulip warna pastel campuran, elegan dan modern.", category:"anniversary", hot:false },
  { id:5, name:"Mix Garden", price:210000, emoji:"💐", image:"images/mix garden.jpeg", desc:"Buket campur berbagai bunga segar pilihan, tampil mewah dan penuh warna.", category:"ulang tahun", hot:true },
  { id:6, name:"Wisuda Prestasi", price:155000, emoji:"🎓", image:"images/wisuda.jpeg", desc:"Spesial untuk wisudawan, dikemas dengan pita emas dan ucapan selamat.", category:"wisuda", hot:false },
  { id:7, name:"Lavender Kiss", price:195000, emoji:"💜", image:"images/lavender kiss.jpeg", desc:"Buket lavender ungu memikat, aromaterapi alami dan visual cantik.", category:"custom", hot:false },
  { id:8, name:"White Lily Pure", price:225000, emoji:"🤍", image:"images/white lili.jpeg", desc:"Buket lily putih bersih dan mewah, cocok untuk acara formal dan pernikahan.", category:"custom", hot:true }
];

let cart = [];
let currentFilter = "semua";

function formatPrice(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

function renderProducts(filter = "semua") {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";
  const filtered = filter === "semua" ? products : products.filter(p => p.category === filter);
  filtered.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${index * 0.07}s`;
    card.innerHTML = `
      <div class="product-img-wrapper">
        ${product.image
          ? `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
             <div class="product-emoji" style="display:none">${product.emoji}</div>`
          : `<div class="product-emoji">${product.emoji}</div>`}
        <span class="product-badge">${capitalizeFirst(product.category)}</span>
        ${product.hot ? '<span class="product-badge badge-hot">🔥 Terlaris</span>' : ""}
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-cart-btn" onclick="addToCart(${product.id})">+ Keranjang</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light);"><div style="font-size:3rem;margin-bottom:1rem">🌿</div><p>Belum ada produk dalam kategori ini.</p></div>`;
  }
}

function capitalizeFirst(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

function filterProducts(category, btn) {
  currentFilter = category;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) {
    btn.classList.add("active");
  } else {
    const matchedBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
    if (matchedBtn) matchedBtn.classList.add("active");
  }
  renderProducts(category);
}

function openCategory(category) {
  filterProducts(category);
  const productsSection = document.getElementById("products");
  if (productsSection) {
    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
    const topPosition = productsSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
    window.scrollTo({ top: topPosition, behavior: "smooth" });
  }
}

function addToCart(productId) {
  const normalizedId = Number(productId);
  const product = products.find(p => Number(p.id) === normalizedId);
  if (!product) return;

  const existingItem = cart.find(item => Number(item.id) === normalizedId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
  }

  updateCartUI();
  showToast(`🌸 "${product.name}" ditambahkan ke keranjang!`);
}

function changeQty(productId, delta) {
  const normalizedId = Number(productId);
  const item = cart.find(i => Number(i.id) === normalizedId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => Number(i.id) !== normalizedId);
  updateCartUI();
}

function removeFromCart(productId) {
  const normalizedId = Number(productId);
  cart = cart.filter(i => Number(i.id) !== normalizedId);
  updateCartUI();
  showToast("❌ Item dihapus dari keranjang.");
}

function clearCart() {
  if (cart.length === 0) return;
  showConfirmModal("Kosongkan Keranjang?", "Semua item akan dihapus dari keranjang.", () => {
    cart = [];
    updateCartUI();
    showToast("🗑️ Keranjang dikosongkan.");
  });
}

function updateCartUI() {
  cart = cart.filter(item => item && Number(item.qty) > 0);

  const totalItems = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
  const countEl = document.getElementById("cartCount");
  if (countEl) {
    countEl.textContent = totalItems > 0 ? totalItems : "0";
    countEl.style.display = totalItems > 0 ? "flex" : "none";
  }

  const cartItemsEl  = document.getElementById("cartItems");
  const cartEmptyEl  = document.getElementById("cartEmpty");
  const cartFooterEl = document.getElementById("cartFooter");
  const subtotalEl   = document.getElementById("subtotalPrice");
  const totalEl      = document.getElementById("totalPrice");

  if (cart.length === 0) {
    if (cartItemsEl) cartItemsEl.innerHTML = "";
    if (cartEmptyEl) cartEmptyEl.style.display = "flex";
    if (cartItemsEl && cartEmptyEl) cartItemsEl.appendChild(cartEmptyEl);
    if (cartFooterEl) cartFooterEl.style.display = "none";
    if (subtotalEl) subtotalEl.textContent = formatPrice(0);
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }

  if (cartEmptyEl) cartEmptyEl.style.display = "none";
  if (cartFooterEl) cartFooterEl.style.display = "block";
  if (cartItemsEl) cartItemsEl.innerHTML = "";
  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
        <button class="cart-remove" data-action="remove" data-id="${item.id}">✕</button>
      </div>`;
    if (cartItemsEl) cartItemsEl.appendChild(el);
  });
  if (cartItemsEl) {
    cartItemsEl.querySelectorAll("button[data-action]").forEach(btn => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id);
      const action = this.dataset.action;
      if (action === "minus")  changeQty(id, -1);
      if (action === "plus")   changeQty(id, +1);
      if (action === "remove") removeFromCart(id);
    });
    });
  }
  if (subtotalEl) subtotalEl.textContent = formatPrice(totalPrice);
  if (totalEl) totalEl.textContent = formatPrice(totalPrice);
}

function toggleCart() {
  const sidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");
  sidebar.classList.toggle("open");
  overlay.classList.toggle("open");
  document.body.style.overflow = sidebar.classList.contains("open") ? "hidden" : "";
}

function checkout() {
  if (cart.length === 0) { showToast("❗ Keranjangmu masih kosong!"); return; }
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemsHTML = cart.map(item => `
    <div class="receipt-item">
      <span class="receipt-emoji">${item.emoji}</span>
      <div class="receipt-item-info">
        <span class="receipt-name">${item.name}</span>
        <span class="receipt-qty">x${item.qty}</span>
      </div>
      <span class="receipt-price">${formatPrice(item.price * item.qty)}</span>
    </div>`).join("");
  const now = new Date();
  const tgl = now.toLocaleDateString("id-ID", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const jam = now.toLocaleTimeString("id-ID", { hour:"2-digit", minute:"2-digit" });
  const orderNum = "LF" + Date.now().toString().slice(-6);
  showReceiptModal(`
    <div class="receipt-modal">
      <div class="receipt-header">
        <div class="receipt-flower">🌸</div>
        <h2>Pesanan Diterima!</h2>
        <p>Terima kasih sudah memesan di Lifa Flora 💐</p>
      </div>
      <div class="receipt-order-num">
        <span>No. Pesanan</span>
        <strong>#${orderNum}</strong>
      </div>
      <div class="receipt-date"><span>📅 ${tgl} · ${jam} WIB</span></div>
      <div class="receipt-divider">— Rincian Pesanan —</div>
      <div class="receipt-items">${itemsHTML}</div>
      <div class="receipt-divider"></div>
      <div class="receipt-summary">
        <div class="receipt-row"><span>Subtotal</span><span>${formatPrice(totalPrice)}</span></div>
        <div class="receipt-row"><span>Ongkir</span><span class="free-green">✓ GRATIS</span></div>
        <div class="receipt-row receipt-total"><strong>Total Bayar</strong><strong>${formatPrice(totalPrice)}</strong></div>
      </div>
      <div class="receipt-note">🌿 Kami akan segera menghubungi kamu via WhatsApp untuk konfirmasi pesanan.</div>
      <button class="btn btn-primary btn-full receipt-ok-btn" onclick="closeReceiptModal()">✓ Oke, Terima Kasih!</button>
    </div>`, () => {
    cart = [];
    updateCartUI();
    toggleCart();
    showToast("✅ Pesanan berhasil! Kami akan segera menghubungi kamu 💐");
  });
}

let receiptCallback = null;
function showReceiptModal(htmlContent, callback) {
  receiptCallback = callback;
  let overlay = document.getElementById("receiptOverlay");
  if (!overlay) { overlay = document.createElement("div"); overlay.id = "receiptOverlay"; overlay.className = "receipt-overlay"; document.body.appendChild(overlay); }
  overlay.innerHTML = `<div class="receipt-box">${htmlContent}</div>`;
  overlay.style.display = "flex";
  setTimeout(() => overlay.classList.add("open"), 10);
  document.body.style.overflow = "hidden";
}
function closeReceiptModal() {
  const overlay = document.getElementById("receiptOverlay");
  if (overlay) { overlay.classList.remove("open"); setTimeout(() => { overlay.style.display = "none"; }, 350); }
  document.body.style.overflow = "";
  if (receiptCallback) { receiptCallback(); receiptCallback = null; }
}

function showConfirmModal(title, desc, onConfirm) {
  let overlay = document.getElementById("confirmOverlay");
  if (!overlay) { overlay = document.createElement("div"); overlay.id = "confirmOverlay"; overlay.className = "receipt-overlay"; document.body.appendChild(overlay); }
  overlay.innerHTML = `
    <div class="receipt-box confirm-box">
      <div style="font-size:2.5rem;margin-bottom:0.75rem">🗑️</div>
      <h3 style="font-family:'Playfair Display',serif;margin-bottom:0.5rem">${title}</h3>
      <p style="color:var(--text-mid);font-size:0.9rem;margin-bottom:1.5rem">${desc}</p>
      <div style="display:flex;gap:0.75rem">
        <button class="btn btn-outline btn-full" onclick="closeConfirmModal()">Batal</button>
        <button class="btn btn-primary btn-full" id="confirmYesBtn">Ya, Hapus</button>
      </div>
    </div>`;
  overlay.style.display = "flex";
  setTimeout(() => overlay.classList.add("open"), 10);
  document.body.style.overflow = "hidden";
  document.getElementById("confirmYesBtn").addEventListener("click", () => { closeConfirmModal(); onConfirm(); });
}
function closeConfirmModal() {
  const overlay = document.getElementById("confirmOverlay");
  if (overlay) { overlay.classList.remove("open"); setTimeout(() => { overlay.style.display = "none"; }, 350); }
  document.body.style.overflow = "";
}

function closeMenu() {
  const nav = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
  if (hamburger) hamburger.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  const nav = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");
  const isOpen = nav.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  if (hamburger) hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => closeMenu());
});

document.addEventListener("click", (event) => {
  const nav = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");
  if (window.innerWidth <= 767 && nav && hamburger && !nav.contains(event.target) && !hamburger.contains(event.target)) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 767) closeMenu();
});

window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 50);
});

window.addEventListener("scroll", () => {
  const sections = ["home", "products", "contact"];
  let current = "home";
  sections.forEach(id => { const s = document.getElementById(id); if (s && window.scrollY >= s.offsetTop - 120) current = id; });
  document.querySelectorAll(".nav-link").forEach(link => { link.classList.toggle("active", link.getAttribute("href") === "#" + current); });
});

function openInfoCardByHash(hash) {
  const normalizedHash = hash.replace("#", "");
  const cards = document.querySelectorAll(".info-card");
  if (!cards.length) return;

  cards.forEach(card => {
    const button = card.querySelector(".info-toggle");
    const panel = card.querySelector(".info-panel");
    const isTarget = card.id === normalizedHash;

    card.classList.toggle("active", isTarget);
    if (button) button.setAttribute("aria-expanded", isTarget ? "true" : "false");
    if (panel) panel.setAttribute("aria-hidden", isTarget ? "false" : "true");
  });

  if (normalizedHash) {
    const targetCard = document.getElementById(normalizedHash);
    if (targetCard) {
      setTimeout(() => {
        const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
        const topPosition = targetCard.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
        window.scrollTo({ top: topPosition, behavior: "smooth" });
      }, 50);
    }
  }
}

function initInfoAccordion() {
  const cards = document.querySelectorAll(".info-card");
  if (!cards.length) return;

  cards.forEach(card => {
    const button = card.querySelector(".info-toggle");
    const panel = card.querySelector(".info-panel");
    if (!button || !panel) return;

    button.addEventListener("click", () => {
      const shouldOpen = !card.classList.contains("active");
      cards.forEach(item => {
        const itemButton = item.querySelector(".info-toggle");
        const itemPanel = item.querySelector(".info-panel");
        item.classList.remove("active");
        if (itemButton) itemButton.setAttribute("aria-expanded", "false");
        if (itemPanel) itemPanel.setAttribute("aria-hidden", "true");
      });

      if (shouldOpen) {
        card.classList.add("active");
        button.setAttribute("aria-expanded", "true");
        panel.setAttribute("aria-hidden", "false");
      }
    });
  });

  openInfoCardByHash(window.location.hash);
}

window.addEventListener("hashchange", () => {
  openInfoCardByHash(window.location.hash);
});

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2500);
}

function submitContact() {
  const name  = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const msg   = document.getElementById("contactMsg").value.trim();
  if (!name || !phone || !msg) { showToast("❗ Semua kolom wajib diisi!"); return; }
  const waMessage = encodeURIComponent(`Halo Lifa Flora! 🌸\n\nNama  : ${name}\nHP    : ${phone}\nPesan : ${msg}`);
  window.open(`https://wa.me/6287710793723?text=${waMessage}`, "_blank");
  document.getElementById("contactName").value = "";
  document.getElementById("contactPhone").value = "";
  document.getElementById("contactMsg").value = "";
  showToast("✅ Mengarahkan ke WhatsApp...");
}

lucide.createIcons();
renderProducts("semua");
initInfoAccordion();