const ITEM_URL = "https://api.wynncraft.com/public_api.php?action=itemDB&category=all"
const https = require("https")

var cachedItems = {"items":[]}

function cacheItems() {
    https.get(ITEM_URL, (resp) => {
        var data = ""

        resp.on("data", (chunk) => {
             data += chunk
        })

        resp.on("end", () => {
            if(data == "") return

            this.cachedItems = JSON.parse(data)
        })
    })
}

module.exports.cacheItems = cacheItems
module.exports.cachedItems = cachedItems