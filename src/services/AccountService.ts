
import Account from "../dataModels/Account";
import {addAccount, getTokenFromApi, deleteAccountById, getAccountById, getAccountFiltered} from "../domain/ApiRequests";
import {AxiosError, AxiosResponse} from "axios";
import {getToken} from "./CookieService";

function getTokenForAccount(account:Account): Promise<string|undefined>|undefined{
    if (account.login === undefined || account.password === undefined) {
        return undefined;
    }
    return getTokenFromApi(account).then((response: AxiosResponse) => {
        if (response.status === 200) {
            return response.data.token;
        }
        return undefined;
    });
}

function addOne(account: Account): Promise<Account|undefined>|undefined{
    if (account.login === undefined || account.password === undefined) {
        return undefined;
    }
    return addAccount(account).then((response: AxiosResponse) => {
        if (response.status === 200) {
            return new Account(response.data);
        }
        return undefined;
    });

}

function getFiltered(account: Account): Promise<Account[]|undefined>|undefined{
    let token = getToken();
    if( token === undefined){
        return undefined;
    }
    return getAccountFiltered(account, token).then((response: AxiosResponse) => {
        let responseArray: Account[] = [];
        if (response.status === 200) {
            if(response.data[0] !== null){
                response.data.forEach((dict: {})=>
                    responseArray.push(new Account(dict)))
            }
            return responseArray;
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
            return new Account(response.data);
        }
        return undefined;
    }).catch((error: AxiosError)=>{
        // @ts-ignore
        if (error.response.status === 404){return undefined}
        else{throw error}
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

const AccountService = {getTokenForAccount, addOne, getFiltered, getById, editById, deleteById};

export default AccountService;
