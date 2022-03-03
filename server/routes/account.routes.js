module.exports = app => {
    const accounts = require("../controller/account.controller");
    var router = require("express").Router();
    // Create a new Tutorial
    router.post("/", accounts.create);
    // Retrieve all computers
    router.get("/", accounts.findAll);
    // // Retrieve all published computers
    // router.get("/published", computers.findAllPublished);
    // // Retrieve a single Tutorial with id
    // router.get("/:id", computers.findOne);
    // // Update a Tutorial with id
    // router.put("/:id", computers.update);
    // // Delete a Tutorial with id
    // router.delete("/:id", computers.delete);
    // // Create a new Tutorial
    // router.delete("/", computers.deleteAll);
    app.use('/api/account', router);
  };