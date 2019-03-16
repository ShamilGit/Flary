const userManager = require("../core/managers/userManager")
const up = require("../core/profiles/userProfile")

function readRequest(req, res) {
    var json = new Object()

    var helpers = []
    var moderators = []
    var donators = []
    var content_team = []

    userManager.userProfiles.forEach(c => {
        if(c.getAccountType() === up.AccountType.HELPER) helpers.push(c.getId())
        else if(c.getAccountType() == up.AccountType.CONTENT_TEAM) content_team.push(c.getId())
        else if(c.getAccountType() === up.AccountType.MODERATOR) moderators.push(c.getId())
        else if(c.getAccountType() === up.AccountType.DONATOR) donators.push(c.getId())
    })

    json.normalUsers = []
    json.donatorUsers = donators
    json.contentTeamUsers = content_team
    json.helperUsers = helpers
    json.moderatorUsers = moderators

    json.request = req.requestJson

    res.status(200).send(json)
}

module.exports.readRequest = readRequest