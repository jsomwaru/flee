import {initAccount} from "../flow/init-account"
import {useCurrentUser} from "./current-user.hook"


export async function test(user, username) {
    const data = {
        username: username,
        address: user.addr
    }
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-Api-Key": "bullocks" 
        },
        body: JSON.stringify(data)
    }
    let res = await fetch("http://localhost:7778" + '/v1/', options).catch(e => console.log(e))
    return res
}


export async function InitProfile (user, username="") {
    if(username.length === 0) {
        username = user.addr
    }
    const data = {
        username: username,
        address: user.addr
    }
    
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-Api-Key": "bullocks" 
        },
        body: JSON.stringify(data)
    }
    // init account with db
    let res = await fetch("http://localhost:7778" + '/v1/profile/provision-user', options).catch(e => console.log(e))
    // init account with contracts
    console.log(res)
    let tx  = await initAccount(user)
    return {
        res,
        tx
    }
}


export async function initFleeContracts(user) {
    const data = {
        address: user.addr
    }
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-Api-Key": "bullocks" 
        },
        body: JSON.stringify(data)
    }
    return await fetch("http://localhost:7778" + '/v1/profile/provision-user', options).catch(e => console.log(e))
}

