module.exports = app => {
    const invoice = require("../controller/invoice.controller");
    var router = require("express").Router();
    // Create a new product image
    router.post("/", invoice.create);
    // Decrease amount in invoice 
    router.post("/decrease", invoice.decrease);
    // Retrieve all product images
    router.get("/", invoice.findAll);
    // get Revenue of Branch by branchid
    router.get("/revenueByBranchID/:id", invoice.getRevenueInBrach);
    // Retrieve a single product image with id
    router.get("/:id", invoice.findOne);
    // Update a product image with id
    router.put("/:id", invoice.update);
    // Delete a product image with id
    router.delete("/:id", invoice.delete);
    // Delete all product images
    router.delete("/", invoice.deleteAll);
    // Add feature for product image
    app.use('/api/invoice', router);
  };