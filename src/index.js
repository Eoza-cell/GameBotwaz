const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { connectToWhatsApp, setQRUpdateCallback } = require('./bot');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Client connecté au serveur web');
  
  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

setQRUpdateCallback((qrDataUrl) => {
  io.emit('qr-update', qrDataUrl);
});

connectToWhatsApp().catch(err => {
  console.error('Erreur de connexion WhatsApp:', err);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Serveur web démarré sur http://0.0.0.0:${PORT}`);
  console.log(`📱 Scannez le QR code pour connecter le bot WhatsApp`);
});
