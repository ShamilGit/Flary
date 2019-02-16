const r = require("rethinkdb")
const EventEmitter = require("events")

class RethinkDatabase extends EventEmitter {

    constructor(ip, port, db, user, pass) {
        super()
        
        this.ip = ip
        this.port = port
        this.db = db
        this.user = user;
        this.pass = pass;

        this.connection = null
    }

    get getConnection() {
        return this.connection;
    }

    openConnection() {
        r.connect({host: this.ip, port: this.port, user: this.user, password: this.pass}, (err, connection) => {
            if(err) throw err
            this.connection = connection;

            this.emit("connectionSuccess", connection)
        })
    }

    getTable(table, callback) {
        r.db(this.db).table(table).run(this.connection, (err, result) => {
            if(err) throw err

            if(callback != null) callback(result)
        })
    }

    createTable(table, callback) {
        r.db(this.db).tableList().run(this.connection, (err, result) => {
            if(err) throw err

            if(!result.includes(table)) {
                r.db(this.db).tableCreate(table).run(this.connection, (err, result) => {
                    if(err) throw err
                    
                    if(callback != null) callback(result)
                })
            }else{callback(true)}
        })
    }

    insertValue(table, value, callback) {
        r.db(this.db).table(table).insert(value, {conflict:"replace"}).run(this.connection, (err, result) => {
            if(err) throw err

            if(callback != null) callback(result)
        })
    }

    getValue(table, key, callback) {
        r.db(this.db).table(table).get(key).run(this.connection, (err, result) => {
            if(err) throw err

            if(callback != null) callback(result)
        })
    }

    updateValue(table, key, value, callback) {
        r.db(this.db).table(table).get(key).update(value).run(this.connection, (err, result) => {
            if(err) throw err

            if(callback != null) callback(result)
        })
    }
    
    hasValue(table, key, callback) {
        this.getValue(table, key, (result) => {
            callback(result != null)
        })
    }

}

module.exports = RethinkDatabase