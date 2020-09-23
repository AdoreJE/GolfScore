// Setting for Hyperledger Fabric
const { Wallets, Gateway } = require('fabric-network');

const path = require('path');
const fs = require('fs');

exports.getReservationNetwork = async () => {
  // Connection profile
  const ccpPath = path.resolve(
    __dirname,
    '..',
    '..',
    'test-network',
    'organizations',
    'peerOrganizations',
    'customer.example.com',
    'connection-customer.json'
  );

  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the user.
  const identity = await wallet.get('appUser');
  if (!identity) {
    console.log(
      'An identity for the user "appUser" does not exist in the wallet'
    );
    console.log('Run the registerUser.js application before retrying');
    return;
  }

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork('mychannel');

  // Get the contract from the network.
  const contract = network.getContract('reservation');

  return [contract, gateway];
};

exports.getUserNetwork = async () => {
  // Connection profile
  const ccpPath = path.resolve(
    __dirname,
    '..',
    '..',
    'test-network',
    'organizations',
    'peerOrganizations',
    'customer.example.com',
    'connection-customer.json'
  );

  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the user.
  const identity = await wallet.get('appUser');
  if (!identity) {
    console.log(
      'An identity for the user "appUser" does not exist in the wallet'
    );
    console.log('Run the registerUser.js application before retrying');
    return;
  }

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });

  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork('mychannel');

  // Get the contract from the network.
  const contract = network.getContract('user');

  return [contract, gateway];
};
