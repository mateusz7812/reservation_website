
class AccountModel{
    id: string|undefined;
    login: string|undefined;
    password: string|undefined;
    reservations: string[]|undefined;
    roles: string[]|undefined;

    constructor(params : {}){
        Object.assign(this, params);
    }
}

export default AccountModel;