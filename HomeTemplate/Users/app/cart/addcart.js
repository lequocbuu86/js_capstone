class CartItem {
  constructor(product) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.img = product.img;
    this.quantity = 1;
  }
} 

// Lấy cart từ localStorage nếu có
let cart = JSON.parse(localStorage.getItem('cart') || '[]');    

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const addToCart = (productId) => {
  const product = window.allProducts.find(p => p.id === productId);
  if (!product) return;

  // Kiểm tra xem đã có sản phẩm trong giỏ chưa
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const newCartItem = new CartItem(product);
    cart.push(newCartItem);
  }

  saveCart();
  showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
  updateCartBadge();
  renderCart();
};

const removeFromCart = (productId) => {
  const index = cart.findIndex(item => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCart();
  }
};

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

const getTotalPrice = () => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const clearCart = () => {
  cart.length = 0;
  saveCart();
  updateCartBadge();
  renderCart();
  showNotification('Đã xóa tất cả sản phẩm khỏi giỏ hàng!');
};

const updateCartBadge = () => {
  cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartButton = document.querySelector('[data-modal-target="static-modal"]');
  
  // Xóa badge cũ nếu có
  const existingBadge = cartButton.querySelector('.cart-badge');
  if (existingBadge) {
    existingBadge.remove();
  }
  
  // Thêm badge mới nếu có sản phẩm
  if (totalItems > 0) {
    const badge = document.createElement('span');
    badge.className = 'cart-badge absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center';
    badge.textContent = totalItems;
    cartButton.style.position = 'relative';
    cartButton.appendChild(badge);
  }
};

const showNotification = (message) => {
  // Tạo notification element
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Hiển thị notification
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Ẩn notification sau 3 giây
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

const renderCart = () => {
  cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartBody = document.getElementById("cartBody");
  const totalMoney = document.getElementById("totalMoney");
  if (!cartBody) return;

  let content = "";
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const total = item.price * item.quantity;
    content += `
      <tr class="hover:bg-gray-50 transition">
        <td class="px-4 py-3">
          <img src="${item.img}" alt="${item.name}" class="h-16 w-16 object-contain rounded-md shadow-sm" />
        </td>
        <td class="px-4 py-3 font-semibold text-gray-800">${item.name}</td>
        <td class="px-4 py-3 text-gray-700">$${item.price}</td>
        <td class="px-4 py-3 text-center">
          <button class="decrease-btn px-2 font-bold text-lg" data-id="${item.id}">-</button>
          ${item.quantity}
          <button class="increase-btn px-2 font-bold text-lg" data-id="${item.id}">+</button>
        </td>
        <td class="px-4 py-3 text-blue-600 font-semibold">$${total.toFixed(2)}</td>
        <td class="px-4 py-3">
          <button class="remove-btn text-red-600 hover:underline" data-id="${item.id}">Xóa</button>
        </td>
      </tr>
    `;
  }
  cartBody.innerHTML = content;

  // Gắn sự kiện tăng/giảm/xóa
  cartBody.querySelectorAll(".increase-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const item = cart.find(p => p.id === id);
      if (item) {
        item.quantity++;
        saveCart();
        renderCart();
        updateCartBadge();
      }
    });
  });
  cartBody.querySelectorAll(".decrease-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const item = cart.find(p => p.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart = cart.filter(p => p.id !== id);
        }
        saveCart();
        renderCart();
        updateCartBadge();
      }
    });
  });
  cartBody.querySelectorAll(".remove-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      cart = cart.filter(p => p.id !== id);
      saveCart();
      renderCart();
      updateCartBadge();
    });
  });

  // Tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (totalMoney) totalMoney.textContent = `$${total.toFixed(2)}`;
};

// Khởi tạo event listeners khi DOM load xong
document.addEventListener('DOMContentLoaded', () => {
  // Event delegation cho nút Add to Cart
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
      const productId = e.target.getAttribute('data-id');
      addToCart(productId);
    }
  });

  // Hiển thị giỏ hàng khi click vào nút Cart
  const cartButton = document.querySelector('[data-modal-target="static-modal"]');
  if (cartButton) {
    cartButton.addEventListener('click', () => {
      renderCart();
    });
  }

  // Khởi tạo cart badge
  updateCartBadge();
});
