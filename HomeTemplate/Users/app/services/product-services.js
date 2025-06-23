const BASE_URL = "https://66a7412753c13f22a3d0092b.mockapi.io/products";

class ProductService {
  getProductList = () => {
    return axios({
      url: BASE_URL,
      method: "GET",
    });
  };
}

const productService = new ProductService();
export default productService; 