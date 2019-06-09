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

    var data = {}

    for(let i = 0 ; i < dayManager.dayProfiles.length; i++) {
        var value = dayManager.dayProfiles[i]
        if(value.id != req.params.id) continue

        data["id"] = value.id
        data["rateLimits"] = value.daily_ratelimts
        data["wasDdosed"] = value.ddos
        data["serverRequests"] = value.daily_requests
        data["apiRequests"] = value.api_requests
        data["usedVersions"] = value.mostUsedVersion
        data["uniqueUsers"] = value.uniqueUsers.length

        break
    }

    if(data == {}) {
        response.result = "Invalid day id, please use (mm-dd-yy)"
    }else{
        response.data = data
    }

    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest