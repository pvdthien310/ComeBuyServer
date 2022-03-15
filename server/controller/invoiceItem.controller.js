const db = require("../models");
const InvoiceItem = db.invoiceitem;
const Account = db.account;
const Product = db.product;
const Op = db.Sequelize.Op;
// Create and Save a new InvoiceItem
exports.create = (req, res) => {
    // Validate request
    if (!req.body.invoiceID || !req.body.productID) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    InvoiceItem.findOne({
        where:
            { productid: req.body.productID, invoiceid: req.body.invoiceID }
    })
        .then(data => {
            if (data == null) {
                const invoiceItem = {
                    invoiceid: req.body.invoiceID,
                    productid: req.body.productID,
                    amount: req.body.amount,
                    total: req.body.total
                };
                InvoiceItem.create(invoiceItem)
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the InvoiceItem."
                        });
                    });
            }
            else {
                let _amount = data.amount
                InvoiceItem.update({ amount: _amount + req.body.amount }, {
                    where: { productid: req.body.productID, invoiceid: req.body.invoiceID }
                })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: "InvoiceItem was updated successfully."
                            });
                        } else {
                            res.send({
                                message: `Cannot update InvoiceItem with id=${id}. Maybe InvoiceItem was not found or req.body is empty!`
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Error updating InvoiceItem with id=" + id
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the InvoiceItem."
            });
        });
};
exports.decrease = (req, res) => {
    // Validate request
    if (!req.body.invoiceID || !req.body.productID) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    InvoiceItem.findOne({
        where:
            { productid: req.body.productID, invoiceid: req.body.invoiceID }
    })
        .then(data => {
            if (data == null) {
                res.send("There is no this product in your InvoiceItem")
            }
            else {
                let _amount = data.amount
                if (_amount == 1) {
                    InvoiceItem.destroy({
                        where: { productid: req.body.productID, invoiceid: req.body.invoiceID }
                    })
                        .then(num => {
                            if (num == 1) {
                                res.send({
                                    message: "InvoiceItem was deleted successfully!"
                                });
                            } else {
                                res.send({
                                    message: `Cannot delete InvoiceItem with id=${id}. Maybe InvoiceItem was not found!`
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Could not delete InvoiceItem with id=" + id
                            });
                        });
                }
                else {
                    InvoiceItem.update({ amount: _amount - 1 }, {
                        where: { productid: req.body.productID, invoiceid: req.body.invoiceID }
                    })
                        .then(num => {
                            if (num == 1) {
                                res.send({
                                    message: "InvoiceItem was updated successfully."
                                });
                            } else {
                                res.send({
                                    message: `Cannot update InvoiceItem with id=${id}. Maybe InvoiceItem was not found or req.body is empty!`
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Error updating InvoiceItem with id=" + id
                            });
                        });
                }
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the InvoiceItem."
            });
        });
    // // Create a InvoiceItem
    // const InvoiceItem = {
    //     userID: req.body.userID,
    //     productID : req.body.productID,
    //     amount: req.body.amount
    // };
    // // Save InvoiceItem in the database
    // InvoiceItem.create(InvoiceItem)
    //     .then(data => {
    //         res.send(data);
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message:
    //                 err.message || "Some error occurred while creating the InvoiceItem."
    //         });
    //     });
};
// Retrieve all InvoiceItems from the database.
exports.findAll = (req, res) => {
    InvoiceItem.findAll({
        include: [{
            model: Product,
            as: "product",
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
                    err.message || "Some error occurred while retrieving InvoiceItems."
            });
        });
};
// Find a single InvoiceItem with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    InvoiceItem.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find InvoiceItem with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving InvoiceItem with id=" + id
            });
        });
};
// Update a InvoiceItem by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    InvoiceItem.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "InvoiceItem was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update InvoiceItem with id=${id}. Maybe InvoiceItem was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating InvoiceItem with id=" + id
            });
        });
};
// Delete a InvoiceItem with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    InvoiceItem.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "InvoiceItem was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete InvoiceItem with id=${id}. Maybe InvoiceItem was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete InvoiceItem with id=" + id
            });
        });
};
// Delete all InvoiceItems from the database.
exports.deleteAll = (req, res) => {
    InvoiceItem.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} InvoiceItems were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all InvoiceItems."
            });
        });
};
