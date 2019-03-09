const main = require("../../main")
const userManager = require("../../core/managers/userManager")
const up = require("../../core/profiles/userProfile")

function readRequest(req, res) {
    var valid = false
    for(i in main.config.apikeys) {
        if(main.config.apikeys[i] === req.params.apitoken) {
            valid = true;
            break;
        }
    }

    var response = new Object()

    if(!valid) {
        response.result = "Invalid API Key"
        response.request = req.requestJson
        res.status(400).send(response)
        return
    }

    var user = userManager.getUserProfileByToken(req.params.token)
    if(user == undefined) {
        response.result = "The provided user token is invalid"
        response.request = req.requestJson
        res.status(200).send(response)
        return
    }
    if(user.getAccountType() === up.AccountType.BANNED) {
        response.result = "The provided user is banned"
        response.request = req.requestJson
        res.status(200).send(response)
        return
    }

    var type = req.params.type.toUpperCase()
    if(type !== "NORMAL" && type !== "MODERATOR" && type !== "HELPER" && type !== "DONATOR" && type !== "CONTENT_TEAM") {
        response.result = "The provided type is invalid, expecting (NORMAL/MODERATOR/HELPER/DONATOR/CONTENT_TEAM)"
        response.request = req.requestJson
        res.status(400).send(response)
        return
    }

    user.updateAccountType(type);
    
    response.result = "success"
    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest