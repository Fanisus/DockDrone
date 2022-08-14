const fs = require('fs')
module.exports = function(req, res, next) {
    console.log(req.path.split('/'))
    if (!fs.existsSync(`./api/${req.path.split('/')[3]}.js`)) {
        try {
            console.log("File Not Found");
            require(`./api/error.js`)(req, res, next, 404)
        } catch (error) {
            console.log(error)
        }
    }
    require(`./api/${req.path.split('/')[3]}`)(req, res, next)
}