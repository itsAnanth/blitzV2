import styled from "styled-components";

export const ProfileContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    background-color: ${({ theme }) => theme.bg};
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

`

export const ProfileHeader = styled.div`
    position: relative;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.lightText};
    font-size: 2rem;
`

export const ProfileContent = styled.div`
    width: 80%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    background-color: ${({ theme }) => theme.tertiary};
    min-height: calc(100vh - 100px);
`

export const ProfileContentImage = styled.img`
    margin: 3rem 0;
    object-fit: cover;
    border-radius: 50%;
    width: 20%;
    max-width: 100px;
    /* height: 30%; */

`

export const ProfileContentFieldContainer = styled.div`
    
    background-color: ${({ theme }) => theme.bg};
    width: 80%;
    margin-bottom: 1rem;
    border-radius: 15px;

`

export const ProfileContentField = styled.div`
    margin: 1rem 1rem 1.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.text};
`

export const FieldHeading = styled.div`
    color: ${({ theme }) => theme.lightText};
    margin-bottom: 1rem;
    font-size: 1.3rem;
`

export const FieldContent = styled.div`
    
`

export const NoUserFound = styled.div`
    color: ${({ theme }) => theme.text};
    font-size: 1.5rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

`

export const BackspaceIcon = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 30px
`