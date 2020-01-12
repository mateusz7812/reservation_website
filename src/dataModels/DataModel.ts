
abstract class DataModel{
    id: string | undefined;

    assign(params : {}){
        Object.assign(this, params);
    }

    added() {
        return this.id !== undefined;
    }
}

export default DataModel;