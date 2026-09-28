export const getProducts = (api, params = {}, config = {}) =>
  api.get("/products", { ...config, params });

export const getSellerProducts = (api, config = {}) =>
  api.get("/products/mine", config);

export const getProduct = (api, productId, config = {}) =>
  api.get(`/products/${productId}`, config);

export const createProduct = (api, formData) => api.post("/products", formData);

export const updateProduct = (api, productId, formData) =>
  api.put(`/products/${productId}`, formData);

export const deleteProduct = (api, productId) =>
  api.delete(`/products/${productId}`);
