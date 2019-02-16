const AUTH_URL = "https://sessionserver.mojang.com/session/minecraft/hasJoined?username={0}&serverId={1}"
const crypto = require("crypto")
const https = require("https")
const constants = require('constants');

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 1024 })

function getEncryptionKey() {
    const json = new Object();
    json.publicKeyIn = Buffer.from(publicKey.export({"type": "spki","format": "der"}), "utf8").toString("hex")

    return json
}

function encryptionKeyResponse(username, oldKey, callback) {

    try{
        const sharedKey = crypto.privateDecrypt({"key":privateKey, "padding":constants.RSA_PKCS1_PADDING}, Buffer.from(oldKey, "hex"))

        const pKey = Buffer.from(publicKey.export({"type": "spki","format": "der"}), "utf8")
        const serverId = crypto.createHash("sha1").update(sharedKey).update(pKey).digest("hex")

        var url = AUTH_URL.replace("{0}", username).replace("{1}", serverId)
        https.get(url, (resp) => {
            let data = ""

            resp.on("data", (chunk) => {
                data += chunk
            })

            resp.on("end", () => {
                if(data == "") {
                    callback({"error":{"message":"400, The player is not on online mode!"}})
                    return
                }

                callback(JSON.parse(data))
            })
        })
    }catch{
        callback({"error":{"message":"400, The player is not on online mode!"}})
    }
}
  

module.exports.getEncryptionKey = getEncryptionKey;
module.exports.encryptionKeyResponse = encryptionKeyResponse;