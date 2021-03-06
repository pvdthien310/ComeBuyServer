const db = require("../models");
const Cart = db.cart;
const Account = db.account;
const Product = db.product;
const Op = db.Sequelize.Op;
// Create and Save a new Cart
exports.create = (req, res) => {
    // Validate request
    if (!req.body.userID || !req.body.productID) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Cart.findOne({
        where:
            { productid: req.body.productID, userid: req.body.userID }
    })
        .then(data => {
            if (data == null) {
                const cart = {
                    userid: req.body.userID,
                    productid: req.body.productID,
                    amount: req.body.amount
                };
                Cart.create(cart)
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the Cart."
                        });
                    });
            }
            else {
                let _amount = data.amount
                Cart.update({ amount: _amount + 1 }, {
                    where: { productid: req.body.productID, userid: req.body.userID }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "Cart was updated successfully."
                            });
                        } else {
                            res.send({
                                message: `Cannot update Cart with id=${id}. Maybe Cart was not found or req.body is empty!`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Error updating Cart with id=" + id
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Cart."
            });
        });
};
exports.decrease = (req, res) => {
    // Validate request
    if (!req.body.userID || !req.body.productID) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Cart.findOne({
        where:
            { productID: req.body.productID, userID: req.body.userID }
    })
        .then(data => {
            if (data == null) {
                res.send("There is no this product in your cart")
            }
            else {
                let _amount = data.amount
                if (_amount == 1) {
                    Cart.destroy({
                        where: { productID: req.body.productID, userID: req.body.userID }
                    })
                        .then(num => {
                            if (num == 1) {
                                res.send({
                                    message: "Cart was deleted successfully!"
                                });
                            } else {
                                res.send({
                                    message: `Cannot delete Cart with id=${id}. Maybe Cart was not found!`
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Could not delete Cart with id=" + id
                            });
                        });
                }
                else {
                    Cart.update({ amount: _amount - 1 }, {
                        where: { productID: req.body.productID, userID: req.body.userID }
                    })
                        .then(num => {
                            if (num == 1) {
                                res.send({
                                    message: "Cart was updated successfully."
                                });
                            } else {
                                res.send({
                                    message: `Cannot update Cart with id=${id}. Maybe Cart was not found or req.body is empty!`
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Error updating Cart with id=" + id
                            });
                        });
                }
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Cart."
            });
        });
    // // Create a Cart
    // const cart = {
    //     userID: req.body.userID,
    //     productID : req.body.productID,
    //     amount: req.body.amount
    // };
    // // Save Cart in the database
    // Cart.create(cart)
    //     .then(data => {
    //         res.send(data);
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message:
    //                 err.message || "Some error occurred while creating the Cart."
    //         });
    //     });
};
// Retrieve all Carts from the database.
exports.findAll = (req, res) => {
    Cart.findAll({
        include: [{
            model: Product,
            as: "product",
            attributes: ["name"],
        },
        {
            model: Account,
            as: "account",
            attributes: ["name"],
        }

        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Carts."
            });
        });
};
// Find a single Cart with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Cart.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Cart with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Cart with id=" + id
            });
        });
};
// Update a Cart by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Cart.update(req.body, {
        where: { cartID: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Cart was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Cart with id=${id}. Maybe Cart was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Cart with id=" + id
            });
        });
};
// Delete a Cart with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Cart.destroy({
        where: { cartID: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Cart was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Cart with id=${id}. Maybe Cart was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Cart with id=" + id
            });
        });
};
// Delete all Carts from the database.
exports.deleteAll = (req, res) => {
    Cart.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Carts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Carts."
            });
        });
};
