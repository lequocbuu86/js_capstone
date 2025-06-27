import productService from "../services/product-services.js";

const getEle = (id) => document.getElementById(id);

let allProducts = [];

const showLoading = () => {
  getEle("productListContainer").innerHTML = `
    <div class="col-span-full flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  `;
};

const renderProductList = (productList) => {
  let content = "";
  productList.forEach((product) => {
    content += `
      <div class="product max-w-sm bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div class="relative overflow-hidden">
          <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" src="${product.img}" alt="${product.name}" />
          <div class="absolute top-4 right-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              product.type.toLowerCase() === 'iphone' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }">
              ${product.type}
            </span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200 dark:text-white">
            ${product.name}
          </h3>
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>$${product.price}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>${product.screen}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>${product.backCamera}</span>
            </div>
          </div>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-400">
            ${product.desc}
          </p>
          <button type="button" 
                  class="btn-add-cart w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium flex items-center justify-center space-x-2" 
                  data-id="${product.id}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
            </svg>
            <span>Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    `;
  });
  getEle("productListContainer").innerHTML = content;
};

const fetchProductList = () => {
  showLoading();
  productService
    .getProductList()
    .then((res) => {
      allProducts = res.data;
      window.allProducts = allProducts;
      renderProductList(allProducts);
    })
    .catch((err) => {
      console.error(err);
      getEle("productListContainer").innerHTML = `
        <div class="col-span-full text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không thể tải sản phẩm</h3>
          <p class="mt-1 text-sm text-gray-500">Vui lòng thử lại sau.</p>
          <div class="mt-6">
            <button onclick="location.reload()" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Thử lại
            </button>
          </div>
        </div>
      `;
    });
};

// Filter theo loại
getEle("productFilter").addEventListener("change", () => {
  const type = getEle("productFilter").value.toLowerCase();
  const filtered =
    type === "all"
      ? allProducts
      : allProducts.filter((p) => p.type.toLowerCase() === type);
  renderProductList(filtered);

  const count = filtered.length;
  const message = count === 0 ? "Không tìm thấy sản phẩm nào" : `Tìm thấy ${count} sản phẩm`;

  let notification = document.getElementById('filter-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'filter-notification';
    notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
});

// Filter theo hãng (brand)
getEle("brandFilter").addEventListener("change", (e) => {
  const selectedType = e.target.value.toLowerCase();
  const filtered =
    selectedType === "all"
      ? allProducts
      : allProducts.filter(p => p.type.toLowerCase() === selectedType);
  renderProductList(filtered);
  console.log("All Products:", allProducts);
  console.log("Selected Brand:", selectedType);
  console.log("Filtered:", filtered);  
});

// Fetch danh sách sản phẩm lúc load
fetchProductList();
