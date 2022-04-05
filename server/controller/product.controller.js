const db = require("../models");
const Feature = db.feature;
const Product = db.product;
const ProductImage = db.productimage;
const Comment = db.comment;
const Op = db.Sequelize.Op;
// Create and Save a new Product
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
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
        price: req.body.price
    };

    // Save Product in the database
    Product.create(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Product."
            });
        });
};
// Retrieve all Products from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    Product.findAll({
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
                attributes: ["imageurl","productimageid"],
            },
            {
                model: Comment,
                as: "comment",
                attributes: ["userid","body"],
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
exports.findOne = (req, res) => {
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
                attributes: ["imageurl","productimageid"],
            },
            {
                model: Comment,
                as: "comment",
                attributes: ["userid","body"],
            },
        ]})
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
};
// Update a Product by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Product.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Product with id=" + id
            });
        });
};
// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Product.destroy({
        where: { productid: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Product with id=" + id
            });
        });
};
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

exports.addFeature = (req, res) => {
    const productId = req.params.productId
    const featureId = req.params.featureId
    Product.findByPk(productId)
        .then((prd) => {
            if (!prd) {
                console.log("Product not found!");
                res.send(null);
            }
            return Feature.findByPk(featureId).then((feature) => {
                if (!feature) {
                    console.log("Feature not found!");
                    res.send(null);
                }
                prd.addFeature(feature);
                res.send(`>> added Product id=${prd.productID} to Feature id=${feature.featureID}`);

            });
        })
        .catch((err) => {
            console.log(">> Error while adding Product to Feature: ", err);
        });
};