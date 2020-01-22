import AccountModel from "../dataModels/AccountModel";
import {
    addAccount,
    deleteAccountById,
    getAccountById,
    getAccountFiltered,
    getAllAccounts,
    getTokenFromApi,
    updateAccount
} from "../domain/ApiRequests";
import {AxiosError, AxiosResponse} from "axios";
import {getToken} from "./CookieService";

function getTokenForAccount(account:AccountModel): Promise<string|undefined>|undefined{
    if (account.login === undefined || account.password === undefined) return undefined;

    return getTokenFromApi(account).then((response: AxiosResponse) => {
        return response.status === 200
            ? response.data
            : undefined;
    });
}

function addOne(account: AccountModel): Promise<AccountModel|undefined>|undefined{
    if (account.login === undefined || account.password === undefined) return undefined;

    return addAccount(account).then((response: AxiosResponse) => {
        return response.status === 200
            ? new AccountModel(response.data)
            : undefined;
    });

}

function getAll() {
    let token = getToken();
    if( token === undefined) return undefined;

    return getAllAccounts(token).then((response: AxiosResponse) => {
        return response.status === 200
            ? response.data.map((dict: {}) => new AccountModel(dict))
            : undefined;
    });
}

function getFiltered(account: AccountModel): Promise<AccountModel[]|undefined>|undefined{
    let token = getToken();
    if( token === undefined) return undefined;

    return getAccountFiltered(account, token).then((response: AxiosResponse) => {
        return response.status === 200
            ? response.data.map((dict: {}) => new AccountModel(dict))
            : undefined;
    });
}

function getById(id: string) {
    let token = getToken();
    if( token === undefined) return undefined;

    return getAccountById(id, token).then((response: AxiosResponse) => {
        return response.status === 200
            ? new AccountModel(response.data)
            : undefined;
    }).catch((error: AxiosError)=>{
        if (error.response?.status === 404) return undefined;
        throw error;
    });
}

function updateOne(accountMap: AccountModel){
    let token = getToken();
    if( token === undefined) return undefined;

    if(accountMap.id === undefined) return undefined;

    return updateAccount(accountMap, token).then((response: AxiosResponse)=>{
        return response.status === 200
            ? new AccountModel(response.data)
            : undefined;
    });

}

function deleteById(id: string):boolean{
    let token = getToken();
    if( token === undefined) return false;

    return deleteAccountById(id, token).then((response: AxiosResponse) => response.status === 200);
}


const AccountService = {getTokenForAccount, addOne, getFiltered, getById, updateOne, deleteById, getAll};

export default AccountService;
