import {IBridgeRange, IDelayRange} from "./interfaces";

export class Config {
    public static readonly delayBetweenAccounts: IDelayRange = { min: 15, max: 25 }; // задержка между аккаунтами (в минутах)
    public static readonly delayBetweenGweiCheck: IDelayRange = { min: 0.3, max: 1 }; // задержка перед получением нового гвея (в минутах)
    public static readonly gnosisRpc: string = 'https://rpc.ankr.com/gnosis'; // rpc, если нет необходимости то оставить ''
}

export class SuperFluidConfig {
    public static readonly isUse: boolean = true; // использовать ли скрипт
}
