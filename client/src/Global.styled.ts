import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`

:root {
	--primary: ${({ theme }) => theme.primary};
	--secondary: white;

	overflow: auto;
	/* scrollbar-gutter: stable; */

}
* {
	font-family: 'Montserrat', sans-serif;
	margin: 0;
	box-sizing: border-box;
}

a {
	text-decoration: none;
}
/* scrollBar */
::-webkit-scrollbar {
	width: 8px;

}
::-webkit-scrollbar-track {
	padding-right: 1rem;
	margin-right: 1rem;
	background: ${({ theme }) => theme.secondary};
}
::-webkit-scrollbar-thumb {
	border-radius: 10px;
	transition: 0.3s;
	background: ${({ theme }) => theme.primary};
}
img {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
@media screen and (max-width: 400px) {
	body {
		overflow-x: hidden;
	}
}
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-device-pixel-ratio: 2) and (device-aspect-ratio: 2/3) {
	body {
		overflow-x: hidden;
	}
}

`;