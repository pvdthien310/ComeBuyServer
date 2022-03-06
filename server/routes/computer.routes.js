const {authenToken} = require("../middlewares/authenMiddleware")
module.exports = app => {
    const computers = require("../controller/computer.controller");
    var router = require("express").Router();
    // Create a new Computer
    router.post("/", computers.create);
    // Retrieve all Computer
    router.get("/", authenToken ,computers.findAll);
    // Retrieve all published Computer
    router.get("/published", computers.findAllPublished);
    // Retrieve a single Computer with id
    router.get("/:id", computers.findOne);
    // Update a Computer with id
    router.put("/:id", computers.update);
    // Delete a Computer with id
    router.delete("/:id", computers.delete);
    // Create a new Computer
    router.delete("/", computers.deleteAll);
    app.use('/api/computer', router);
  };