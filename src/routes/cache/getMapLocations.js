const wynnData = require("../../core/managers/wynnData")

function readRequest(req, res) {
    res.status(200).send(wynnData.mapLocations)
}

module.exports.readRequest = readRequest