import React, { useEffect, useRef, useState } from 'react';

import './App.css';
import socket from './socketClient';

function App() {
  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    socket.emit("join_conversation" , 1)

    socket.on("recieve_message" , (messageData) => {
      setMessages((prev) => [...prev , messageData])
    })
    
    return () => {
      socket.off("recieve_message")
    }
  },[])
  
 return (
  <div>
      
  </div>
);
}

export default App;