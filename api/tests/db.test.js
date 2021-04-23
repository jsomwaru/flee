const db = require("../services/db")
require('dotenv').config({path: '../services/.env'})

//db.query("insert into test_users VALUES($1, $2) RETURNING *", ["0x1", "basedgod"]).then(r => console.log(r))


async function tmp () {
    let r = await db.query('insert into users values($1, $2) RETURNING *', ["0x1", "basedgod"])
    console.log (r)
}


tmp(); 