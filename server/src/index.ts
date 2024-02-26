import Channel from "./structures/Channel/Channel";
import HttpServer from "./structures/HttpServer";
import WsServer from "./structures/WsServer";
import { config } from "dotenv";
import Logger from "./utils/Logger";
import { app, db, rdb } from "./database/Firebase";
import { push, set, ref, query, onValue, child, limitToFirst, get } from "firebase/database";
import { getMessageId } from "./utils";



// import db from "./database/Main";

const httpServer = new HttpServer(3000);
Logger.DEV = true;

const postListRef = ref(rdb, 'messages' + '/12345');
// const pushref = push(postListRef);



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

(async function () {
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

})();