import styled from "styled-components";

export const ProfileContainer = styled.div`
    width: 100vw;
    max-width: 100%;
    min-height: 100vh;
    display: flex;
    background-color: ${({ theme }) => theme.bg};
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow-x: hidden !important;
    height: auto;
    

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

export const ProfileContentImageContainer = styled.div`
    display: flex;
    padding: 3rem 0;

    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
`

export const ProfileContentImage = styled.img`
    object-fit: cover;
    border-radius: 50%;
    width: 150px;
    height: 150px;
    max-width: 150px;
    /* height: 30%; */

`

export const ProfileContentImageOverlay = styled.div`
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);

    z-index: 99;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    transition: all 0.3s ease;
    &:hover {
        opacity: 0.9;
        cursor: pointer;
    }

    & > * {
        font-size: 2rem;
        opacity: 1;
        color: ${({ theme }) => theme.text};
    }


`

export const ProfileContentFieldContainer = styled.div`
    
    background-color: ${({ theme }) => theme.bg};
    width: 80%;
    height: auto;
    /* margin-bottom: 1rem; */
    border-radius: 15px;

`

export const ProfileContentField = styled.div`
    position: relative;

    padding: 1rem 1rem 1.5rem;
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.text};
    border: 1px solid transparent;

    &:hover {
        background-color: ${({ theme }) => theme.secondary};
        border-radius: 10px;
        border: 1px solid ${({ theme }) => theme.primary};
    }
`

export const FieldHeading = styled.div`
    color: ${({ theme }) => theme.lightText};
    padding-bottom: 1rem;
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
    left: 30px;
`

export const FieldEditBtn = styled.div`
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translate(0, -50%);

`