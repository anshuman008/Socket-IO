import { useEffect, useMemo, useState } from "react";
import {io} from "socket.io-client";
import {Box, Button, Container, TextField, Typography} from '@mui/material';
import './App.css'; // Import your custom CSS

const App = () => {

const socket =useMemo(()=> io("https://socket-io-3.onrender.com/", {
  cors: {
    origin: "https://socket-io-3.onrender.com/"
  },
}),[]);

const [allmessages,setallmessages] = useState([]);
const [message,setMessage] = useState("");
const [socketId,setsocketId] = useState("");
const [room,setRoom] = useState("");
const [roomName,setRoomName] = useState("");


const handleSumit = (e) =>{
  e.preventDefault(); 
  socket.emit("message",{message,room});
  setMessage("");
}

const joinRoomHandler =(e) =>{
  e.preventDefault(); 
  socket.emit('join-room',roomName);
  setRoomName("");
}

console.log(allmessages);
useEffect(()=>{
    socket.on("connect",()=>{
      console.log('connect ho gya bro',socket.id);
      setsocketId(socket.id) 
    })

    socket.on('receive-message',(data)=>{
      console.log(data);
      setallmessages((allmessages) => [...allmessages,data]);
    })

    socket.on("welcome",(s)=>{
      console.log(s)
    })
},[])

  return (
    <Container className="chat-container">
            <Box className="socket-id-display">
                <Typography variant="h6">Your ID: {socketId}</Typography>
            </Box>

            <form onSubmit={joinRoomHandler} className="room-form">
                <TextField 
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    label="Room Name"
                    variant="outlined"
                    className="input-field"
                    autoComplete="false"
                />
                <Button type="submit" variant="contained" color="primary">Join Room</Button>
            </form>

            <form onSubmit={handleSumit} className="message-form">
                <TextField 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    label="Message"
                    variant="outlined"
                    className="input-field"
                    autoComplete="false"
                />
                <TextField 
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    label="User Id"
                    variant="outlined"
                    className="input-field"
                    autoComplete="false"
                />
                <Button type="submit" variant="contained" color="primary">Send</Button>
            </form>

            <Box className="message-display">
                {allmessages.map((m, index) => (
                    <Typography key={index} marginTop={2} className="message">{m}</Typography>
                ))}
            </Box>
        </Container>
  )
}

export default App