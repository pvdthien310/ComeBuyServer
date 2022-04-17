const db = require("../models");
const Stock = db.stock;
const Product = db.product;
const Branch = db.branch;
const Op = db.Sequelize.Op;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const SendResponse = require('../utils/sendResponse');
// Create and Save a new Stock
exports.create = catchAsync(async (req, res, next) => {
    // Validate request
    if (!req.body.productID || !req.body.branchID || !req.body.totalAmount) {
        next(new AppError("Some params is null or empty", 404))
    }
    // Create a Comment
    const stock = {
        totalAmount: req.body.totalAmount,
        remaining: req.body.remaining,
        productid: req.body.productID,
        branchid: req.body.branchID
    };
    // Save Comment in the database
    const data = await Stock.create(stock)
        .catch(err =>
            next(new AppError(err, 500)))
    if (data) {
        SendResponse(data, 200, res)
    }
    else {
        next(new AppError("Some error occurred while creating the Stock.", 500))
    }
});

// Retrieve all Stocks from the database.
exports.findAll = catchAsync(async (req, res, next) => {
    const data = await Stock.findAll(
        {
            include: [
                {
                    model: Product,
                    as: "product",
                    attributes: ["productid", "name"],
                },
                {
                    model: Branch,
                    as: "branch",
                    attributes: ["branchid", "address"],

                },
            ]
        }
    ).catch(err =>
        next(new AppError(err, 500)))

    if (data) {
        SendResponse(data, 200, res)
    }
    else {
        next(new AppError("Some error occurred while retrieving Stocks.", 500))
    }
});
// Find a single Stock with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Stock.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Stock with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Stock with id=" + id
            });
        });
};
exports.findbyBranch = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const data = await Stock.findAll({ 
        where: { branchid: id },
        include: [
            {
                model: Product,
                as: "product",
                attributes: ["productid", "name"],
            },
            {
                model: Branch,
                as: "branch",
                attributes: ["branchid", "address"],

            },
        ] })
        .catch(err =>
            next(new AppError("Error : " + err, 500)))
    if (data)
        SendResponse(data, 200, res)
    else
        next(new AppError(`Cannot find Stock with branch id=${id}.`, 404))
});
// Update a Stock by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Stock.update(req.body, {
        where: { id : id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Stock was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Stock with id=${id}. Maybe Stock was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Stock with id=" + id
            });
        });
};
// Delete a Stock with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Stock.destroy({
        where: { stockID: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Stock was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Stock with id=${id}. Maybe Stock was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Stock with id=" + id
            });
        });
};
// Delete all Stocks from the database.
exports.deleteAll = (req, res) => {
    Stock.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Stocks were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Stocks."
            });
        });
};
