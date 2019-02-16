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
        var user = userManager.getUserProfileByName(req.params.name)
        if(user == undefined) {
            response.result = "The provided user name is invalid"
        }else if(user.getAccountType() === up.AccountType.BANNED) {
            response.result = "The provided user can't change their models"
        }else{

            var json = new Object()
            json.capeActive = req.params.cape == "true" ? true : false
            json.elytraActive = req.params.elytra == "true" ? true : false
            json.earsActive = req.params.ears == "true" ? true : false

            user.updateModels(json)

            response.result = "success"
        }
    }

    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest