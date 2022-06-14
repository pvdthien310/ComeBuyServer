var nodemailer = require('nodemailer');

exports.sendVerify = (req, res) => {
    console.log(req.body)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "comebuyproject@gmail.com",
            pass: "lcpemcxxwehefgof"
        }
        // auth: {
        //     user: process.env.EMAILAPP,
        //     pass: process.env.PASSAPP
        // }
    });
    var mailOptions = {
        from: "comebuyproject@gmail.com",
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };
    console.log(mailOptions)
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send(error);
        } else {
            res.send(info.response);
        }
    });
}