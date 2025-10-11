const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const qrcode = require('qrcode');
const { GameManager } = require('./game');

const gameManager = new GameManager();
let qrCodeData = null;
let qrUpdateCallback = null;

setInterval(() => {
  gameManager.regenerateEnergy();
}, 30000);

function setQRUpdateCallback(callback) {
  qrUpdateCallback = callback;
}

function updateQRCode(qr) {
  qrCodeData = qr;
  if (qrUpdateCallback) {
    qrCodeData = qr;
    qrcode.toDataURL(qr, (err, url) => {
      if (!err && qrUpdateCallback) {
        qrUpdateCallback(url);
      }
    });
  }
}

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('QR Code généré!');
      updateQRCode(qr);
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true;

      console.log('Connexion fermée, reconnexion...', shouldReconnect);

      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('✅ Bot WhatsApp connecté!');
      qrCodeData = null;
      if (qrUpdateCallback) {
        qrUpdateCallback(null);
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message) continue;
      if (msg.key.fromMe) continue;

      const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      const chatId = msg.key.remoteJid;
      const isGroup = chatId.endsWith('@g.us');
      const playerId = isGroup ? msg.key.participant : chatId;

      const respawnCheck = gameManager.checkRespawn(playerId);
      if (!respawnCheck.canRespawn) {
        if (text.startsWith('/')) {
          await sock.sendMessage(chatId, { text: respawnCheck.message });
        }
        
        try {
          await sock.sendMessage(chatId, { delete: msg.key });
        } catch (err) {
          console.log('Erreur suppression message:', err);
        }
        continue;
      }

      if (text === '/statut') {
        const status = gameManager.getStatus(playerId);
        await sock.sendMessage(chatId, { text: status });
      }
      else if (text === '/boutique') {
        const shop = gameManager.getShopMessage();
        await sock.sendMessage(chatId, { text: shop });
      }
      else if (text.startsWith('/acheter ')) {
        const weaponId = text.split(' ')[1];
        const result = gameManager.buyWeapon(playerId, weaponId);
        await sock.sendMessage(chatId, { text: result.message });
      }
      else if (text.startsWith('/equiper ')) {
        const weaponId = text.split(' ')[1];
        const result = gameManager.equipWeapon(playerId, weaponId);
        await sock.sendMessage(chatId, { text: result.message });
      }
      else if (text === '/localisation' || text === '/bouger') {
        const result = gameManager.move(playerId);
        await sock.sendMessage(chatId, { text: result.message });
      }
      else if (text.startsWith('/tire')) {
        const quotedMsg = msg.message.extendedTextMessage?.contextInfo?.participant;
        
        if (!quotedMsg) {
          await sock.sendMessage(chatId, { 
            text: '❌ Répondez au message de votre cible avec /tire [partie]\nParties: tete, torse, bras, jambes, pieds\nExemple: /tire tete' 
          });
          continue;
        }

        const parts = text.split(' ');
        const bodyPart = parts[1] || 'torse';
        
        const result = gameManager.shoot(playerId, quotedMsg, bodyPart);
        await sock.sendMessage(chatId, { text: result.message });

        if (result.killed) {
          gameManager.deadPlayers.set(quotedMsg, Date.now());
          
          setTimeout(async () => {
            const respawn = gameManager.checkRespawn(quotedMsg);
            if (respawn.canRespawn) {
              const targetChatId = isGroup ? chatId : quotedMsg;
              await sock.sendMessage(targetChatId, { text: respawn.message });
            }
          }, 60 * 60 * 1000);
        }
      }
      else if (text === '/aide' || text === '/help') {
        const help = `🎮 ═══ COMMANDES DU JEU ═══\n\n` +
          `📊 /statut - Voir votre statut\n` +
          `🔫 /tire [partie] - Tirer sur un ennemi (répondre à son message)\n` +
          `     Parties: tete, torse, bras, jambes, pieds\n` +
          `📍 /localisation - Se déplacer\n` +
          `🛒 /boutique - Voir les armes disponibles\n` +
          `💰 /acheter [id] - Acheter une arme\n` +
          `🔄 /equiper [id] - Équiper une arme\n` +
          `❓ /aide - Afficher cette aide\n\n` +
          `💡 Astuce: Déplacez-vous pour trouver des couvertures!`;
        
        await sock.sendMessage(chatId, { text: help });
      }
    }
  });

  return sock;
}

module.exports = { connectToWhatsApp, setQRUpdateCallback };
