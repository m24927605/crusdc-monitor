# crUSDC Monitor

## Launch by command

## .env Description
If you want to build docker image, please define the .env at the root path in this project first.
```shell
INFURA_KEY= // This is a key from https://infura.io/dashboard/ethereum/[PROJECT ID]/settings
NETWORK= // Define network for reacting with Ethereum node. Ex: mainnet.
LOG_LEVEL= // Define the log level you want to log. Ex:trace,debug,info,warn and error.
LOG_STATUS_BLOCK_GAP= // Define the log block gap. Ex: 100.
```

### Run in k8s pod
if you didn't run any attach command before.
```shell
kubectl create -f deployment.yml
```

or

```shell
kubectl apply -f deployment.yml
```

## Spotlight

### Problem solving skills

> There was an event interface.I knew the program may could listen the event with ethers library.
> But I found something weird that the listening function maybe not fire in sometimes.
> So I decided to query the transactions at every new block but filtered by event.

### Learning skills

> Review the document of ethers library and check the crUSDC smart contract interface on the Etherscan website.
> Review and compare the better way to run instance in k8s pod.

### Ethereum smart contract, event logs

> Followed the homework hints and kept searching on the document of ethers library.
> Checked event interface on Etherscan website.

### Cream lending platform domain knowledge

> Doing borrow,repay borrow,mint and redeem on CREAM finance platform for many times.

### Project planing skills

> Because I used listening skill, but if many class instances were running ,same listening function would fire if listened same event.
> It looked bad, so I chose Singleton design pattern to avoid the problem.
> Also I concerned the block generated time was not too long for querying data with gRPC, so I used lock to make sure the function must be executed in order.

### Coding related skills

> Use modularization and factory skills to make sure the project follows SOLID principle and OOP design as possible.There are some end-to-end test and unit test to keep the code quality.

### k8s related skills

> Because the project is for logging, I choose daemonSet kind to deploy the program.