# Bot WhatsApp de Combat - Jeu de Tir

## Description
Bot de jeu WhatsApp développé avec Baileys en Node.js. Les joueurs s'affrontent dans un système de combat avec des armes variées, un système de localisation et une économie de jeu. Interface web style Call of Duty avec thème militaire/tactique.

## Fonctionnalités
- 🔫 Système de combat avec zones de visée (tête, torse, bras, jambes, pieds)
- 🎯 Catalogue d'armes complet (54 armes: pistolets, fusils d'assaut, snipers, shotguns, mitrailleuses, SMG)
- 📍 Système de localisation avec déplacement et couvertures
- 💰 Économie de jeu avec achat d'armes
- ⚡ Système d'énergie et de vie avec barres ▰▱
- 💀 Système de mort avec suppression de messages pendant 1 heure
- 🌐 Interface web style Call of Duty pour scanner le QR code WhatsApp
- 🎮 Compatible groupes WhatsApp avec statistiques individuelles par joueur

## Commandes du Bot
- `/statut` - Afficher le statut du joueur (vie, énergie, arme, position)
- `/tire [partie]` - Tirer sur un ennemi (répondre au message de la cible)
  - Parties: tete, torse, bras, jambes, pieds
- `/localisation` - Se déplacer vers une nouvelle position
- `/boutique` - Afficher les armes disponibles
- `/acheter [id]` - Acheter une arme
- `/equiper [id]` - Équiper une arme de l'inventaire
- `/aide` - Afficher l'aide des commandes

## Structure du Projet
```
.
├── server.js          # Serveur web Express + Socket.io
├── bot.js             # Bot WhatsApp avec Baileys
├── game.js            # Logique du jeu (armes, combat, joueurs)
├── public/
│   └── index.html     # Interface web pour QR code
├── package.json       # Dépendances Node.js
└── auth_info_baileys/ # Session WhatsApp (généré automatiquement)
```

## Technologies
- **Backend**: Node.js 20
- **WhatsApp API**: @whiskeysockets/baileys
- **Serveur Web**: Express.js
- **WebSocket**: Socket.io
- **QR Code**: qrcode
- **Logging**: pino

## Démarrage
1. Scanner le QR code sur l'interface web (port 5000)
2. Le bot se connecte automatiquement à WhatsApp
3. Envoyer `/aide` dans WhatsApp pour voir les commandes

## Système de Jeu

### Armes
- **Pistolets**: 10 modèles (Glock 17, Desert Eagle, etc.) - 11-25 dégâts
- **Fusils d'Assaut**: 10 modèles (AK-47, M4A1, SCAR, etc.) - 27-32 dégâts
- **Snipers**: 10 modèles (AWP, Barrett M82, etc.) - 60-85 dégâts
- **Shotguns**: 8 modèles (Mossberg 500, SPAS-12, etc.) - 44-55 dégâts
- **Mitrailleuses**: 8 modèles (M249 SAW, MG42, etc.) - 35-41 dégâts
- **SMG**: 8 modèles (MP5, P90, Vector, etc.) - 18-25 dégâts

### Zones de Visée
- Tête: x3.0 dégâts
- Torse: x1.5 dégâts
- Bras: x0.8 dégâts
- Jambes: x0.8 dégâts
- Pieds: x0.5 dégâts

### Système de Mort
- Quand un joueur meurt, ses messages sont supprimés pendant 1 heure
- Après 1 heure, le joueur réapparaît avec statistiques réinitialisées
- Le tueur gagne 500$ par élimination

### Localisation
8 zones différentes avec niveaux de danger variés:
- Entrepôt abandonné
- Rue principale
- Immeuble en ruines
- Parc urbain
- Station-service
- Parking souterrain
- Centre commercial
- Pont autoroutier

## Configuration
- Port: 5000 (interface web)
- Régénération d'énergie: +5% toutes les 30 secondes
- Coût déplacement: -20% énergie
- Coût tir: -10% énergie
- Argent de départ: 1000$
- Arme de départ: Glock 17

## Notes Techniques
- Les données de jeu sont stockées en mémoire (Map)
- La session WhatsApp est persistée dans `auth_info_baileys/`
- Le QR code est mis à jour en temps réel via Socket.io
- Reconnexion automatique en cas de déconnexion
