
import Account from "../dataModels/Account";
import {addAccount, deleteAccountById, getAccountById, getAccountFiltered} from "../domain/ApiRequests";
import {AxiosResponse} from "axios";
import {getToken} from "./CookieService";

function addOne(account: Account): Promise<Account|undefined>|undefined{
    if (!(account.login !== undefined && account.password !== undefined)) {
        return undefined;
    }
    return addAccount(account).then((response: AxiosResponse) => {
        if (response.status === 200) {
            return Object.assign(new Account(), JSON.parse((response as any).response));
        }
        return undefined;
    });

}

function getFiltered(account: Account): Promise<Account|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getAccountFiltered(account, token).then((response: AxiosResponse) => {
        if (response.status === 200) {
            return JSON.parse((response as any).response).map((dict: {})=> Object.assign(new Account(), dict))
        }
        return undefined;
    });
}

function getById(id: string) {
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getAccountById(id, token).then((response: AxiosResponse) => {
        if (response.status === 200) {
            return Object.assign(new Account(), JSON.parse((response as any).response));
        }
        return undefined;
    });
}

function editById(account: Account){
    return Promise.resolve();
}

function deleteById(id: string):boolean{
    let token = getToken();
    if( token === undefined){
        return false;
    }
    return deleteAccountById(id, token).then((response: AxiosResponse) => {
        return response.status === 200;
    });
}

const AccountService = {addOne, getFiltered, getById, editById, deleteById};

export default AccountService;
