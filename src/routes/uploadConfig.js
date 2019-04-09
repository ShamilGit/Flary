const userManager = require("../core/managers/userManager")
const up = require("../core/profiles/userProfile")

function readRequest(req, res) {
    if(!req.body) {
        if(!(req.body instanceof Array)) {
            res.status(400).send({"error": "Bad Request, expecting parameters (array? fileName & base64)"})
        }
        return
    }

    //HeyZeer0: This checks the file size
    var response = new Object()

    if(Buffer.byteLength(JSON.stringify(req.body)) >= 10000) {
        var response = new Object()

        response.result = "Error! The file bypass the limit of 100 kbytes!"
        response.request = req.requestJson
        res.status(400).send(response)
        return
    }

    var user = userManager.getUserProfileByToken(req.params.token)
    if(user == undefined) {
        response.result = "Error! The provided user token is invalid"
    }else if(user.getAccountType() === up.AccountType.BANNED) {
        response.result = "Error! The provided user is banned"
    }else if(Object.keys(user.getConfigFiles).length > 30) {
        response.result = "Error! The user has more than 30 uploaded files"
    }else{
        if(req.body instanceof Array) {
            req.body.forEach(c => {
                if(c.fileName && c.base64) user.updateConfigFiles(c.fileName, c.base64)
            })
            response.result = "Success!"
        }else {
            user.updateConfigFiles(req.body.fileName, req.body.base64)
            response.result = "Success!"
        }
    }

    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest