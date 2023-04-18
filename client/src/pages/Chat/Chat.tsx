import { ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatMain, ChatMainContent, ChatMainForm, ChatMainFormSend, ChatSidebar } from "./Chat.styled";
import { ChatMessage } from "../../components";
import { AiOutlineSend } from 'react-icons/ai';

function Chat() {
    return (
        <ChatDiv>
            <ChatContainer>
                <ChatHeader />
                <ChatContent>
                    <ChatSidebar></ChatSidebar>
                    <ChatMain>
                        <ChatMainContent>
                            <ChatMessage author='author' timestamp={new Date(Date.now()).toLocaleDateString()} content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." />
                            <ChatMessage author='author' timestamp={new Date(Date.now()).toLocaleDateString()} content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." />
                            <ChatMessage author='author' timestamp={new Date(Date.now()).toLocaleDateString()} content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." />
                            <ChatMessage author='author' timestamp={new Date(Date.now()).toLocaleDateString()} content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." />
                            <ChatMessage author='author' timestamp={new Date(Date.now()).toLocaleDateString()} content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." />

                        </ChatMainContent>
                        <ChatMainForm>
                            <form>
                                <textarea
                                    placeholder="Message"
                                    name="message"
                                    autoComplete="off"
                                />
                                <ChatMainFormSend><AiOutlineSend /></ChatMainFormSend>
                            </form>
                        </ChatMainForm>
                    </ChatMain>
                </ChatContent>
            </ChatContainer>
        </ChatDiv>
    )
}

export default Chat;