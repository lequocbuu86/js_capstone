// Định nghĩa lớp CartItem
class CartItem {
  constructor(product) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.img = product.img;
    this.quantity = 1;
  }
}

// Biến toàn cục giỏ hàng
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Lưu giỏ hàng vào localStorage
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Thêm sản phẩm vào giỏ
const addToCart = (productId) => {
  const product = window.allProducts.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(new CartItem(product));
  }

  saveCart();
  showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
  updateCartBadge();
  renderCart();
};

// Xóa sản phẩm khỏi giỏ
const removeFromCart = (productId) => {
  const index = cart.findIndex(item => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCart();
  }
};

// Cập nhật số lượng
const updateQuantity = (productId, change) => {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartBadge();
      renderCart();
    }
  }
};

// Xóa toàn bộ giỏ
const clearCart = () => {
  cart.length = 0;
  saveCart();
  updateCartBadge();
  renderCart();
  showNotification('Đã xóa tất cả sản phẩm khỏi giỏ hàng!');
};

// Hiển thị tổng tiền
const getTotalPrice = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Cập nhật huy hiệu giỏ hàng
const updateCartBadge = () => {
  cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartButton = document.querySelector('[data-modal-target="static-modal"]');

  if (!cartButton) return;

  const existingBadge = cartButton.querySelector('.cart-badge');
  if (existingBadge) existingBadge.remove();

  if (totalItems > 0) {
    const badge = document.createElement('span');
    badge.className = 'cart-badge absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center';
    badge.textContent = totalItems;
    cartButton.style.position = 'relative';
    cartButton.appendChild(badge);
  }
};

// Hiển thị thông báo
const showNotification = (message) => {
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
  notification.textContent = message;

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

// Render giao diện giỏ hàng
const renderCart = () => {
  cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartBody = document.getElementById("cartBody");
  const totalMoney = document.getElementById("totalMoney");
  if (!cartBody) return;

  let content = "";
  cart.forEach(item => {
    const total = item.price * item.quantity;
    content += `
      <tr class="hover:bg-gray-50 transition">
        <td class="px-4 py-3"><img src="${item.img}" alt="${item.name}" class="h-16 w-16 object-contain rounded-md shadow-sm" /></td>
        <td class="px-4 py-3 font-semibold text-gray-800">${item.name}</td>
        <td class="px-4 py-3 text-gray-700">$${item.price}</td>
        <td class="px-4 py-3 text-center">
          <button class="decrease-btn px-2 font-bold text-lg" data-id="${item.id}">-</button>
          ${item.quantity}
          <button class="increase-btn px-2 font-bold text-lg" data-id="${item.id}">+</button>
        </td>
        <td class="px-4 py-3 text-blue-600 font-semibold">$${total.toFixed(2)}</td>
        <td class="px-4 py-3"><button class="remove-btn text-red-600 hover:underline" data-id="${item.id}">Xóa</button></td>
      </tr>
    `;
  });
  cartBody.innerHTML = content;

  // Gắn event
  cartBody.querySelectorAll(".increase-btn").forEach(btn =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.id, 1))
  );
  cartBody.querySelectorAll(".decrease-btn").forEach(btn =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.id, -1))
  );
  cartBody.querySelectorAll(".remove-btn").forEach(btn =>
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id))
  );

  if (totalMoney) {
    totalMoney.textContent = `$${getTotalPrice().toFixed(2)}`;
  }
};

// Khởi tạo sau khi DOM load
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
      const productId = e.target.getAttribute('data-id');
      addToCart(productId);
    }
  });

  const cartButton = document.querySelector('[data-modal-target="static-modal"]');
  if (cartButton) {
    cartButton.addEventListener('click', () => {
      renderCart();
    });
  }

  updateCartBadge();
});
