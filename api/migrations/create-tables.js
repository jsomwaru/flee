const db = require('../services/db')

/*
flee_items
owneraddress name item_id group_id ximgref

ximg_data 
ximgref ximgdata: base64

users
address username
*/

const userQuery = `
create table if not exists users (
    address VARCHAR not null PRIMARY KEY,
    username VARCHAR
)
`

const itemQuery = `
    create table if not exists flee_items (
        owner_address VARCHAR not null,
        name VARCHAR not null,
        item_id VARCHAR not null PRIMARY KEY,
        group_id VARCHAR not null 
        ximgref VARCHAR not null,
        listed BOOL
    )
`

const ximgData = `
create table if not exists ximage_data (
    ximgref VARCHAR not null PRIMARY KEY 
    ximgdata VARCHAR not null
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

db.query(ximgData).then(r => {
    console.log(r)
}).catch(e => {
    console.log(e)
})
