/**
 * 
 * Cache class holds all the active servers and users in memory for faster operations
 * 
 */

import { getChannelId } from "../../utils"
import Channel from "../Channel/Channel"


class Cache {

    channels: Map<ReturnType<typeof getChannelId>, Channel>
    
    /**
     * currentTime - Channel._lastUpdate > _cacheFlush
     * channel is deemed to be inactive and remove it from cache
     */
    _cacheFlush: number

    constructor() {
        this.channels = new Map();
    }


    addChannel(channel: Channel) {
        this.channels.set(channel.id, channel);
    }

    removeChannel(channel: Channel) {
        this.channels.delete(channel.id);
    }


    cacheFlush() {
        const channels = [...this.channels.values()]
        const now = Date.now()
       
        for (let i = 0; i < channels.length; i++) {
            const channel = channels[i];

            const diff = now - channel._lastUpdate;

            if (diff < this._cacheFlush && channel.users.length != 0) continue;

            this.removeChannel(channel)
        }
    }



}

export default Cache;