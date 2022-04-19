module.exports = app => {
    const accounts = require("../controller/account.controller");
    var router = require("express").Router();
    // Create a new account
    router.post("/", accounts.create);
    // Retrieve all computers
    router.get("/", accounts.findAll);
    // // Retrieve all published computers
    // Retrieve a single account with id
    router.get("/:id", accounts.findOne);
    // Retrieve a single account with id
    router.get("/email/:email", accounts.findOnebyEmail);
    // Update a account with id
    router.put("/:id", accounts.update);
    /// Update password
    router.put("/updatePassword/:id", accounts.updatePassword);
    // Delete a account with id
    router.delete("/:id", accounts.delete);
    // Delete all accounts 
    router.delete("/", accounts.deleteAll);
    app.use('/api/account', router);
  };