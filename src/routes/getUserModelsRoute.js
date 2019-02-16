const userManager = require("../core/managers/userManager")

function readRequest(req, res) {
    var json = new Object()

    var capes = []
    var elytra = []
    var ears = []

    userManager.userProfiles.forEach(c => {
        if(c.getActiveModels().capeActive) capes.push(c.getId())
        if(c.getActiveModels().elytraActive) elytra.push(c.getId())
        if(c.getActiveModels().earsActive) ears.push(c.getId())
    })

    json.capeActive = capes
    json.elytraActive = elytra
    json.earsActive = ears

    json.request = req.requestJson

    res.status(200).send(json)
}

module.exports.readRequest = readRequest