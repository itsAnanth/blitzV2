import { server } from "websocket";
import fs from 'fs';
import { createServer } from 'http'
import WsEvent from "./Events/WsEvent";
import Message, { DataTypes, MessageTypes } from "../../../shared/Message";
import User from "./User/User";
import { Logger, getMessageId } from "../utils";

import colors from 'colors/safe';
import Room from "./Channel/Channel";
import Cache from "./Cache/Cache";
import Channel from "./Channel/Channel";
import { ref, query, equalTo, orderByChild, get } from 'firebase/database';
import { DbChannel, rdb } from "../../../database";

class WsServer extends server {

    cache: Cache
    // this map consists of all the events located under /events folder
    // websocket reads the functions to execute on a specific message from here
    events: Map<MessageTypes, WsEvent>;
    // collection of all collected users
    // map { userId: User object }
    users: Map<string, User>;
    channels: Map<string, Room>;

    constructor(httpServer: ReturnType<typeof createServer>) {
        if (!httpServer) throw new Error('No http server found');
        super({ httpServer: httpServer });

        this.cache = new Cache();
        this.events = new Map();
        this.users = new Map();
        this.channels = this.cache.channels;// new Map();
    }

    async init() {
        // loading all events from /events into memory for dynamic execution
        const eventsPath = fs.readdirSync('./src/events/WebSocket');

        if (eventsPath.length === 0) return console.log('empty server events');

        for (let i = 0; i < eventsPath.length; i++) {
            const event = (await import(`../events/WebSocket/${eventsPath[i]}`)).default as WsEvent;

            if (this.events.has(event.messageType)) continue;

            this.events.set(event.messageType, event);
        }

        Logger.log(colors.blue('[WS_SERVER]'), [...this.events.keys()].map(x => MessageTypes[x]));

        await this.loadChannelsFromDb();

    }

    async loadChannelsFromDb() {
    
        const reference = ref(rdb, 'channels');
        const querySnapshot = await get(reference);
        querySnapshot.forEach((doc) => {
            let data: DbChannel = doc.val();

            const channel = new Channel({
                id: data.channelId,
                name: data.name,
                users: data.users
            })

            this.channels.set(data.channelId, channel);
        });

        console.log("LOADED CHANNELS", this.channels)
    }

    private _sendErrorMessage() {

    }


    start() {
        // client connected
        this.on('connect', (_connection) => {
            // add new user to users map

            // const user = new User({ connection });
            // connection.id = user.userId;

            // this.users.set(user.userId, user);

            Logger.log(colors.blue('[WS_SERVER]'), '[WS_CONNECTION]', '-> new user join');

            // Logger.log('Current users ->', [...this.users.keys()])
            // see discord saw i have it by my side , ican see msg

        });

        // user disconnected, remove from users map followok

        this.on('close', (connection, _number, _description) => {
            const user = this.users.get(connection.id);


            if (!user) return;
            
            let channel = this.channels.get(user.activeChannel);


            






            if (user && user.activeChannel) {
                // const channel = this.channels.get(user.activeChannel);

                // channel.users.splice(channel.users.indexOf(user.id), 1);

                Logger.log('[USER LEFT CHANNEL]', channel.id, channel.users.values())
            }

            // channel.broadCast(this.users, new Message<DataTypes.Server.JOIN_CHANNEL>({
            //     type: Message.types.JOIN_CHANNEL,
            //     data: channel.getUsers(this.users)
            // }))

            this.users.delete(connection.id);

            Logger.log(colors.blue('[WS_SERVER]'), '[WS_CONNECTION_CLOSE]', '-> user left');

            Logger.log('Current users ->', [...this.users.keys()]);


        })


        // new websocket request
        this.on('request', request => {


            // this is to accept all requests from all origins
            const connection = request.accept(null, request.origin);


            // connection is the instance of connected client
            connection.on('message', message => {
                // we only want to accept binary data, binary is smaller and faster than strings. 
                if (message.type == 'utf8') return console.error('invalid ws message type');

                // message is my custom class to encode and decode into smaller pakcets for sex speed
                // i'll show later
                // inflate converts raw binary data to human readable format
                const data = Message.decode(message.binaryData);


                // if no output from inflate, then packet was tampered with 
                // error proection
                if (!data) return console.error('Error parsing message');

                Logger.log(colors.blue('[WS_CLIENT]'), `[${MessageTypes[data.type]}] ->`, data);


                // see if the event sent from client is registered on server side
                const wsevent = this.events.get(data.type);

                // if not, exit
                if (!wsevent) return;

                // if exists, then execute the associated function written in server to handle request
                wsevent.callback.call(this, connection, data);

            });

        })
    }
}

export default WsServer;