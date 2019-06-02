const main = require("../../main")
const wynnData = require("../../core/managers/wynnData")

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

    var body = req.body
    if(body.guild == undefined || body.color == undefined) {
        response.result = "Bad Request, expecting (guild, color)"
        response.request = req.requestJson
        res.status(400).send(response)
        return
    }

    wynnData.setGuildColor(body.guild, body.color)

    response.result = "Successfully set guild color"
    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest