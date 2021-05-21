const {Pool} = require('pg')
require('dotenv').config({path: 'api/services/.env'})

/*
Schema Time 
Users are able to mint as many copies of on token as they like because why not
To do this Flee has to make some special considerations  while creating its db schema

minting log as well can  at least for now be a chain event

flee_items
owneraddress item_id group_id ximgref

ximg_data 
ximgref ximgdata: base64

users
address username
*/

const pool = new Pool()

const query = async (text, values=null) => {
    try {
        return await pool.query(text, values) 
    } catch(e) {
        throw e
    }
}

exports.query = query