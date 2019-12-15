import AccountService from "../services/AccountService";
import Account from "../dataModels/Account";
import EventService from "../services/EventService";
import Event from "../dataModels/Event";

describe('get token from api', ()=>{
    it('correct', async ()=>{
        const apiService = require('../domain/ApiRequests');
        let account: Account = new Account({"login": "login", "password":"password"});
        let tokenObject = {"account": "account id", "id": "token id", "token": "token key"};
        apiService.getTokenFromApi = jest.fn((account: Account)=>
        {
            return Promise.resolve({
                status: 200,
                data: tokenObject
            })
        });
        // @ts-ignore
        await AccountService.getTokenForAccount(account).then((result: Account|undefined)=>{
            expect(result).toBe("token key");
        })
    });
});

describe('add account ', ()=>{
    it('correct',async ()=>{
        const apiService = require('../domain/ApiRequests');
        let accountToAdd: Account = new Account({"login": "login", "password":"password"});
        let addedAccount = new Account({"id": "account id","login": accountToAdd.login,"password": accountToAdd.password});
        apiService.addAccount = jest.fn((account: Account)=>
        {
            return Promise.resolve({
                status: 200,
                data: addedAccount
            })
        });
        // @ts-ignore
        await AccountService.addOne(accountToAdd).then((result: Account|undefined)=>{
            expect(result).toMatchObject(addedAccount);
        })
    });

    it('no login',async ()=>{
        const apiService = require('../domain/ApiRequests');
        let accountToAdd: Account = new Account({"password":"password"});
        apiService.addAccount = jest.fn();
        let result = AccountService.addOne(accountToAdd);
        expect(result===undefined).toBeTruthy();
        expect(apiService.addAccount).toBeCalledTimes(0);
    });

    it('no password',async ()=>{
        const apiService = require('../domain/ApiRequests');
        let accountToAdd: Account = new Account({"login": "login"});
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
        let gottenAccounts = [new Account({"login": "login", "password":"password"})];
        const apiService = require('../domain/ApiRequests');
        apiService.getAccountFiltered = jest.fn((account: Account, token)=>
        {
            return Promise.resolve({
                status: 200,
                data: gottenAccounts
            })
        });
        // @ts-ignore
        await AccountService.getFiltered(new Account({"login": "login"})).then((result: Account|undefined)=>{
            expect(result).toMatchObject(gottenAccounts);
        })
    })
});


describe('get by id', ()=>{
    it('correct', async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        let gottenAccount = new Account({"id": "account id","login": "login", "password":"password"});
        const apiService = require('../domain/ApiRequests');

        apiService.getAccountById=jest.fn((account: Account, token)=>
        {
            return Promise.resolve({
                status: 200,
                data: gottenAccount
            })
        });

        // @ts-ignore
        await AccountService.getById("id").then((result: Account|undefined)=>{
            expect(result).toMatchObject(gottenAccount);
        })
    });

    it('not found',async ()=>{
        const cookiesService = require("../services/CookieService");
        cookiesService.getToken = jest.fn(()=>"token");
        const apiService = require('../domain/ApiRequests');

        apiService.getAccountById=jest.fn((account: Account, token)=>
        {
            return Promise.reject({response: {status: 404, message: "not found"}});
        });
        // @ts-ignore
        await AccountService.getById("id").then((result: Account|undefined)=>{
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
