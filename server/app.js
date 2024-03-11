import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";


const port = 3000;
const app = express();

app.use(cors()); // CORS middleware should be used before defining routes


const server = createServer(app);


const io = new Server(server, {
    cors: {
        origin: "*", // The frontend origin
        methods: ["GET", "POST"],
        credentials: true // Corrected the case
    }
});

io.on("connection", (socket) => {
    console.log("User Connected, Id:", socket.id);
    // socket.emit("welcome",`welcome to the server ${socket.id}`)
    socket.broadcast.emit("welcome",`welcome to the server ${socket.id}`);

    socket.on("message",({message,room})=>{
    // console.log(data);
    socket.to(room).emit("receive-message",message);
    })

    socket.on('join-room',(room)=>{
        socket.join(room);
    })
});

app.get("/", (req, res) => {
    res.send('Hello World');
});

server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
