const main = require("../../main")
const userManager = require("../../core/managers/userManager")
const up = require("../../core/profiles/userProfile")

const bcrypt = require("bcrypt")

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
        res.status(200).send(response)
        return
    }

    var user = userManager.getUserProfileByName(req.params.name)
    if(user == undefined) {
        response.result = "The provided user password is invalid"
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
    if(user.getPassword() === "") {
        response.result = "The provided user doesn't have an set password"
        response.request = req.requestJson
        res.status(200).send(response)
        return
    }
    if(!bcrypt.compareSync(req.params.pass, user.getPassword())) {
        response.result = "The provided password is incorrect"
        response.request = req.requestJson
        res.status(200).send(response)
        return
    }
    
    var userInfo = new Object()

    userInfo.id = user.getId()
    userInfo.name = user.getName()
    userInfo.token = user.getToken()
    userInfo.accountType = user.getAccountType()
    userInfo.lastActivity = user.getLastActivity()
    userInfo.activeModels = user.getActiveModels()

    response.result = "success"
    response.userInfo = userInfo
    
    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest