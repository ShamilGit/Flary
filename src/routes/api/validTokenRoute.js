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
    }else{
        var user = userManager.getUserProfileByToken(req.params.token)
        if(user == undefined) {
            response.result = "The provided user token is invalid"
        }else if(user.getAccountType() === up.AccountType.BANNED) {
            response.result = "The provided user is banned"
        }else{
            var userInfo = new Object()

            userInfo.id = user.getId()
            userInfo.name = user.getName()
            userInfo.token = user.getToken()
            userInfo.accountType = user.getAccountType()
            userInfo.lastActivity = user.getLastActivity()
            userInfo.activeModels = user.getActiveModels()

            response.result = "success"
            response.userInfo = userInfo
        }
    }

    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest