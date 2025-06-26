class CartItem {
  constructor(product) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.img = product.img;
    this.quantity = 1;
  }
} 









const cart = [];    

const addToCart = (productId) => {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  // Kiểm tra xem đã có sản phẩm trong giỏ chưa
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const newCartItem = new CartItem(product);
    cart.push(newCartItem);
  }

  renderCart();
};


const renderCart = () => {
  const cartContainer = getEle("cartContent");
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p class='p-4'>Giỏ hàng trống</p>";
    return;
  }

  let content = `
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th class="px-4 py-3">Ảnh</th>
          <th class="px-4 py-3">Tên</th>
          <th class="px-4 py-3">Giá</th>
          <th class="px-4 py-3">Số lượng</th>
          <th class="px-4 py-3">Tổng</th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(item => `
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-4 py-2"><img src="${item.img}" class="w-12 h-12 object-cover rounded"/></td>
            <td class="px-4 py-2">${item.name}</td>
            <td class="px-4 py-2">$${item.price}</td>
            <td class="px-4 py-2">${item.quantity}</td>
            <td class="px-4 py-2 font-semibold">$${item.price * item.quantity}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  cartContainer.innerHTML = content;
};







document.querySelectorAll(".btn-add-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-id");
    addToCart(id);
  });
});
