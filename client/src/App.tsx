import WsManager from './structures/WsManager';
import { GlobalStyles } from './Global.styled';
import firebase from "./structures/Firebase";
import { Routes, Route } from 'react-router-dom';
import { Chat, Test } from './pages';
import { ThemeProvider } from 'styled-components';
import { blueThemeLight } from './data/Theme';
import { useContext } from 'react';
import { WebSocketContext } from './contexts/websocket.context';


function App() {
	firebase();
	const wsm = useContext(WebSocketContext);

	// wsm.connect()

	return (
		<ThemeProvider theme={blueThemeLight}>
			<GlobalStyles />
			<Routes>
				<Route path='/' element={<Test />} />
				<Route path='/chat' element={<Chat />} />
			</Routes>
		</ThemeProvider>
		// <>
		// 	<GlobalStyles />
		// 	<Landing />
		// </>
	)
}

export default App
