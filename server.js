const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const path = require('path');

// Servir arquivos est�ticos
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gerenciar conex�es
let connectedUsers = new Set();

io.on('connection', (socket) => {
    // Registrar nova conex�o
    connectedUsers.add(socket.id);
    console.log(`Novo usu�rio conectado: ${socket.id}`);
    console.log(`Total de usu�rios: ${connectedUsers.size}`);

    // Gerenciar desconex�o
    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
        console.log(`Usu�rio desconectado: ${socket.id}`);
        console.log(`Total de usu�rios: ${connectedUsers.size}`);
    });

    // Gerenciar sinais WebRTC
    socket.on('signal', (data) => {
        console.log(`Sinal recebido de ${socket.id}:`, data.type);
        socket.broadcast.emit('signal', data);
    });
});

// Configurar porta para ambiente de produ��o ou desenvolvimento
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});