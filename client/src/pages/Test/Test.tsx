import { useNavigate } from "react-router-dom";
import Message, { DataTypes } from "../../../../shared/Message";
import { WebSocketContext } from "../../contexts/websocket.context";
import WsManager from "../../structures/WsManager";
import { useContext, useEffect } from 'react';
import { ReactReduxContext } from "react-redux/es/exports";
import { LoaderContext } from "../../contexts/loader.context";
import { FireBaseContext } from "../../contexts/firebase.context";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";


function Test() {
    const firebaseContext = useContext(FireBaseContext);
    const loaderContext = useContext(LoaderContext);
    const wsContext = useContext(WebSocketContext);

    useEffect(() => {
        loaderContext.setLoader(false);


    })


    useEffect(() => {
        const userId = firebaseContext.user?.uid as string;
        // setDoc(doc(firebaseContext.db, 'test_users', userId), {
        //     channels: ['12345']
        // })
        wsContext.connect();

        wsContext.addEventListener('wsopen', () => {
            wsContext.send(new Message({
                type: Message.types.GET_CHANNEL,
                data: ['12345']
            }))
        })
    }, [])
    return (
        <div>sreedev</div>
    )

}

export default Test;