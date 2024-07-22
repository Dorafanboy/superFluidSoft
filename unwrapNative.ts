import {
    createPublicClient,
    createWalletClient,
    formatEther,
    http,
    PrivateKeyAccount,
    SimulateContractReturnType
} from "viem";
import {printError, printInfo, printSuccess} from "./logPrinter";
import {gnosis} from "viem/chains";
import {Config, SuperFluidUnwrapNative} from "./config";
import {downgradeABI} from "./downgrade";
import {erc20ABI} from "./erc20";

const unwrapNativeContractAddress = '0x59988e47A3503AaFaA0368b9deF095c818Fdca01'

export async function unwrapNative(account: PrivateKeyAccount) {
    printInfo(`Выполняю модуль SuperFluid Unwrap Native`);

    const client = createPublicClient({
        chain: gnosis,
        transport: Config.gnosisRpc == '' ? http() : http(Config.gnosisRpc),
    });

    printInfo(`Вызываю функцию Unwrap Native`);

    const walletClient = createWalletClient({
        chain: gnosis,
        transport: Config.gnosisRpc == '' ? http() : http(Config.gnosisRpc),
    });
    
    let withdrawAmount: bigint;

    const balance = await client.readContract({
        address: <`0x${string}`>unwrapNativeContractAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [account.address],
    });

    printInfo(`Текущий баланс: ${formatEther(balance)} xDAIx`)
    
    if (SuperFluidUnwrapNative.isUnwrapAll) {
        printInfo(`Включен режим вывода всего накопленного в стейке`)
        withdrawAmount = balance;
    } else {
        const withdrawPercent = Math.floor(
            Math.random() * (SuperFluidUnwrapNative.percentUnwrap.max - SuperFluidUnwrapNative.percentUnwrap.min) +
            SuperFluidUnwrapNative.percentUnwrap.min,
        );
        
        printInfo(`Буду выводить из стейка ${withdrawPercent}%`)

        withdrawAmount = (balance * BigInt(withdrawPercent)) / BigInt(100); // Результат
    }

    printInfo(`Буду выводить из стейка ${formatEther(withdrawAmount)} xDAIx`)

    const {request} = await client
        .simulateContract({
            address: unwrapNativeContractAddress,
            abi: downgradeABI,
            functionName: 'downgradeToETH',
            account: account,
            args: [withdrawAmount]
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

        const transaction = await client.waitForTransactionReceipt(
            { hash: <`0x${string}`>hash }
        ).then((result) => printSuccess(`Транзакция успешно отправлена. Хэш транзакции: ${url}\n`))
            .catch((e) => {
                printError(`Произошла ошибка во время выполнения модуля SuperFluid - ${e}`);
                return {request: undefined};
            });
    }

    return true;
}