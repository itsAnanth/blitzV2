import { GlobalStyles } from './Global.styled';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Chat, Landing, Profile, Test } from './pages';
import { ThemeProvider } from 'styled-components';
import { blueThemeLight, darkTheme } from './data/Theme';
import { LandingTypes } from './utils/LandingTypes';
import { Logger } from './utils';
import FireBaseProvider from './contexts/firebase.context';
import LoaderProvider from './contexts/loader.context';
import WebSocketProvider from './contexts/websocket.context';


function App() {

	// getAuth().setPersistence(browserLocalPersistence)

	console.log(window.location.href);

	Logger.DEV = true;

	// wsm.connect()

	return (
		<ThemeProvider theme={darkTheme}>
			<WebSocketProvider>
				<FireBaseProvider>
					<BrowserRouter>
						<GlobalStyles />
						<LoaderProvider>
							<Routes>
								<Route path='/' element={<Navigate to={'/signup'} />} />
								<Route path='/signup' element={<Landing type={LandingTypes.SIGNUP} />} />
								<Route path='/signin' element={<Landing type={LandingTypes.SIGNIN} />} />
								<Route path='/chat' element={<Chat />} />
								<Route path='/test' element={<Test />} />
								<Route path='/profile' element={<Profile />} />
							</Routes>
						</LoaderProvider>
					</BrowserRouter>
				</FireBaseProvider>
			</WebSocketProvider>
		</ThemeProvider>
		// <>
		// 	<GlobalStyles />
		// 	<Landing />
		// </>
	)
}

export default App
