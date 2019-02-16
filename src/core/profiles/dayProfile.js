const main = require("../../main")
const TABLE = "analytics_days"

class DayProfile {

    constructor(date, json) {
        if(json !== undefined) {
            this.id = json.id
            this.uniqueUsers = json.uniqueUsers
            this.daily_requests = json.daily_requests
            this.models_updated = json.models_updated
            this.api_requests = json.api_requests
            this.daily_ratelimts = json.daily_ratelimts
            this.ddos = json.ddos
            this.mostUsedVersion = json.mostUsedVersion
            return
        }

        this.id = date
        this.uniqueUsers = []
        this.daily_requests = 0
        this.models_updated = 0
        this.api_requests = 0
        this.daily_ratelimts = 0
        this.ddos = false
        this.mostUsedVersion = {}
    }

    updateMostUsedVersion(version) {
        if(!this.mostUsedVersion[version]) this.mostUsedVersion[version] = 1
        else this.mostUsedVersion[version] +=1
    }

    updateUniqueUsers(uuid, version) {
        this.updateMostUsedVersion(version)
        if(this.uniqueUsers.indexOf(uuid) > -1) return
        this.uniqueUsers.push(uuid)

        this.save()
    }

    updateDailyRequests() {
        this.daily_requests+=1

        this.save()
    }

    updateApiRequests() {
        this.api_requests+=1

        this.save()
    }

    updateModelsUpdated() {
        this.models_updated+=1

        this.save()
    }

    updateDailyRatelimits() {
        this.daily_ratelimts+=1

        this.save()
    }

    updateDdos() {
        this.ddos = true

        this.save()
    }

    save() {
        main.rethink.insertValue(TABLE, this)
    }

}

module.exports = DayProfile