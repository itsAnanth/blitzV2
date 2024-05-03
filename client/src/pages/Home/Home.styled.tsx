import styled from "styled-components";

export const HomeContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    background-color: ${({ theme }) => theme.secondary};

`


export const HomeNavbar = styled.div`
    min-height: 130px;
    max-height: 130px;
    width: 100%;
    background-color: ${({ theme }) => theme.primary};

`

export const Hero = styled.div`
    width: 100%;
    height: calc(100vh - 130px);
    background-color: ${({ theme }) => theme.secondary};
    display: flex;
    position: relative;
    justify-content: flex-end;
    align-items: center;
`

export const HeroLeft = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
`

export const HeroMain = styled.div`
    height: 100%;
    width: 60%;
`


export const HeroRight = styled.div`
    width: 20%;
    height: 100%;

`

export const HeroImage = styled.img`
    object-fit: cover;
    max-width: 100%;
    width: 100px;

    /* height: 100%; */

`