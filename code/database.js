const { handleError } = require('./common')

const { Pool } = require('pg')


const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'localhost',
    ssl: process.env.SSL == 'true',
})


function firstRowOrNull(result) {
    if (result.rowCount >= 1) {
        return result.rows[0]
    }

    return null
}

function query(request, ...values) {
    return pool.query(request, values).catch(handleError)
}

function queryFirst(request, ...values) {
    return query(request, ...values).then(firstRowOrNull)
}

function run(callback) {
    return pool
        .connect()
        .catch(handleError)
        .then(client => {
            const result = callback(client)
            client.release()
            return result
        })
}


function findUserByUsername(username) {
    return queryFirst(`SELECT * FROM users WHERE username = $1 LIMIT 1`, username)
}

function findUserById(id) {
    return queryFirst(`SELECT * FROM users WHERE id = $1 LIMIT 1`, id)
}

function findTopicById(id) {
    return queryFirst(`SELECT * FROM topics WHERE id = $1 LIMIT 1`, id)
}


module.exports = {
    query: query,
    queryFirst: queryFirst,
    run: run,

    findUserByUsername: findUserByUsername,
    findUserById: findUserById,
    findTopicById: findTopicById,
}