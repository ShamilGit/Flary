const main = require("../../main")
const dayManager = require("../../core/managers/dayManager")

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

    response.data = {}

    dayManager.dayProfiles.forEach(c => {
        var json = new Object()
        json.wasDdosed = c.ddos
        json.rateLimits = c.daily_ratelimts
        json.serverRequests = c.daily_requests
        json.apiRequests = c.api_requests
        json.usedVersions = c.mostUsedVersion
        json.uniqueUsers = c.uniqueUsers

        response.data[c.id] = json
    })

    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest