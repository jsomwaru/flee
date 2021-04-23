const {Pool} = require('pg')
require('dotenv').config({path: 'api/services/.env'})


const pool = new Pool()


const query = async (text, values=null) => {
    if(values){
        try {
            return await pool.query(text, values) 
        } catch(e) {
            throw e
        }
    }
    else 
        return await pool.query(text, values) 
}

exports.query = query