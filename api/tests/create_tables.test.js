const db = require('../services/db')


const userQuery = `
create table if not exists test_users (
    address VARCHAR not null PRIMARY KEY,
    username VARCHAR
)
`

const itemQuery = `
    create table if not exists test_flee_items (
        owner_address VARCHAR not null,
        id VARCHAR not null PRIMARY KEY,
        icon_url VARCHAR,
        listed BOOL
    )
`

db.query(userQuery).then(r => {
    console.log(r)
}).catch(e => {
    console.log(e)
})

db.query(itemQuery).then(r=> {
    console.log(r)
}).catch(e => {
    console.log(e)
})
