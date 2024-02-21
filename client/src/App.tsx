import { GlobalStyles } from './Global.styled';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Chat, Landing, Test } from './pages';
import { ThemeProvider } from 'styled-components';
import { blueThemeLight, darkTheme } from './data/Theme';
import { LandingTypes } from './utils/LandingTypes';
import { Logger } from './utils';
import FireBaseProvider from './contexts/firebase.context';
import LoaderProvider from './contexts/loader.context';


function App() {

	// getAuth().setPersistence(browserLocalPersistence)

	console.log(window.location.href);

	Logger.DEV = true;

	// wsm.connect()

	return (
		<ThemeProvider theme={darkTheme}>
			<FireBaseProvider>
				<GlobalStyles />
				<LoaderProvider>
					<Routes>
						<Route path='/' element={<Navigate to={'/signup'} />} />
						<Route path='/signup' element={<Landing type={LandingTypes.SIGNUP} />} />
						<Route path='/signin' element={<Landing type={LandingTypes.SIGNIN} />} />
						<Route path='/chat' element={<Chat />} />
						<Route path='/test' element={<Test />} />
					</Routes>
				</LoaderProvider>
			</FireBaseProvider>
		</ThemeProvider>
		// <>
		// 	<GlobalStyles />
		// 	<Landing />
		// </>
	)
}

export default App
