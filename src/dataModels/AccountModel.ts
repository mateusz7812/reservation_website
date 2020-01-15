import DataModel from "./DataModel";

class AccountModel extends DataModel{
    login: string|undefined;
    password: string|undefined;
    reservations: string[]|undefined;
    roles: string[]|undefined;

    constructor(params?: {}) {
        super();
        if(params !== undefined) super.assign(params);
    }

    isAdmin() {
        return this.roles?.includes("ROLE_ADMIN") ?? false;
    }
}

export default AccountModel;