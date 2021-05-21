export async function mintNFTs(inputs) {
    
    let options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": "bullocks"
        },
        body: JSON.stringify(inputs)
    }

    var res;
    try {
        res = await fetch('http://localhost:7778' + '/v1/market/mint', options)
    } catch (e) {
        console.log(e)
        return
    }
    return res
}