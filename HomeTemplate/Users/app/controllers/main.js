import productService from "../services/product-services.js";

const getEle = (id) => document.getElementById(id);

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
          <button type="button" class="bg-blue-600 text-white px-7.5 py-2.5 rounded-full hover:bg-blue-700 transition cursor-pointer">
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
      renderProductList(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};

fetchProductList(); 



// Filter 
getEle("productFilter").addEventListener("change", () => {
const type = getEle("productFilter").ariaValueMax;
  // console.log (type); 
  const arrFiltered = PhoneList.filterPhone(type);
  renderPhoneList;
});