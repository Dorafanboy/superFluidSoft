import {IBridgeRange, IDelayRange} from "./interfaces";

export class Config {
    public static readonly delayBetweenAccounts: IDelayRange = { min: 15, max: 25 }; // задержка между аккаунтами (в минутах)
    public static readonly gnosisRpc: string = 'https://rpc.ankr.com/gnosis'; // rpc, если нет необходимости то оставить ''
    public static readonly delayBetweenModules: IDelayRange = { min: 1, max: 3 }; // задержка перед вызовом функции для Claim Stream (в минутах)
}

export class SuperFluidConfig {
    public static readonly isUse: boolean = true; // использовать ли скрипт
}

export class SuperFluidUnwrapNative {
    public static readonly isUnwrapAll: boolean = true; // выводить весь xDAI, если false, то будет браться процент из переменной percentUnwrap
    public static readonly percentUnwrap: IDelayRange = { min: 70, max: 80 }; // сколько процентов unwrap'aть из накопленного
}