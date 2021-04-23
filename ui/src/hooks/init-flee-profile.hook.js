export function initProfile (user, username="") {
    console.log(user)
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
    return fetch("http://localhost:7778" + '/v1/profile/provision-user', options).catch(e => console.log(e))
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