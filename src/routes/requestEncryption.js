const fakeAuth = require("../core/instances/fakeAuth")

function readRequest(req, res) {
    var json = fakeAuth.getEncryptionKey()
    json.request = req.requestJson

    res.send(json);
}

module.exports.readRequest = readRequest