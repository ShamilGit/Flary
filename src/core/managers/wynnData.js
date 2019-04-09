const ITEM_URL = "https://api.wynncraft.com/public_api.php?action=itemDB&category=all"
const TERRITORY_URL = "https://api.wynncraft.com/public_api.php?action=territoryList"
const https = require("https")

var cachedItems = {"items":[]}
var territoryCache = {}

var lastTerritoryCache = 0

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

function getTerritoryCache() {
    var time = new Date().getTime()

    if(time - lastTerritoryCache >= 30000) {
        console.log("\x1b[36m%s\x1b[0m", `[CCHE] Updating territory list - ${time}`)
        lastTerritoryCache = time
        https.get(TERRITORY_URL, (resp) => {
            var data = ""

            resp.on("data", (chunk) => {
                data+= chunk
            })

            resp.on("end", () => {
                if(data == "") return "{}"

                this.territoryCache = JSON.parse(data)
            })
        })
    }

    return this.territoryCache
}


module.exports.cacheItems = cacheItems
module.exports.getTerritoryCache = getTerritoryCache
module.exports.cachedItems = cachedItems