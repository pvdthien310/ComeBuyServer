module.exports = app => {
    const invoiceItem = require("../controller/invoiceItem.controller");
    var router = require("express").Router();
    // Create a new product image
    router.post("/", invoiceItem.create);
    // Decrease amount in invoiceItem 
    router.post("/decrease", invoiceItem.decrease);
    // Retrieve all product images
    router.get("/", invoiceItem.findAll);
    // Retrieve a single product image with id
    router.get("/:id", invoiceItem.findOne);
    // Update a product image with id
    router.put("/:id", invoiceItem.update);
    // Delete a product image with id
    router.delete("/:id", invoiceItem.delete);
    // Delete all product images
    router.delete("/", invoiceItem.deleteAll);
    // Add feature for product image
    app.use('/api/invoiceItem', router);
  };