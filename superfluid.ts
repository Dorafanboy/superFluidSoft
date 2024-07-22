import {printError, printInfo, printSuccess} from "./logPrinter";
import {gnosis} from "viem/chains";
import {
    createPublicClient,
    createWalletClient,
    formatUnits,
    http,
    PrivateKeyAccount,
    SimulateContractReturnType
} from "viem";
import {Config} from "./config";
import {gdaMintPrice, superFluidContractAddress} from "./superFluidData";
import {superFluidABI} from "./superFluidABI";
import {erc20ABI} from "./erc20";
import {connectPoolABI} from "./connectPool";
import {delay} from "./delayer";

const tokenPoolAddress = '0xe3Cb3C990429a06012bf377ec5BBeB9A6cE25309'

const contractAddress = '0x6da13bde224a05a288748d857b9e7ddeffd1de08'

export async function claimNFT(account: PrivateKeyAccount) {
    printInfo(`Выполняю модуль SuperFluid Gda Mint`);

    const client = createPublicClient({
        chain: gnosis,
        transport: Config.gnosisRpc == '' ? http() : http(Config.gnosisRpc),
    });

    const nftBalance = await client.readContract({
        address: <`0x${string}`>superFluidContractAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [account.address],
    });

    console.log(nftBalance)
    if (nftBalance != BigInt(0)) {
        printInfo(`Нфт присутсвутет на аккаунте, буду выполнять Claim Stream`)
        const result = await connectPool(account)
        return result;
    }

    printInfo(`Вызываю функцию Gda Mint по цене ${formatUnits(gdaMintPrice, 18)} xDAI`);

    const walletClient = createWalletClient({
        chain: gnosis,
        transport: Config.gnosisRpc == '' ? http() : http(Config.gnosisRpc),
    });
    
    const balance = await client.getBalance({
        address: account.address,
    });
    
    if (balance < gdaMintPrice) {
        printError(`Недостаточно средств на балансе ${formatUnits(balance, 18)} xDAI , необходимо ${formatUnits(gdaMintPrice, 18)} xDAI`);
        return false;
    }
    
    const {request} = await client
        .simulateContract({
            address: superFluidContractAddress,
            abi: superFluidABI,
            functionName: 'gdaMint',
            account: account,
            value: gdaMintPrice
        })
        .then((result) => result as SimulateContractReturnType)
        .catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля SuperFluid - ${e}`);
            return {request: undefined};
        });

    if (request !== undefined) {
        const hash = await walletClient.writeContract(request).catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля SuperFluid - ${e}`);
            return false;
        });

        if (hash == false) {
            return false;
        }

        const url = `${`https://gnosisscan.io/tx/` + hash}`;

        printSuccess(`Транзакция успешно отправлена. Хэш транзакции: ${url}\n`);

        await delay(Config.delayBetweenModules.min,Config.delayBetweenModules.max, true)
        await connectPool(account)
    }

    return true;
}

export async function connectPool(account: PrivateKeyAccount) {
    printInfo(`Выполняю модуль SuperFluid Connect Pool`);
    
    const client = createPublicClient({
        chain: gnosis,
        transport: Config.gnosisRpc == '' ? http() : http(Config.gnosisRpc),
    });

    const isMemberConnected = await client.readContract({
        address: <`0x${string}`>contractAddress,
        abi: connectPoolABI,
        functionName: 'isMemberConnected',
        args: [tokenPoolAddress, account.address],
    });
    
    if (isMemberConnected) {
        printInfo(`Пользователь уже подключен к пулу, выполнять connectPool не буду`)
        return false;
    }

    printInfo(`Вызываю функцию Connect Pool`);

    const walletClient = createWalletClient({
        chain: gnosis,
        transport: Config.gnosisRpc == '' ? http() : http(Config.gnosisRpc),
    });

    const {request} = await client
        .simulateContract({
            address: contractAddress,
            abi: connectPoolABI,
            functionName: 'connectPool',
            account: account,
            args: [tokenPoolAddress, '0x']
        })
        .then((result) => result as SimulateContractReturnType)
        .catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля SuperFluid - ${e}`);
            return {request: undefined};
        });

    if (request !== undefined) {
        const hash = await walletClient.writeContract(request).catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля SuperFluid - ${e}`);
            return false;
        });

        if (hash == false) {
            return false;
        }

        const url = `${`https://gnosisscan.io/tx/` + hash}`;

        printSuccess(`Транзакция успешно отправлена. Хэш транзакции: ${url}\n`);
    }

    return true;
}
