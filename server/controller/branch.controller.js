const db = require("../models");
const Branch = db.branch;
const Account = db.account;
const Op = db.Sequelize.Op;
// Create and Save a new Branch
exports.create = (req, res) => {
    // Validate request
    if (!req.body.address || !req.body.userID) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Branch
    const branch = {
       address : req.body.address,
       userid: req.body.userID
    };
    // Save Branch in the database
    Branch.create(branch)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Branch."
            });
        });
};
// Retrieve all Branchs from the database.
exports.findAll = (req, res) => {
    Branch.findAll({
        include: [
            {
                model: Account,
                as: "account",
                attributes: ["name","email"],
            }
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Branchs."
            });
        });
};
// Find a single Branch with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Branch.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Branch with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Branch with id=" + id
            });
        });
};
// Update a Branch by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Branch.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Branch was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Branch with id=${id}. Maybe Branch was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Branch with id=" + id
            });
        });
};
// Delete a Branch with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Branch.destroy({
        where: { Branchid: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Branch was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Branch with id=${id}. Maybe Branch was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Branch with id=" + id
            });
        });
};
// Delete all Branchs from the database.
exports.deleteAll = (req, res) => {
    Branch.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Branchs were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Branchs."
            });
        });
};
