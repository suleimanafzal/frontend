import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import sendIcon from './icons/send.svg';
import userIcon from './icons/user.svg';
import botIcon from './icons/robot.svg';

function ChatBot() {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null); // for auto scroll

    const cleanText = (rawText) => {
        const uniqueWordsText = rawText.replace(/(\b\w+\b)(?=.*\b\1\b)/gi, '');
        const singleSpaceText = uniqueWordsText.replace(/\s{2,}/g, ' ');
        const singleDashText = singleSpaceText.replace(/- -/g, '-');
        const noAsterisksText = singleDashText.replace(/\*+/g, '');
        const noExtraSpacesText = noAsterisksText.replace(/[^\S\r\n]{2,}/g, '');
        const singleNewlineText = noExtraSpacesText.replace(/\n{2,}/g, '\n\n');
        const formattedPoints = singleNewlineText.replace(/(\d\.)\s*/g, '\n$1 ').replace(/(\*|-) /g, '\n$1 ').trim();
        const paragraphs = formattedPoints.replace(/(?<!\n)\n(?!\n)/g, '\n\n');
        return paragraphs.trim();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!prompt.trim()) return;

        console.log("User prompt:", prompt);

        const userMessage = { sender: 'user', text: prompt };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        setIsLoading(true);
        setPrompt('');

        try {
            // Make sure the payload key matches what your server expects
            const response = await axios.post('http://localhost:5000/api/ask', { query: prompt });

            // Logging the raw response from the server
            console.log("Raw response from server:", response.data);

            const rawText = response.data.response;
            const cleanResponse = cleanText(rawText);

            // Logging the cleaned response
            console.log("Cleaned response:", cleanResponse);

            const botMessage = { sender: 'bot', text: cleanResponse };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            // Detailed error logging
            if (error.response) {
                console.error("Error response from server:", error.response.data);
            } else if (error.request) {
                console.error("No response received from server:", error.request);
            } else {
                console.error("Error setting up request:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Styling
    const containerStyle = {
        maxWidth: '1200px',
        margin: '20px auto',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, #2980b9, #6dd5fa, #ffffff)', // Gradient background
    };

    const headerStyle = {
        padding: '15px',
        background: 'linear-gradient(to right, #007bff, #00c6ff)', // Gradient header
        color: 'white',
        textAlign: 'center',
        fontSize: '1.5em',
        fontWeight: 'bold'
    };

    const messagesStyle = {
        flexGrow: 1,
        overflowY: 'auto',
        padding: '15px',
        backgroundColor: '#f4f4f9'
    };

    const footerStyle = {
        padding: '10px',
        background: '#fff',
        borderTop: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center'
    };

    const formStyle = {
        width: '100%',
        display: 'flex'
    };

    const inputStyle = {
        flexGrow: 1,
        padding: '10px',
        borderRadius: '10px',
        border: '1px solid #ccc'
    };

    const buttonStyle = {
        background: 'linear-gradient(to right, #007bff, #00c6ff)', // Gradient button
        border: 'none',
        cursor: 'pointer',
        paddingLeft: '10px',
        borderRadius: '10px'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>ChatBot</div>
            <div style={messagesStyle} id="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', margin: '10px 0' }}>
                        <img src={msg.sender === 'user' ? userIcon : botIcon} alt="icon" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                        <div style={{
                            background: msg.sender === 'user' ? 'linear-gradient(to right, #007bff, #00c6ff)' : '#e6e6e6',
                            color: msg.sender === 'user' ? 'white' : 'black',
                            padding: '10px',
                            borderRadius: '10px'
                        }}>
                            {msg.text.split('\n').map((line, i) => (
                                <p key={i} style={{ margin: 0 }}>{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="loading-spinner" />}
                <div ref={messagesEndRef} />
            </div>
            <div style={footerStyle}>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <input
                        type="text"
                        style={inputStyle}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <button type="submit" style={buttonStyle} disabled={isLoading}>
                        <img src={sendIcon} alt="Send" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatBot;
