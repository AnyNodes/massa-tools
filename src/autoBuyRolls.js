const fs = require('fs');
const path = require('path');
const { ClientFactory, DefaultProviderUrls, CHAIN_ID, WalletClient } = require('@massalabs/massa-web3');
const cron = require('node-cron');
const winston = require('winston');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load .env file

// Create a logger instance with a more specific filename
const logDir = path.resolve(__dirname, '../log');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'autoBuyRolls.log') })
    ]
});

async function checkBalanceAndBuyRolls() {
    try {
        // Get the address and private key from the .env file
        const privateKey = process.env.PRIVATE_KEY;

        // Get the account
        const account = await WalletClient.getAccountFromSecretKey(privateKey);
        if (!account || !account.address) {
            throw new Error('Failed to retrieve account or account address is undefined.');
        }
        const address = account.address;

        // Create a Massa Web3 client instance, connect to the mainnet, and specify the base account
        const client = await ClientFactory.createDefaultClient(DefaultProviderUrls.MAINNET, CHAIN_ID.MainNet, true, account);

        // Create a WalletClient instance using the same provider as client
        const walletClient = new WalletClient(client.clientConfig, client.publicApiClient, account);

        // Query the balance of the address
        const balance = await walletClient.getAccountBalance(address);

        // Convert BigInt to string for logging
        logger.info(`Balance for ${address}: ${JSON.stringify(balance, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )}`);

        // Convert the balance to a decimal and keep two decimal places
        const formattedBalance = Number(balance.final.toString()) / 1e9;
        logger.info(`Formatted balance for ${address}: ${formattedBalance}`);

        // If the balance is greater than 100, execute the buy rolls operation
        if (formattedBalance > 100) {
            const rollsAmount = BigInt(Math.floor(formattedBalance / 100));  // Buy rolls based on balance
            const gasFee = BigInt(0.01 * 1e9);  // Convert 0.01 Massa to nano units

            const txData = {
                amount: rollsAmount,
                fee: gasFee,
            };
            console.log('Transaction data:', txData);

            // Get the baseAccount
            const baseAccount = client.wallet().getBaseAccount();

            // Execute buyRolls operation with baseAccount instance
            const operationsId = await baseAccount.buyRolls(txData);
            logger.info('Buy rolls operation ID: ' + operationsId);

        } else {
            logger.info(`Formatted balance is not greater than 100 (${formattedBalance}), not sufficient to buy rolls.`);
        }

    } catch (error) {
        logger.error('Error querying balance or buying rolls: ' + error.message);
    }
}

// Set up the cron job to execute the checkBalanceAndBuyRolls function periodically
// This is set to run every hour
cron.schedule('0 * * * *', () => {
    logger.info('Running cron job to check balance and buy rolls...');
    checkBalanceAndBuyRolls();
});

// Manually trigger once to ensure the balance is checked immediately upon script startup
checkBalanceAndBuyRolls();
