import productService from "../services/product-services.js";

const getEle = (id) => document.getElementById(id);

let allProducts = [];
let cart = [];

const renderProductList = (productList) => {
  let content = "";
  productList.forEach((product) => {
    content += `
      <div class="max-w-sm bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <a href="#" class="relative block aspect-[600/700] overflow-hidden rounded-lg">
          <img class="rounded-lg duration-200 hover:scale-110" src="${product.img}" alt="${product.name}" />
        </a>
        <div class="p-5">
          <h3 class="mb-3.5 mt-7.5 line-clamp-2 text-2xl text-[#181c31] hover:text-blue-600 dark:text-white dark:hover:text-primary xl:text-itemtitle2">
            <a href="#">${product.name}</a>
          </h3>
          <p class="mb-3 text-[#757693] text-base dark:text-gray-400">
            Price: $${product.price}
            <br>Screen: ${product.screen}
            <br>Back Cam: ${product.backCamera}
            <br>Front Cam: ${product.frontCamera}
            <br>${product.desc}
          </p>
          <div class="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-gray-700">
            <span class="font-medium text-black dark:text-white">${product.type}</span>
          </div>
          <br>
          <button type="button" class="btn-add-cart bg-blue-600 text-white px-7.5 py-2.5 rounded-full hover:bg-blue-700 transition cursor-pointer" data-id="${product.id}">
  Add to Cart
</button>

        </div>
      </div>
    `;
  });
  getEle("productListContainer").innerHTML = content;
};

const fetchProductList = () => {
  productService
    .getProductList()
    .then((res) => {
      allProducts = res.data;
      renderProductList(allProducts);
    })
    .catch((err) => {
      console.error(err);
    });
};


fetchProductList();

// Filter theo loại sản phẩm
getEle("productFilter").addEventListener("change", () => {
  const type = getEle("productFilter").value.toLowerCase();
  const filtered =
    type === "all"
      ? allProducts
      : allProducts.filter((p) => p.type.toLowerCase() === type);
  renderProductList(filtered);
});

getEle("brandFilter").addEventListener("change", (e) => {

  const selectedType = e.target.value.toLowerCase();

  const filtered =
    selectedType === "all"
      ? allProducts
      : allProducts.filter(p => p.type.toLowerCase() === selectedType);

  renderListProduct(filtered);
  console.log("All Products:", allProducts);
  console.log("Selected Brand:", selectedType);
  console.log("Filtered:", filtered);  


});




// Add cart
// // 
// function getEle(id) {
//   return document.getElementById(id)
// };

 
// getEle("btnthem").onclick = function () {
//   // console.log("btnthem");
//   const name = getEle("name")
// const price = getEle("price").value;
// const screen = getEle("screen").value;
// const backCamera = getEle("backCamera").value;
// const frontCamera = getEle("frontCamera").value;
// const img = getEle("img").value;

// console.log(name, price, screen, backCamera, frontCamera, img);


// };


// Gán sự kiện Add to Cart như hướng dẫn ở trên

//  Xử lý nút Add to Cart bằng event delegation:

getEle("productListContainer").addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("btn-add-cart")) {
    const productId = e.target.getAttribute("data-id");
    const product = allProducts.find(p => p.id == productId);
    if (product) {
      cart.push(product);
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
  }
});


// Hàm renderCart:

const renderCart = () => {
  const cartContainer = getEle("cartContent");
  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-gray-500">Chưa có sản phẩm nào trong giỏ hàng.</p>`;
    return;
  }

  let html = "";
  cart.forEach((product, index) => {
    html += `
      <div class="flex items-center justify-between p-4 border rounded bg-white dark:bg-gray-800">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white">${product.name}</h4>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Giá: $${product.price}</p>
        </div>
        <button class="text-red-600 hover:underline remove-btn" data-index="${index}">Xoá</button>
      </div>
    `;
  });

  cartContainer.innerHTML = html;
};

// Bắt sự kiện click vào nút "Cart" để hiển thị giỏ hàng
document.querySelector("[data-modal-target='static-modal']").addEventListener("click", () => {
  renderCart();
});


//  Xoá khỏi giỏ hàng:
getEle("cartContent").addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.getAttribute("data-index");
    cart.splice(index, 1);
    renderCart();
  }
});

