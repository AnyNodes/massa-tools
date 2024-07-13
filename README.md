# Massa-tools

Massa-tools is a Node.js script set designed to automate the process of operation on the Massa blockchain network. The first feature autoBuyRolls is checking account balances and buying rolls.

## Introduction

AutoBuyRolls periodically monitors an account's balance and executes a transaction to buy rolls when the balance meets certain criteria. It uses cron jobs for scheduling and integrates logging for tracking operations.

## Installation

Clone the repository:

```bash
git clone https://github.com/AnyNodes/massa-tools.git
cd massa-tools
```

Install dependencies:

```bash
npm install
npm install -g pm2
```

## Configuration

1.	Create a .env file in the root directory with the following content:

```dotenv
PRIVATE_KEY=your_private_key_here
```
Replace your_private_key_here with the private key associated with your Massa blockchain account.

2. Adjust the cron schedule in src/autoBuyRolls.js if needed. By default, the script runs every hour (0 * * * *).

## Usage

Once configured, AutoBuyRolls can be run with:

```bash
npm run start
```
The script will log information to the console and write detailed logs to log/autoBuyRolls.log.

## Using PM2

PM2 is a process manager for Node.js applications that allows you to keep your application running continuously, manage logs, and more.

1. Install PM2 globally if not already installed
```bash
npm install -g pm2
```

2. Start the script with PM2
```bash
pm2 start src/autoBuyRolls.js --name autoBuyRolls
```

3. To view logs:
```bash
pm2 logs autoBuyRolls
```

4. To stop the script:
```bash
pm2 stop autoBuyRolls
```

5. To restart the script:
```bash
pm2 restart autoBuyRolls
```

6. To delete the script from PM2:
```bash
pm2 delete autoBuyRolls
```
 
## Logs

Logs for AutoBuyRolls are stored in the log directory. Detailed information about each run, including balance queries, transaction data, and errors encountered, can be found in autoBuyRolls.log.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
