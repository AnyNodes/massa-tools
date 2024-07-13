const { ClientFactory, DefaultProviderUrls, CHAIN_ID, WalletClient } = require('@massalabs/massa-web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load .env file

async function buyRolls() {
    try {
        const privateKey = process.env.PRIVATE_KEY;

        const account = await WalletClient.getAccountFromSecretKey(privateKey);

        if (!account || !account.address) {
            console.error('Invalid account: address is not defined or empty');
            return;
        }

        const client = await ClientFactory.createDefaultClient(DefaultProviderUrls.MAINNET, CHAIN_ID.MainNet, true, account);
        const walletClient = new WalletClient(client.clientConfig, client.publicApiClient, account);
        const balance = await walletClient.getAccountBalance(account.address);
        console.log('balance:', balance);

        // Example transaction data
        const txData = {
            amount: BigInt(1),  // Buy one roll
            fee: BigInt(10000000)  // Set fee in nano units
        };

        console.log('Transaction data:', txData);

        // Execute buyRolls operation with baseAccount instance
        const baseAccount= client.wallet().getBaseAccount();
        const operationsId = await baseAccount.buyRolls(txData);
        console.log('Buy rolls operation ID:', operationsId);
    } catch (error) {
        console.error('Error in buyRolls:', error.message);
        console.error(error);
    }
}

buyRolls();
