import Channel from "./structures/Channel/Channel";
import HttpServer from "./structures/HttpServer";
import WsServer from "./structures/WsServer";
import { config } from "dotenv";
import Logger from "./utils/Logger";
import { push, set, ref, query, onValue, child, limitToFirst, get, orderByChild, equalTo } from "firebase/database";
import { getMessageId } from "./utils";
import { DbUser, messagesDb, rdb, usersDb } from "../../database";

const httpServer = new HttpServer(3000);
Logger.DEV = true;

// const pushref = push(postListRef);



// Db.getMessageById('12345');

// onValue(postListRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//         const childKey = childSnapshot.key;
//         const childData = childSnapshot.val();


//         console.log(childKey, childData)
//     });
// }, {
//     onlyOnce: true
// });

// get(query(postListRef, limitToFirst(10))).then(v => {
//     v.forEach(s => console.log("q", s.val()))
//     console.log("queryyyy") })


declare module 'websocket' {
    interface connection {
        id: string;
    }
}

(async function() {
    
    // console.log('testing db', await messagesDb.getMessagesInRange('-NwLAiV6bPrMHbVQrEKn', 5))
    // let data = null as any;

    // const snap = await get(query(reference, orderByChild('channelId'), equalTo("-NvMjN7SAzzsTneDPmMN")))

    
    // snap.forEach(s => {
    //     data = s.val();
    //     console.log(s.val())
    // })

    // data.name = "updated";

    

    // await set(ref(rdb, `channels/${data.channelId}`), data)

    // console.log(snap.size)

    // const q = await get(reference);
    // q.forEach(x => {
    //     console.log(x.val())
    // })
})()

// Db.getMessageById("12345")

// @ts-ignore
!process.argv.includes('noserver') && (async function () {
    await httpServer.init();
    httpServer.start();

    const wsServer = new WsServer(httpServer.server);


    await wsServer.init();

    wsServer.channels.set('12345', new Channel({ id: '12345', name: 'main' }));

    // for (let i = 0; i < 5; i++) {
    //     let temp = new Channel({ id: getChannelId(), name: 'general' });
    //     wsServer.channels.set(temp.id, temp);
    // }
    wsServer.start();

    httpServer.setWsServer(wsServer);


    const bot = await usersDb.getUser('bot');

    if (!bot) {
        Logger.log('[NO BOT USER]', 'setting bot user');

        const bot: DbUser = {
            userId: 'bot',
            username: 'Blitz Bot',
            photoURL: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${0}`,
            channels: [],
            timestamp: Date.now()
        }

        await usersDb.setDbUser(bot)

        Logger.log('[SET BOT USER]', 'done')
    }

})();