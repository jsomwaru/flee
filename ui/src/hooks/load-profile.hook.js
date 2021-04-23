export function loadProfile(user) {
    return fetch("http://localhost:7778" + '/v1/profile/' + user.addr, {
        method: "GET",
        headers: {
            "content-type": "application/json"
        }
    })
}