const db = require("../models");
const Invoice = db.invoice;
const Account = db.account;
const Branch = db.branch;
const InvoiceItem = db.invoiceitem;
const Op = db.Sequelize.Op;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const SendResponse = require('../utils/sendResponse');
// Create and Save a new Invoice
exports.create = (req, res) => {
    // Validate request
    if (!req.body.branchID || !req.body.userID || !req.body.address) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Comment
    const invoice = {
        date: req.body.date,
        total: req.body.total,
        moneyReceived: req.body.moneyReceived,
        isChecked: req.body.isChecked,
        isPaid: req.body.isPaid,
        userid: req.body.userID,
        branchid: req.body.branchID,
        address: req.body.address
    };
    // Save Comment in the database
    Invoice.create(invoice)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Comment."
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

    Invoice.findOne({
        where:
            { userid: req.body.userID, branchid: req.body.branchID }
    })
        .then(data => {
            if (data == null) {
                res.send("There is no this product in your Invoice")
            }
            else {
                let _amount = data.amount
                if (_amount == 1) {
                    Invoice.destroy({
                        where: { productid: req.body.productID, userid: req.body.userID }
                    })
                        .then(num => {
                            if (num == 1) {
                                res.send({
                                    message: "Invoice was deleted successfully!"
                                });
                            } else {
                                res.send({
                                    message: `Cannot delete Invoice with id=${id}. Maybe Invoice was not found!`
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Could not delete Invoice with id=" + id
                            });
                        });
                }
                else {
                    Invoice.update({ amount: _amount - 1 }, {
                        where: { productid: req.body.productID, userid: req.body.userID }
                    })
                        .then(num => {
                            if (num == 1) {
                                res.send({
                                    message: "Invoice was updated successfully."
                                });
                            } else {
                                res.send({
                                    message: `Cannot update Invoice with id=${id}. Maybe Invoice was not found or req.body is empty!`
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Error updating Invoice with id=" + id
                            });
                        });
                }
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Invoice."
            });
        });
    // // Create a Invoice
    // const Invoice = {
    //     userID: req.body.userID,
    //     productID : req.body.productID,
    //     amount: req.body.amount
    // };
    // // Save Invoice in the database
    // Invoice.create(Invoice)
    //     .then(data => {
    //         res.send(data);
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message:
    //                 err.message || "Some error occurred while creating the Invoice."
    //         });
    //     });
};
// Retrieve all Invoices from the database.
exports.findAll = (req, res) => {
    Invoice.findAll(
        {
            include: [
                {
                    model: Account,
                    as: "account",
                    attributes: ["userid", "name"],
                },
                {
                    model: Branch,
                    as: "branch",
                    attributes: ["branchid", "address"],

                },
                {
                    model: InvoiceItem,
                    as: "invoiceitem",
                    attributes: ["productid", "total", "amount"],

                }
            ]
        }
    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Invoices."
            });
        });
};
// Find a single Invoice with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Invoice.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Invoice with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Invoice with id=" + id
            });
        });
};
// Update a Invoice by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Invoice.update(req.body, {
        where: { invoiceID: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Invoice was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Invoice with id=${id}. Maybe Invoice was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Invoice with id=" + id
            });
        });
};
// Delete a Invoice with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Invoice.destroy({
        where: { invoiceID: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Invoice was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Invoice with id=${id}. Maybe Invoice was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Invoice with id=" + id
            });
        });
};
// Delete all Invoices from the database.
exports.deleteAll = (req, res) => {
    Invoice.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Invoices were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Invoices."
            });
        });
};

exports.getRevenueInBrach = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const data = await Invoice.findAll({
        where: { branchid: id },
        include: [
            {
                model: Account,
                as: "account",
                attributes: ["userid", "name"],
            },
            {
                model: InvoiceItem,
                as: "invoiceitem",
                attributes: ["productid", "total", "amount"],

            }
        ]
    }).catch(err => {
        next(new AppError("Error : " + err, 500))
    })

    // {
    //     name: 'Page F',
    //     Profit: 2390,
    //     Amount: 3800,
    //     amt: 2500,
    //   }
    if (data) {
        let result = []
        data.map((item) => result = result.concat(item.invoiceitem))
        result = result.filter((item) => item.productid != null)
        let result2 = []
        for (i = 0; i < result.length; i++) {
            let checker = result2.some(e => e.name == result[i].productid)
            // console.log(checker)
            // console.log(result2)
            if (!checker) {
                result2.push({
                    name: result[i].productid,
                    Profit:  result[i].total,
                    Amount:  result[i].amount,
                })
            }
            else 
            {
                result2 = result2.map((item) => {
                    if (item.name == result[i].productid)
                    {
                        return {
                            name: result[i].productid,
                            Profit:  Number(result[i].total) + Number(item.Profit),
                            Amount:  Number(result[i].amount) + Number(item.Amount),
                        }
                    }
                    else return item
                })
            }   
        }
        SendResponse(result2, 200, res)
    }
    else {
        next(new AppError("Wrong branch", 404))
    }
});
