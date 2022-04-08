module.exports = app => {
    const cloundinary = require("../controller/cloudinary.controller");
    var router = require("express").Router();
    // Upload images
    router.post("/", cloundinary.uploadImages);
    app.use('/api/cloudinary', router);
};

