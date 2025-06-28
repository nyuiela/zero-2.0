// This functions get details about Star Wars characters. This example will showcase usage of HTTP requests and console.logs.
const cid = args[0]
// /ipfs/QmVNzzpm6WYxK1wBCqt8eEKFBbbaY6CETwXCh1j42WgCqB

// Execute the API request (Promise)
const apiResponse = await Functions.makeHttpRequest({
// the zk backend api
url: `https://coral-worrying-turtle-782.mypinata.cloud/ipfs/${cid}/`
})

if (apiResponse.error) {
console.error(apiResponse.error)
throw Error("Request failed")
}

const { data } = apiResponse;

console.log('API response data:', JSON.stringify(data, null, 2));

// Return Character Name
return Functions.encodeString(data)
