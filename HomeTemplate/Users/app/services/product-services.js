const BASE_URL = "https://683fd1e35b39a8039a55bd89.mockapi.io/api/Products";

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