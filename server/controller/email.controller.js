var nodemailer = require('nodemailer');

exports.sendVerify = (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "comebuyproject@gmail.com",
            pass: "comebuyproject@1"
        }
        // auth: {
        //     user: process.env.EMAILAPP,
        //     pass: process.env.PASSAPP
        // }
    });
    var mailOptions = {
        from: process.env.EMAILAPP,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send(error);
        } else {
            res.send(info.response);
        }
    });
}