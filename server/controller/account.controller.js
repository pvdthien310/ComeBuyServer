const db = require("../models");
const Account = db.account;
const Notification = db.notification;
const Cart = db.cart;
const Op = db.Sequelize.Op;
const Branch = db.branch;
const aes256 = require('aes256');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const SendResponse = require('../utils/sendResponse');
const { isEmpty } = require("../utils/validate");
// Create and Save a new Account
exports.create = catchAsync(async (req, res, next) => {
  // Validate request
  if (!req.body.name || !req.body.email || !req.body.password) {
    next(new AppError("Some params is missing or null!", 404))
    return;
  }
  else if (req.body.role == 'admin')
  {
    next(new AppError("Role is not allowed to be admin", 500))
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
    password: aes256.encrypt(process.env.SECRET_KEY_HASH, req.body.password).toString(),
    bio: req.body.bio,
    address: req.body.address,
    role: req.body.role,
    sex: req.body.sex,
  };
  // Save Account in the database
  const result = await Account.findOne({ where: { email: req.body.email } })
    if (result == null) {
      /// Handle Manager Role
      if (req.body.role == 'manager') {
        if (isEmpty(req.body.branchAddress))
          next(new AppError("Branch address is null or empty", 405))
        else {
          const response = await Account.create(account)
          if (response) {
            const branch = {
              address: req.body.branchAddress,
              userid: response.userID
            };
            const data = await Branch.create(branch)
            if (data) {
              SendResponse({
                message:
                  "Add Manager Successfully"
              }, 200, res)
            }
            else {
              next(new AppError(
                   "Some error occurred while creating the Branch.", 500))
            }
          }
          else
            next(new AppError(
                "Some error occurred while creating the Account.", 500))
        }
      }
      ///// Handle Another Role != Manager
      else {
        const response = await Account.create(account)
        if (response)
          SendResponse(response, 200, res)
        else
          next(new AppError(
              "Some error occurred while creating the Account.", 500))
      }
    }
    else {
      next(new AppError("Account is Existed!", 409))
    }
});
// Retrieve all Accounts from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  Account.findAll({
    include: [
      {
        model: Notification,
        as: "notification",
        attributes: ["userID", "body", "notiid"],
      },
      {
        model: Cart,
        as: "cart",
        attributes: ["productid", "amount"],
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["branchid", "address"],
      }
    ]
  })
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
exports.findOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (id == null) return next(new AppError("Error retrieving Account with id=" + id, 400));

  const data = await Account.findByPk(id, {
    include: [
      {
        model: Notification,
        as: "notification",
        attributes: ["userID", "body", "notiid"],
      },
      {
        model: Cart,
        as: "cart",
        attributes: ["productid", "amount"],
      }
    ]
  })
  if (data)
    SendResponse(data, 200, res)
  else
    return next(new AppError(`Cannot find Account with id=${id}.`, 400));

});

exports.findOnebyEmail = (req, res) => {
  const email = req.params.email;
  Account.findOne({ where: { email: email } })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Account with email=${email}.`
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
exports.update = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const num = await Account.update(req.body, { where: { userID: id } })
    .catch(err => {
      next(new AppError({
        message: "Error updating Account with id=" + id
      }, 500))
    })
  if (num == 1) {
    const data = await Account.findByPk(id, {
      include: [
        {
          model: Notification,
          as: "notification",
          attributes: ["userID", "body", "notiid"],
        },
        {
          model: Cart,
          as: "cart",
          attributes: ["productid", "amount"],
        }
      ]
    })
    if (!data) next(new AppError({
      message: `Error Get new Product`
    }, 404))
    else
      SendResponse(data, 200, res)
  }
  else {
    next(new AppError({
      message: `Cannot update Account with id=${id}. Maybe Account was not found or req.body is empty!`
    }, 404))
  }
});
// Delete a Account with the specified id in the request
exports.delete = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const num = await Account.destroy({
    where: { userID: id }
  }).catch(err => {
    next(new AppError({
      message: "Could not delete Account with id=" + id,
      error: err
    }, 500))
  })

  if (num == 1) {
    SendResponse({
      message: "Account was deleted successfully!"
    }, 200, res)
  }
  else {
    next(new AppError({
      message: `Cannot delete Account with id=${id}. Maybe Account was not found!`
    }, 404))
  }

});
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
