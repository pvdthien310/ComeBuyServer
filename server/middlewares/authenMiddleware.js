const jwt = require('jsonwebtoken')

function authenToken(req, res, next) {
    const authorizationHeader = req.headers['x-access-token'];
    const token = authorizationHeader;

    if (!token) {
        res.status(401).send('Token het han');
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        console.log('accept token')
        if (err) {
            res.sendStatus(401);
            return;
        }
        next();
    })
}
module.exports = {authenToken}