const userManager = require("../core/managers/userManager")

function readRequest(req, res) {
    if(!req.body || !req.body.fileName || !req.body.base64 || !req.headers["Content-Length"]) {
        res.status(400).send({"error": "Bad Request, expecting parameters (fileName & base64)"})
        return
    }

    //HeyZeer0: This checks the file size
    var response = new Object()
    if(req.headers["Content-Length"] > 100000) {
        response.result = "Error! File exceeded 100 kbytes"
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
        user.updateConfigFiles(req.body.fileName, req.body.base64)
        response.result = "Success!"
    }

    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest