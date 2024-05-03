import { GlobalStyles } from './Global.styled';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Chat, Home, Landing, Profile, Test } from './pages';
import { ThemeProvider } from 'styled-components';
import { blueThemeLight, darkTheme } from './data/Theme';
import { LandingTypes } from './utils/LandingTypes';
import { Logger } from './utils';
import FireBaseProvider from './contexts/firebase.context';
import LoaderProvider from './contexts/loader.context';
import WebSocketProvider from './contexts/websocket.context';
import AlertProvider from './contexts/alert.context';
import { useState } from 'react';


function App() {

	// getAuth().setPersistence(browserLocalPersistence)


	Logger.DEV = true;

	const item = localStorage.getItem('theme') ?? 'dark';

	// wsm.connect()

	return (
		<>
			<WebSocketProvider>
				<ThemeProvider theme={item == 'dark' ? darkTheme : blueThemeLight}>



					<FireBaseProvider>
						<BrowserRouter>
							<GlobalStyles />
							<LoaderProvider>
								<AlertProvider>
									<Routes>
										<Route path='/' element={<Navigate to={'/signup'} />} />
										<Route path='/signup' element={<Landing type={LandingTypes.SIGNUP} />} />
										<Route path='/signin' element={<Landing type={LandingTypes.SIGNIN} />} />
										<Route path='/chat' element={<Chat />} />
										<Route path='/test' element={<Test />} />
										<Route path='/profile' element={<Profile />} />
										<Route path='/home' element={<Home />} />
									</Routes>
								</AlertProvider>
							</LoaderProvider>
						</BrowserRouter>
					</FireBaseProvider>

				</ThemeProvider>
			</WebSocketProvider>
		</>
		// <>
		// 	<GlobalStyles />
		// 	<Landing />
		// </>
	)
}

export default App
