export async function mintNFTs(metadata) {
    let options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-token": "bullocks"
        },
        body: JSON.stringify(metadata)
    }
    var res;
    try {
        res = await fetch('https://localhost:7778' + '/v1/mint', options)
    } catch (e) {
        console.log(e)
        return
    }
    return res
}