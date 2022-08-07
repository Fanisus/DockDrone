module.exports = function (req, res, next, code) {
    switch (req.method) {
        case 'GET':
            switch (code) {
                case 404:
                    // res.sendStatus(404)
                    res.status(404).send("hi")
                    break;
            }
            break
        case 'POST':
            break
        case 'PATCH':
            break
    }
}