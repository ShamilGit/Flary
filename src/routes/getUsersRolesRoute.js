const userManager = require("../core/managers/userManager")
const up = require("../core/profiles/userProfile")

function readRequest(req, res) {
    var json = new Object()

    var helpers = []
    var moderators = []
    var donators = []
    var normal = []

    userManager.userProfiles.forEach(c => {
        if(c.getAccountType() === up.AccountType.HELPER) helpers.push(c.getId())
        else if(c.getAccountType() === up.AccountType.MODERATOR) moderators.push(c.getId())
        else if(c.getAccountType() === up.AccountType.DONATOR) donators.push(c.getId())
        else if(c.getAccountType() === up.AccountType.NORMAL) normal.push(c.getId())
    })

    json.normalUsers = normal
    json.donatorUsers = donators
    json.helperUsers = helpers
    json.moderatorUsers = moderators

    json.request = req.requestJson

    res.status(200).send(json)
}

module.exports.readRequest = readRequest