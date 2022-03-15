module.exports = app => {
    const branchs = require("../controller/branch.controller");
    var router = require("express").Router();
    // Create a new product image
    router.post("/", branchs.create);
    // Retrieve all product images
    router.get("/", branchs.findAll);
    // Retrieve a single product image with id
    router.get("/:id", branchs.findOne);
    // Update a product image with id
    router.put("/:id", branchs.update);
    // Delete a product image with id
    router.delete("/:id", branchs.delete);
    // Delete all product images
    router.delete("/", branchs.deleteAll);
    // Add feature for product image
    app.use('/api/branch', router);
  };