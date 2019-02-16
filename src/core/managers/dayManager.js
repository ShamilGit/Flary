const main = require("../../main")
const DayProfile = require("../profiles/dayProfile")

//this thing is just a chache, it's better to cache things instead of keeping requesting to the database
var dayProfiles = []

function getAllProfiles()  {
    main.rethink.getTable("analytics_days", (cursor) => {
        cursor.each((err, json) => {
            if(err) throw err

            dayProfiles.push(new DayProfile(null, json))
        })
    })
}

function getCurrentDay() {
    const date = new Date()
    const dateString = (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear()
    
    var dp = dayProfiles.find(c => c.id === dateString)
    if(dp == undefined) {
        dp = new DayProfile(dateString)
        dayProfiles.push(dp)
    }

    return dp
}

module.exports.getAllProfiles = getAllProfiles
module.exports.getCurrentDay = getCurrentDay
module.exports.dayProfiles = dayProfiles