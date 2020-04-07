const { asset } = require('../common')

const database = require('../database')

const express = require('express')


const debug = express.Router()


function renderTable(title, result) {
    let targets = []

    let contents = `<h1>${title}</h1><table><tr>`

    for (let it of result.fields) {
        targets.push(it.name)
        contents += `<td>${it.name}</td>`
    }

    contents += '</tr>'

    for (let it = 0; it < result.rowCount; it++) {
        contents += '<tr>'

        for (let that of targets) {
            contents += `<td>${result.rows[it][that]}</td>`
        }

        contents += '</tr>'
    }

    contents += '</table>'
    return contents
}


debug.get('/', (request, response) => {
    let users = null
    let topics = null

    database
        .run(async client => {
            users = await client.query('SELECT * FROM users')
            topics = await client.query('SELECT * FROM topics')

            response.render(asset('debug.html'), {
                contents: renderTable('users', users) + renderTable('topics', topics)
            })
        })
})


module.exports = debug