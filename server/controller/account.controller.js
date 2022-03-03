const db = require("../models");
const Account = db.account;
const Op = db.Sequelize.Op;
const aes256 = require('aes256');
// Create and Save a new Account
exports.create = (req, res) => {
   // Validate request
   console.log(req.body)
   if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Account
  const account = {
    name: req.body.name,
    description: req.body.description,
    dob: req.body.dob,
    avatar: req.body.avatar,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    password: aes256.encrypt(process.env.SECRET_KEY_HASH,req.body.password).toString(),
    bio: req.body.bio,
    address: req.body.address,
    role: req.body.role,
    sex: req.body.sex,
    userID: req.body.userID
  };
  // Save Account in the database
  Account.create(account)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Account."
      });
    });
};
// Retrieve all Accounts from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    Account.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Accounts."
        });
      });
};
// Find a single Account with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Account.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Account with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Account with id=" + id
        });
      });
};
// Update a Account by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Account.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Account was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Account with id=${id}. Maybe Account was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Account with id=" + id
        });
      });
};
// Delete a Account with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Account.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Account was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Account with id=${id}. Maybe Account was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Account with id=" + id
        });
      });
};
// Delete all Accounts from the database.
exports.deleteAll = (req, res) => {
    Account.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Accounts were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Accounts."
          });
        });
};
// Find all published Accounts
// exports.findAllPublished = (req, res) => {
//     Account.findAll({ where: { official: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Accounts."
//       });
//     });
// };