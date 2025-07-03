@chainlink/contracts/=lib/chainlink/contracts/src/v0.8/
@chainlink/contracts-ccip/=lib/chainlink/contracts/src/v0.8/ccip/
@openzeppelin/contracts/=lib/chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/
@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/
chainlink-brownie-contracts/=lib/foundry-chainlink-toolkit/lib/chainlink-brownie-contracts/contracts/src/v0.6/vendor/@arbitrum/nitro-contracts/src/
ds-test/=lib/foundry-chainlink-toolkit/lib/forge-std/lib/ds-test/src/
forge-std/=lib/forge-std/src/
foundry-chainlink-toolkit/=lib/foundry-chainlink-toolkit/
@chainlink/local/=lib/chainlink-local/
chainlink/=lib/chainlink/
erc4626-tests/=lib/openzeppelin-contracts-upgradeable/lib/erc4626-tests/
halmos-cheatcodes/=lib/openzeppelin-contracts-upgradeable/lib/halmos-cheatcodes/src/
openzeppelin-contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/
openzeppelin-contracts/=lib/openzeppelin-contracts-upgradeable/lib/openzeppelin-contracts/

// remapp
"@chainlink/contracts/=lib/chainlink/contracts/src/v0.8/",
"@chainlink/contracts-ccip/=lib/chainlink/contracts/src/v0.8/ccip/",
"@openzeppelin/contracts/=lib/chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/",
"@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/",
"chainlink-brownie-contracts/=lib/foundry-chainlink-toolkit/lib/chainlink-brownie-contracts/contracts/src/v0.6/vendor/@arbitrum/nitro-contracts/src/",
"ds-test/=lib/foundry-chainlink-toolkit/lib/forge-std/lib/ds-test/src/",
"forge-std/=lib/forge-std/src/",
"foundry-chainlink-toolkit/=lib/foundry-chainlink-toolkit/",
"@chainlink/local/=lib/chainlink-local/"

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
