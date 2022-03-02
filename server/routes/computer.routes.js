module.exports = app => {
    const computers = require("../controller/computer.controller");
    var router = require("express").Router();
    // Create a new Tutorial
    router.post("/", computers.create);
    // Retrieve all computers
    router.get("/", computers.findAll);
    // Retrieve all published computers
    router.get("/published", computers.findAllPublished);
    // Retrieve a single Tutorial with id
    router.get("/:id", computers.findOne);
    // Update a Tutorial with id
    router.put("/:id", computers.update);
    // Delete a Tutorial with id
    router.delete("/:id", computers.delete);
    // Create a new Tutorial
    router.delete("/", computers.deleteAll);
    app.use('/api/computer', router);
  };