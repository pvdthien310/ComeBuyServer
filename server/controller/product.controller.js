const db = require("../models");
const Feature = db.feature;
const Product = db.product;
const ProductImage = db.productimage;
const Comment = db.comment;
const Op = db.Sequelize.Op;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const SendResponse = require('../utils/sendResponse');
// Create and Save a new Product
exports.create = catchAsync(async (req, res, next) => {

    // Validate request
    if (!req.body.name || !req.body.memory) {
        next(AppError({
            message: "Content can not be empty!"
        }, 400))
        return;
    }
    // Create a Product
    const product = {
        name: req.body.name,
        description: req.body.description,
        ram: req.body.ram,
        memory: req.body.memory,
        gpu: req.body.gpu,
        cpu: req.body.cpu,
        name: req.body.name,
        brand: req.body.brand,
        description: req.body.description,
        weight: req.body.weight,
        origin: req.body.origin,
        screenDimension: req.body.screenDimension,
        colorCoverage: req.body.colorCoverage,
        externalIOPort: req.body.externalIOPort,
        battery: req.body.battery,
        warranty: req.body.warranty,
        promotion: req.body.promotion,
        price: req.body.price,
        year: req.body.year,
        isPublished: false
        // keyIndex: req.body.keyIndex
    };

    // Save Product in the database
    const data = await Product.create(product)
    if (data)
        SendResponse(data, 200, res)
    else next(new AppError({
        message:
            err.message || "Some error occurred while creating the Product."
    }, 500))
});
// Retrieve all Products from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    Product.findAll({
        include: [
            {
                model: Feature,
                as: "feature",
                attributes: ["featureID", "name"],
                through: {
                    attributes: [],
                }
            },
            {
                model: ProductImage,
                as: "productimage",
                attributes: ["imageURL", "productImageID"],
            },
            {
                model: Comment,
                as: "comment",
                attributes: ["userid", "body"],
            },
        ],
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Products."
            });
        });
};
// Find a single Product with an id
exports.findOne = catchAsync((req, res) => {
    const id = req.params.id;
    Product.findByPk(id, {
        include: [
            {
                model: Feature,
                as: "feature",
                attributes: ["featureid", "name"],
                through: {
                    attributes: [],
                }
            },
            {
                model: ProductImage,
                as: "productimage",
                attributes: ["imageURL", "productImageID"],
            },
            {
                model: Comment,
                as: "comment",
                attributes: ["userid", "body"],
            },
        ]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Product with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Product with id=" + id
            });
        });
});
// Update a Product by the id in the request
exports.update = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const data = await Product.update(req.body, {
        where: { productID: id }
    })
        .catch(err => {
            next(new AppError("Error updating Product with id=" + id, 500));
        })
    if (data == 1)
        SendResponse("Product was updated successfully.", 200, res)
    else
        return next(new AppError(`Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`, 400));
    // .then(num => {
    //     if (num == 1) {
    //         res.send({
    //             message: "Product was updated successfully."
    //         });
    //     } else {
    //         res.send({
    //             message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
    //         });
    //     }
    // })
    // .catch(err => {
    //     res.status(500).send({
    //         message: "Error updating Product with id=" + id
    //     });
    // });
});
// Delete a Product with the specified id in the request
exports.delete = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    try {
        const num = await Product.destroy({
            where: { productid: id }
        })
        if (num && num == 1) {
            SendResponse({ message: "Product was deleted successfully!" }, 200, res)
        }
        else
            next(new AppError({
                message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
            }, 404))
    }
    catch (e) {
        next(new AppError({
            message: `Error` + e
        }, 500))
        console.log(e)
    }
});
// Delete all Products from the database.
exports.deleteAll = (req, res) => {
    Product.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Products were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Products."
            });
        });
};
// Find all published Products
exports.findAllPublished = (req, res) => {
    Product.findAll({ where: { official: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Products."
            });
        });
};

exports.addFeature = catchAsync(async (req, res, next) => {
    const productId = req.params.productId
    const featureId = req.params.featureId
    const prd = await Product.findByPk(productId)
        .catch((err) => {
            return next(new AppError(">> Error while adding Product to Feature: " + err, 500))
        });

    if (!prd) {
        return next(new AppError("Product not found!", 404))
    }
    return Feature.findByPk(featureId).then((feature) => {
        if (!feature) {
            return next(new AppError("Product not found!", 404))
        }
        prd.addFeature(feature);
        SendResponse(`>> added Product id=${prd.productID} to Feature id=${feature.featureID}`, 200, res)
    });
});

exports.deleteAndUpdateFeature = catchAsync(async (req, res, next) => {
    const productId = req.body.productID
    const featureId = req.body.featureID
    const prd = await Product.findByPk(productId)
        .catch((err) => {
            return next(new AppError(">> Error while finding Product: " + err, 500))
        });

    if (!prd) {
        return next(new AppError("Product not found!", 404))
    }
    // return Feature.findByPk(featureId).then(async (feature) => {
    //     if (!feature) {
    //         return next(new AppError("Product not found!", 404))
    //     }
    await prd.setFeature(featureId);
    SendResponse(`>> update Product id=${prd.productID} to Feature successfully`, 200, res)
    // }); 
});

exports.ChangeIsPublished = catchAsync(async (req, res, next) => {
    const productId = req.body.productID
    const prd = await Product.findByPk(productId)
        .catch((err) => {
            return next(new AppError(">> Error while finding Product: " + err, 500))
        });

    if (!prd) {
        return next(new AppError("Product not found!", 404))
    }
    // return Feature.findByPk(featureId).then(async (feature) => {
    //     if (!feature) {
    //         return next(new AppError("Product not found!", 404))
    //     }
    await prd.setFeature(featureId);
    SendResponse(`>> update Product id=${prd.productID} to Feature successfully`, 200, res)
    // }); 
});