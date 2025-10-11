const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const qrcode = require('qrcode');
const { GameManager } = require('./game');
const cron = require('node-cron');

const gameManager = new GameManager();
let qrCodeData = null;
let qrUpdateCallback = null;

// Compteur de temps de jeu: 1min jeu = 3sec réel
setInterval(() => {
  gameManager.updateGameTime();
}, 3000);

// Régénération énergie
setInterval(() => {
  gameManager.players.forEach(player => {
    if (player.energie < 100) {
      player.energie = Math.min(100, player.energie + 2);
    }
  });
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

let sock = null;
let isConnecting = false;

async function connectToWhatsApp() {
  if (isConnecting) {
    console.log('⏳ Connexion déjà en cours...');
    return sock;
  }

  isConnecting = true;

  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      defaultQueryTimeoutMs: undefined,
      syncFullHistory: false,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('📱 QR Code généré!');
        updateQRCode(qr);
      }

      if (connection === 'close') {
        isConnecting = false;
        
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log('❌ Connexion fermée:', statusCode, '- Reconnexion:', shouldReconnect);

        if (shouldReconnect) {
          setTimeout(() => {
            console.log('🔄 Tentative de reconnexion...');
            connectToWhatsApp();
          }, 3000);
        }
      } else if (connection === 'open') {
        isConnecting = false;
        console.log('✅ Bot WhatsApp connecté!');
        qrCodeData = null;
        if (qrUpdateCallback) {
          qrUpdateCallback(null);
        }
      } else if (connection === 'connecting') {
        console.log('🔄 Connexion en cours...');
      }
    });
  } catch (error) {
    isConnecting = false;
    console.error('❌ Erreur de connexion:', error);
    setTimeout(() => {
      console.log('🔄 Nouvelle tentative de connexion...');
      connectToWhatsApp();
    }, 5000);
  }

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
      else if (text === '/classement') {
        const classement = await gameManager.getClassement();
        await sock.sendMessage(chatId, { text: classement });
      }
      else if (text === '/garage') {
        const garage = gameManager.getGarageMenu();
        await sock.sendMessage(chatId, { text: garage });
      }
      else if (text.startsWith('/achetervehicule ')) {
        const vehiculeId = text.split(' ')[1];
        const result = await gameManager.acheterVehicule(playerId, vehiculeId);
        await sock.sendMessage(chatId, { text: result.message });
        if (result.image) {
          await sock.sendMessage(chatId, { 
            image: { url: result.image },
            caption: `🚗 Votre nouveau véhicule!`
          });
        }
      }
      else if (text.startsWith('/monter ')) {
        const vehiculeId = text.split(' ')[1];
        const result = gameManager.monterVehicule(playerId, vehiculeId);
        await sock.sendMessage(chatId, { text: result.message });
      }
      else if (text === '/demarrer') {
        const result = gameManager.demarrerMoteur(playerId);
        await sock.sendMessage(chatId, { text: result.message });
      }
      else if (text === '/voyage') {
        const voyages = gameManager.getVoyageMenu();
        await sock.sendMessage(chatId, { text: voyages });
      }
      else if (text.startsWith('/voyage ')) {
        const paysId = text.split(' ')[1];
        const result = await gameManager.acheterBillet(playerId, paysId);
        await sock.sendMessage(chatId, { text: result.message });
      }
      else if (text === '/missions') {
        const missions = gameManager.getMissionsMenu('main');
        await sock.sendMessage(chatId, { text: missions });
      }
      else if (text === '/secondaires') {
        const missions = gameManager.getMissionsMenu('side');
        await sock.sendMessage(chatId, { text: missions });
      }
      else if (text === '/pnj' || text === '/interagir') {
        const result = await gameManager.interagirPNJ(playerId);
        await sock.sendMessage(chatId, { text: result.message });
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
        const result = await gameManager.move(playerId);
        await sock.sendMessage(chatId, { text: result.message });
        if (result.image) {
          await sock.sendMessage(chatId, { 
            image: { url: result.image },
            caption: '📍 Votre nouvelle localisation'
          });
        }
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
        
        const result = await gameManager.shoot(playerId, quotedMsg, bodyPart);
        await sock.sendMessage(chatId, { text: result.message });
        
        if (result.image) {
          await sock.sendMessage(chatId, { 
            image: { url: result.image },
            caption: '💥 Action!'
          });
        }

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
      else if (text.startsWith('/action ')) {
        const action = text.substring(8);
        const player = gameManager.getPlayer(playerId);
        
        const contexte = `Le joueur dans ${player.ville}, ${pays[player.pays].nom} fait l'action suivante: "${action}". Décris ce qui se passe en 2-3 phrases immersives, style GTA.`;
        const description = await gameManager.genererTexteIA(contexte);
        
        const imagePrompt = `${action} in ${player.ville} city, GTA style, cinematic, action scene`;
        const imageUrl = await gameManager.genererImageIA(imagePrompt);
        
        await sock.sendMessage(chatId, { text: `🎬 ${description}` });
        if (imageUrl) {
          await sock.sendMessage(chatId, { 
            image: { url: imageUrl },
            caption: '🎮 Votre action'
          });
        }
      }
      else if (text === '/aide' || text === '/help') {
        const help = `🎮 ═══ GTA WHATSAPP ═══\n\n` +
          `📊 PROFIL\n` +
          `/statut - Votre profil complet\n` +
          `/classement - Top joueurs\n\n` +
          `🚗 VÉHICULES\n` +
          `/garage - Liste des véhicules\n` +
          `/achetervehicule [id] - Acheter\n` +
          `/monter [id] - Monter dedans\n` +
          `/demarrer - Démarrer moteur\n\n` +
          `✈️ VOYAGE\n` +
          `/voyage - Liste destinations\n` +
          `/voyage [pays] - Acheter billet\n\n` +
          `📋 MISSIONS\n` +
          `/missions - Principales (200)\n` +
          `/secondaires - Secondaires (450)\n` +
          `/mission [id] - Lancer mission\n\n` +
          `🎭 MONDE\n` +
          `/pnj - Interagir avec PNJ\n` +
          `/attaquer - Attaquer PNJ\n` +
          `/parler - Parler au PNJ\n` +
          `/fuir - S'enfuir\n` +
          `/action [texte] - Action libre IA\n\n` +
          `🔫 COMBAT\n` +
          `/tire [partie] - Tirer\n` +
          `/boutique - Armes\n` +
          `/acheter [id] - Acheter arme\n\n` +
          `⏰ 1 jour = 3h réelles`;
        
        await sock.sendMessage(chatId, { text: help });
      }
    }
  });

  return sock;
}

module.exports = { connectToWhatsApp, setQRUpdateCallback };
