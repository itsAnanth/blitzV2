import Keyv from '@keyvhq/core';
import KeyvMongo from '@keyvhq/mongo';

class DbClient {

    keyv: Keyv<unknown>;



    constructor(collection?: string) {
        console.log(process.env.MONGO_URL)

        const store = new KeyvMongo(process.env.MONGO_URL, { collection: collection ?? 'keyv' });
        const keyv = new Keyv({ store });

        this.keyv = keyv;
        
    }

    async values() {
        const iterator = this.keyv.iterator();
        const values = [];

        // @ts-ignore
        for await (const [, value] of iterator) {
            values.push(value);
        }

        return values;
    }

    async backup() {

    }
}

export default DbClient;