const main = require("../../main")
const UserProfile = require("../profiles/userProfile")

//this thing is just a chache, it's better to cache things instead of keeping requesting to the database
var userProfiles = []

function getAllProfiles()  {
    main.rethink.getTable("users", (cursor) => {
        cursor.each((err, json) => {
            if(err) throw err

            userProfiles.push(new UserProfile(null, null, json))
        })
    })
}

function getUserProfileByUUID(uuid) {
    return userProfiles.find(c => c.getId() === uuid.replace("-", ""))
}

function getUserProfileByName(name) {
    return userProfiles.find(c => c.getName() === name)
}

function getUserProfileByToken(token) {
    return userProfiles.find(c => c.getToken() === token)
}

function registerUser(uuid, name) {
    var up = userProfiles.find(c => c.getId() === uuid.replace("-", ""))

    if(up == undefined) {
        up = new UserProfile(uuid, name)
        userProfiles.push(up)
    }
    
    return up
}

module.exports.getAllProfiles = getAllProfiles
module.exports.getUserProfileByUUID = getUserProfileByUUID
module.exports.getUserProfileByName = getUserProfileByName
module.exports.getUserProfileByToken = getUserProfileByToken
module.exports.registerUser = registerUser
module.exports.userProfiles = userProfiles