import { Fade } from "@mui/material";
import { useContext, useEffect } from "react";
import { LoaderContext } from "../../contexts/loader.context";
import { Hero, HeroImage, HeroLeft, HeroMain, HeroRight, HomeContainer, HomeNavbar } from "./Home.styled";
import logo from '../../assets/logo.png';
import logo1 from '../../assets/logo1.svg';
import logo2 from '../../assets/logo2.svg';


export default function Home() {
    const loaderContext = useContext(LoaderContext);

    useEffect(() => {
        loaderContext.setLoader(false)
    }, [])
    return (
        <HomeContainer>
            <HomeNavbar></HomeNavbar>
            <Hero>
                <HeroLeft>
                    <HeroImage
                        src={logo1}
                    />
                </HeroLeft>
                <HeroMain>
                    hello
                </HeroMain>
                <HeroRight>
                    <HeroImage
                        src={logo2}
                    />

                </HeroRight>
            </Hero>
        </HomeContainer>
    )
}