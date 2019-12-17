import AccountService from "../services/AccountService";
import AccountModel from "../dataModels/AccountModel";
import EventService from "../services/EventService";
import EventModel from "../dataModels/EventModel";

describe('get token from api', ()=>{
    it('correct', async ()=>{
        const apiService = require('../domain/ApiRequests');
        let account: AccountModel = new AccountModel({"login": "login", "password":"password"});
        let tokenObject = {"account": "account id", "id": "token id", "token": "token key"};
        apiService.getTokenFromApi = jest.fn((account: AccountModel)=>
        {
            return Promise.resolve({
                status: 200,
                data: tokenObject
            })
        });
        // @ts-ignore
        await AccountService.getTokenForAccount(account).then((result: AccountModel|undefined)=>{
            expect(result).toBe("token key");
        })
    });
});

describe('add account ', ()=>{
    it('correct',async ()=>{
        const apiService = require('../domain/ApiRequests');
        let accountToAdd: AccountModel = new AccountModel({"login": "login", "password":"password"});
        let addedAccount = new AccountModel({"id": "account id","login": accountToAdd.login,"password": accountToAdd.password});
        apiService.addAccount = jest.fn((account: AccountModel)=>
        {
            return Promise.resolve({
                status: 200,
                data: addedAccount
            })
        });
        // @ts-ignore
        await AccountService.addOne(accountToAdd).then((result: AccountModel|undefined)=>{
            expect(result).toMatchObject(addedAccount);
        })
    });

    it('no login',async ()=>{
        const apiService = require('../domain/ApiRequests');
        let accountToAdd: AccountModel = new AccountModel({"password":"password"});
        apiService.addAccount = jest.fn();
        let result = AccountService.addOne(accountToAdd);
        expect(result===undefined).toBeTruthy();
        expect(apiService.addAccount).toBeCalledTimes(0);
    });

    it('no password',async ()=>{
        const apiService = require('../domain/ApiRequests');
        let accountToAdd: AccountModel = new AccountModel({"login": "login"});
        apiService.addAccount = jest.fn();
        let result = AccountService.addOne(accountToAdd);
        expect(result===undefined).toBeTruthy();
        expect(apiService.addAccount).toBeCalledTimes(0);
    });

});

describe('get account filtered', ()=>{
    it('correct', async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        let gottenAccounts = [new AccountModel({"login": "login", "password":"password"})];
        const apiService = require('../domain/ApiRequests');
        apiService.getAccountFiltered = jest.fn((account: AccountModel, token)=>
        {
            return Promise.resolve({
                status: 200,
                data: gottenAccounts
            })
        });
        // @ts-ignore
        await AccountService.getFiltered(new AccountModel({"login": "login"})).then((result: AccountModel|undefined)=>{
            expect(result).toMatchObject(gottenAccounts);
        })
    })
});


describe('get by id', ()=>{
    it('correct', async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        let gottenAccount = new AccountModel({"id": "account id","login": "login", "password":"password"});
        const apiService = require('../domain/ApiRequests');

        apiService.getAccountById=jest.fn((account: AccountModel, token)=>
        {
            return Promise.resolve({
                status: 200,
                data: gottenAccount
            })
        });

        // @ts-ignore
        await AccountService.getById("id").then((result: AccountModel|undefined)=>{
            expect(result).toMatchObject(gottenAccount);
        })
    });

    it('not found',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');

        apiService.getAccountById=jest.fn((account: AccountModel, token)=>
        {
            return Promise.reject({response: {status: 404, message: "not found"}});
        });
        // @ts-ignore
        await AccountService.getById("id").then((result: AccountModel|undefined)=>{
            expect(result === undefined).toBeTruthy();
        })
    });
});

describe('deleteById', ()=>{
    it('correct', async ()=>{
            const cookiesService = require("../services/CookieService");
            cookiesService.getToken = jest.fn(()=>"token");

            const apiService = require('../domain/ApiRequests');

            apiService.deleteAccountById=jest.fn((id: string, token)=>
            {
                return Promise.resolve({
                    status: 200
                })
            });

            // @ts-ignore
            await AccountService.deleteById("id").then((result: boolean)=>expect(result).toBeTruthy());
    });
});
