module.exports = app => {
    const accounts = require("../controller/account.controller");
    var router = require("express").Router();
    // Create a new Tutorial
    router.post("/", accounts.create);
    // Retrieve all computers
    router.get("/", accounts.findAll);
    // // Retrieve all published computers
    // router.get("/published", computers.findAllPublished);
    // Retrieve a single Tutorial with id
    router.get("/:id", accounts.findOne);
    // Update a Tutorial with id
    router.put("/:id", accounts.update);
    // Delete a Tutorial with id
    router.delete("/:id", accounts.delete);
    // Delete all Tutorials 
    router.delete("/", accounts.deleteAll);
    app.use('/api/account', router);
  };