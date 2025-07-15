// const fetch = require('node-fetch');

const GRAPH_ENDPOINT = 'https://api.goldsky.com/api/public/project_cm4iagnemt1wp01xn4gh1agft/subgraphs/euler-v2-mainnet/latest/gn';

const query = `
  query Accounts($address: ID!) {
    trackingActiveAccount(id: $address) {
      mainAddress
      deposits
      borrows
    }
  }
`;

const variables = {
  address: '0x8a25d8c9fa8c7a726137f2d618d85cbc2c083f78'
};

fetch(GRAPH_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables }),
})
  .then(res => res.json())
  .then(data => {
    const account = data.data.trackingActiveAccount;
    if (!account) {
      console.log('No active positions found for this address.');
      return;
    }

    const deposits = account.deposits || [];
    const borrows = account.borrows || [];

    console.log('Deposits:');
    deposits.forEach(entry => {
      const subAccount = entry.substring(0, 42);
      const vault = `0x${entry.substring(42)}`;
      console.log(`- SubAccount: ${subAccount}, Vault: ${vault}`);
    });

    console.log('Borrows:');
    borrows.forEach(entry => {
      const subAccount = entry.substring(0, 42);
      const vault = `0x${entry.substring(42)}`;
      console.log(`- SubAccount: ${subAccount}, Vault: ${vault}`);
    });
  })
  .catch(err => console.error('GraphQL Error:', err));
