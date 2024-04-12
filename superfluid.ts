import {printError, printInfo, printSuccess} from "./logPrinter";
import {gnosis, mainnet} from "viem/chains";
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

export async function claimNFT(account: PrivateKeyAccount) {
    printInfo(`Выполняю модуль SuperFluid Gda Mint`);

    const client = createPublicClient({
        chain: gnosis,
        transport: Config.gnosisRpc == '' ? http() : http(Config.gnosisRpc),
    });

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
    }

    return true;
}
