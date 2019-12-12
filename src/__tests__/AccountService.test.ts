import AccountService from "../services/AccountService";
import Account from "../dataModels/Account";

describe('add account ', ()=>{
    it('correct',async ()=>{
        const apiService = require('../domain/ApiRequests');
        let accountToAdd: Account = new Account({"login": "login", "password":"password"});
        let addedAccount = new Account({"id": "account id","login": accountToAdd.login,"password": accountToAdd.password});
        apiService.addAccount = jest.fn((account: Account)=>
        {
            return Promise.resolve({
                status: 200,
                response: JSON.stringify(addedAccount)
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
                response: JSON.stringify(gottenAccounts)
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
                response: JSON.stringify(gottenAccount)
            })
        });

        // @ts-ignore
        await AccountService.getById("id").then((result: Account|undefined)=>{
            expect(result).toMatchObject(gottenAccount);
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
