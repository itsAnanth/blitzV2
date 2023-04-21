import { GlobalStyles } from './Global.styled';
import firebaseInit from "./structures/Firebase";
import { Routes, Route } from 'react-router-dom';
import { Chat, Landing, Test } from './pages';
import { ThemeProvider } from 'styled-components';
import { blueThemeLight } from './data/Theme';
import { useContext } from 'react';
import { WebSocketContext } from './contexts/websocket.context';
import { LandingTypes } from './utils/LandingTypes';
import { Logger } from './utils';
import { browserLocalPersistence, getAuth, inMemoryPersistence } from 'firebase/auth';
import FireBaseProvider from './contexts/firebase.context';


function App() {

	// getAuth().setPersistence(browserLocalPersistence)

	Logger.DEV = true;

	// wsm.connect()

	return (
		<ThemeProvider theme={blueThemeLight}>
			<FireBaseProvider>
				<GlobalStyles />
				<Routes>
					{/* <Route path='/' element={<Test />} /> */}
					<Route path='/signup' element={<Landing type={LandingTypes.SIGNUP} />} />
					<Route path='/signin' element={<Landing type={LandingTypes.SIGNIN} />} />
					<Route path='/chat' element={<Chat />} />
				</Routes>
			</FireBaseProvider>
		</ThemeProvider>
		// <>
		// 	<GlobalStyles />
		// 	<Landing />
		// </>
	)
}

export default App
