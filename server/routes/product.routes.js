const { authenToken } = require("../middlewares/authenMiddleware");

module.exports = app => {
    const product = require("../controller/product.controller");
    var router = require("express").Router();
    // Create a new product
    router.post("/", product.create);
    // Retrieve all products
    router.get("/", product.findAll);
    // Retrieve a single product with id
    router.get("/:id", product.findOne);
    // Update a product with id
    router.put("/:id",authenToken, product.update);
    // Delete a product with id
    router.delete("/:id", product.delete);
    // Delete all products 
    router.delete("/", product.deleteAll);
    // Delete and update feature product
    router.post("/DeleteAndUpdate/Feature", product.deleteAndUpdateFeature);
    // Add feature for product
    router.put("/:productId/:featureId", product.addFeature)
    app.use('/api/product', router);
  };