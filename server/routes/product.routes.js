const { authenToken } = require("../middlewares/authenMiddleware");

module.exports = app => {
  const product = require("../controller/product.controller");
  var router = require("express").Router();
  // Create a new product
  router.post("/", authenToken, product.create);
  // Retrieve all products
  router.get("/", product.findAll);
  // Retrieve a single product with id
  router.get("/:id", product.findOne);
  // Update a product with id
  router.put("/:id", authenToken, product.update);
  // Delete a product with id
  router.delete("/:id", authenToken, product.delete);
  // Delete all products 
  router.delete("/", authenToken, product.deleteAll);
  // Delete and update feature product
  router.post("/DeleteAndUpdate/Feature", authenToken, product.deleteAndUpdateFeature);
  // Add feature for product
  router.put("/:productId/:featureId", authenToken, product.addFeature)
  app.use('/api/product', router);
};