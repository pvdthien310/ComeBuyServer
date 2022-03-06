module.exports = app => {
    const productImages = require("../controller/productImage.controller");
    var router = require("express").Router();
    // Create a new product image
    router.post("/", productImages.create);
    // Retrieve all product images
    router.get("/", productImages.findAll);
    // Retrieve a single product image with id
    router.get("/:id", productImages.findOne);
    // Update a product image with id
    router.put("/:id", productImages.update);
    // Delete a product image with id
    router.delete("/:id", productImages.delete);
    // Delete all product images
    router.delete("/", productImages.deleteAll);
    // Add feature for product image
    app.use('/api/productImage', router);
  };