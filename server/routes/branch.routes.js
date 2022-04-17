module.exports = app => {
    const branch = require("../controller/branch.controller");
    var router = require("express").Router();
    // Create a new product image
    router.post("/", branch.create);
    // Retrieve all product images
    router.get("/", branch.findAll);
    // Retrieve a single product image with id
    router.get("/:id", branch.findOne);
    // Update a product image with id
    router.put("/:id", branch.update);
    // Delete a product image with id
    router.delete("/:id", branch.delete);
    // Delete all product images
    router.delete("/", branch.deleteAll);
    // Add feature for product image
    app.use('/api/branch', router);
  };