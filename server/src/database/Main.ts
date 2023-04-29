import Message from "../../../shared/Message";
import DbClient from "./Db";

const DbStructure = {
    id: '0',
    messages: {}
}



type IDbStructure = {
    id: string;
    messages: {
        [id: string]: Buffer
    }

}

class MainDb extends DbClient {

    dbId: string;

    constructor() {
        super('blitz_main');
        this.dbId = '0';
    }

    
    async get(): Promise<IDbStructure> {
        let value = await this.keyv.get(this.dbId) as null | undefined | IDbStructure;

        if (!value) value = DbStructure;

        return value;
    }


    async setMessage(id: string, message: ReturnType<Message['encode']>) {
        const res = await this.get();
        
        res.messages[id] = message;

        await this.keyv.set(this.dbId, res);
    }

    async getMessage(): Promise<IDbStructure['messages']> {
        return (await this.get()).messages;
    }
}

const db = new MainDb();

export default db;