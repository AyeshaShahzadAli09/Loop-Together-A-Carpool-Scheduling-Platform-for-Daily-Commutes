import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import RideRequestList from './RideRequestList';

const Container = styled.div`
  height: calc(100vh - 4rem);
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
`;

const ChatWindow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const Message = styled(motion.div)`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 15px;
  background: ${props => props.sent ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
  color: #fff;
  position: relative;
  word-break: break-word;
  
  border-bottom-right-radius: ${props => props.sent ? '5px' : '15px'};
  border-bottom-left-radius: ${props => !props.sent ? '5px' : '15px'};
`;

const InputArea = styled.form`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const Input = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 0, 255, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled(motion.button)`
  background: rgba(255, 0, 255, 0.3);
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
  margin-bottom: 0.5rem;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.sent ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #fff;
  font-size: 0.8rem;
  order: ${props => props.sent ? '2' : '1'};
`;

const Messages = ({ isDriverMode }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const messageListRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages();
    }
  }, [selectedChat?._id]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/${selectedChat._id}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      if (data.success) {
        setSelectedChat(prev => ({
          ...prev,
          messages: data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat/${selectedChat._id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      if (data.success) {
        setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, data.data]
        }));
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Container>
      {!selectedChat ? (
        <RideRequestList 
          onSelectRide={setSelectedChat} 
          isDriverMode={isDriverMode} 
        />
      ) : (
        <ChatWindow>
          <MessageList ref={messageListRef}>
            <AnimatePresence>
              {selectedChat.messages ? (
                selectedChat.messages.map(msg => {
                  const isSentByUser = msg.sender === user._id;
                  const senderName = isSentByUser 
                    ? user.name 
                    : selectedChat.participants.find(p => p._id !== user._id)?.name || 'User';
                  
                  return (
                    <MessageContainer key={msg._id} sent={isSentByUser}>
                      <Avatar sent={isSentByUser}>
                        {getInitials(senderName)}
                      </Avatar>
                      <Message
                        sent={isSentByUser}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {msg.content}
                      </Message>
                    </MessageContainer>
                  );
                })
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  color: 'rgba(255, 255, 255, 0.5)',
                  padding: '1rem' 
                }}>
                  Loading messages...
                </div>
              )}
            </AnimatePresence>
          </MessageList>
          <InputArea onSubmit={sendMessage}>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <SendButton
              type="submit"
              disabled={!message.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPaperPlane />
            </SendButton>
          </InputArea>
        </ChatWindow>
      )}
    </Container>
  );
};

export default Messages; 