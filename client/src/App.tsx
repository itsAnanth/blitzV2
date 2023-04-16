import { useState, useEffect } from 'react'
import WsManager from './structures/WsManager';
import { Landing } from './components';
import { GlobalStyles } from './Global.styled';
import firebase from "./structures/Firebase";
import { Routes, Route } from 'react-router-dom';
import { Chat } from './pages';
import { ThemeProvider } from 'styled-components';
import { bwThemeDark } from './data/Theme';


function App() {
	firebase();
	const wsm = new WsManager();

	// wsm.connect()

	return (
		<ThemeProvider theme={bwThemeDark}>
			<GlobalStyles />
			<Routes>
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
