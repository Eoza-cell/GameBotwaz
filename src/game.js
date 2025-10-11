const weapons = {
  pistolets: [
    { id: 'glock17', nom: 'Glock 17', degats: 15, prix: 500, portee: 50 },
    { id: 'deserteagle', nom: 'Desert Eagle', degats: 25, prix: 1200, portee: 60 },
    { id: 'beretta92', nom: 'Beretta 92', degats: 14, prix: 450, portee: 45 },
    { id: 'm1911', nom: 'M1911', degats: 18, prix: 600, portee: 50 },
    { id: 'sig_p226', nom: 'SIG P226', degats: 16, prix: 700, portee: 52 },
    { id: 'cz75', nom: 'CZ-75', degats: 15, prix: 500, portee: 48 },
    { id: 'fn57', nom: 'FN Five-Seven', degats: 20, prix: 900, portee: 55 },
    { id: 'makarov', nom: 'Makarov PM', degats: 12, prix: 350, portee: 40 },
    { id: 'tokarev', nom: 'Tokarev TT-33', degats: 13, prix: 400, portee: 42 },
    { id: 'walther_ppk', nom: 'Walther PPK', degats: 11, prix: 380, portee: 38 }
  ],
  fusils_assaut: [
    { id: 'ak47', nom: 'AK-47', degats: 30, prix: 2000, portee: 300 },
    { id: 'm4a1', nom: 'M4A1', degats: 28, prix: 2200, portee: 350 },
    { id: 'famas', nom: 'FAMAS', degats: 27, prix: 1800, portee: 280 },
    { id: 'aug', nom: 'Steyr AUG', degats: 29, prix: 2100, portee: 320 },
    { id: 'scar', nom: 'FN SCAR', degats: 32, prix: 2500, portee: 360 },
    { id: 'g36', nom: 'Heckler & Koch G36', degats: 28, prix: 2000, portee: 300 },
    { id: 'tavor', nom: 'IWI Tavor', degats: 29, prix: 2300, portee: 310 },
    { id: 'galil', nom: 'IMI Galil', degats: 30, prix: 1900, portee: 290 },
    { id: 'type56', nom: 'Type 56', degats: 29, prix: 1700, portee: 285 },
    { id: 'ak74', nom: 'AK-74', degats: 27, prix: 1850, portee: 295 }
  ],
  snipers: [
    { id: 'awp', nom: 'AWP', degats: 70, prix: 5000, portee: 800 },
    { id: 'barrett', nom: 'Barrett M82', degats: 85, prix: 7000, portee: 1200 },
    { id: 'dragunov', nom: 'Dragunov SVD', degats: 65, prix: 4500, portee: 750 },
    { id: 'm24', nom: 'M24', degats: 68, prix: 4800, portee: 820 },
    { id: 'ssg08', nom: 'SSG 08', degats: 60, prix: 4000, portee: 700 },
    { id: 'intervention', nom: 'CheyTac Intervention', degats: 80, prix: 6500, portee: 1100 },
    { id: 'kar98k', nom: 'Kar98k', degats: 62, prix: 3800, portee: 680 },
    { id: 'mosin', nom: 'Mosin-Nagant', degats: 64, prix: 3500, portee: 720 },
    { id: 'l96', nom: 'L96A1', degats: 72, prix: 5200, portee: 850 },
    { id: 'dsr50', nom: 'DSR-50', degats: 78, prix: 6000, portee: 950 }
  ],
  shotguns: [
    { id: 'mossberg', nom: 'Mossberg 500', degats: 45, prix: 1500, portee: 30 },
    { id: 'remington870', nom: 'Remington 870', degats: 48, prix: 1600, portee: 32 },
    { id: 'spas12', nom: 'SPAS-12', degats: 52, prix: 2000, portee: 35 },
    { id: 'aa12', nom: 'AA-12', degats: 50, prix: 2500, portee: 33 },
    { id: 'benelli_m4', nom: 'Benelli M4', degats: 49, prix: 1900, portee: 34 },
    { id: 'saiga12', nom: 'Saiga-12', degats: 47, prix: 1700, portee: 31 },
    { id: 'ks23', nom: 'KS-23', degats: 55, prix: 2200, portee: 28 },
    { id: 'winchester1897', nom: 'Winchester 1897', degats: 44, prix: 1400, portee: 29 }
  ],
  mitrailleuses: [
    { id: 'm249', nom: 'M249 SAW', degats: 35, prix: 3500, portee: 400 },
    { id: 'pkm', nom: 'PKM', degats: 38, prix: 3800, portee: 450 },
    { id: 'mg42', nom: 'MG42', degats: 40, prix: 4200, portee: 480 },
    { id: 'rpd', nom: 'RPD', degats: 36, prix: 3400, portee: 420 },
    { id: 'm60', nom: 'M60', degats: 39, prix: 4000, portee: 460 },
    { id: 'negev', nom: 'IWI Negev', degats: 37, prix: 3600, portee: 430 },
    { id: 'type88', nom: 'Type 88', degats: 35, prix: 3300, portee: 410 },
    { id: 'mg3', nom: 'MG3', degats: 41, prix: 4400, portee: 500 }
  ],
  smg: [
    { id: 'mp5', nom: 'MP5', degats: 20, prix: 1200, portee: 100 },
    { id: 'uzi', nom: 'Uzi', degats: 18, prix: 1000, portee: 90 },
    { id: 'p90', nom: 'P90', degats: 22, prix: 1400, portee: 110 },
    { id: 'ump45', nom: 'UMP-45', degats: 21, prix: 1300, portee: 105 },
    { id: 'vector', nom: 'Kriss Vector', degats: 24, prix: 1600, portee: 115 },
    { id: 'mp7', nom: 'MP7', degats: 23, prix: 1500, portee: 112 },
    { id: 'ppsh41', nom: 'PPSh-41', degats: 19, prix: 1100, portee: 95 },
    { id: 'thompson', nom: 'Thompson M1A1', degats: 25, prix: 1700, portee: 120 }
  ]
};

const bodyParts = {
  tete: { nom: 'Tête', multiplicateur: 3.0 },
  torse: { nom: 'Torse', multiplicateur: 1.5 },
  bras: { nom: 'Bras', multiplicateur: 0.8 },
  jambes: { nom: 'Jambes', multiplicateur: 0.8 },
  pieds: { nom: 'Pieds', multiplicateur: 0.5 }
};

const locations = [
  { 
    nom: 'Entrepôt abandonné', 
    couverture: ['Caisses en bois', 'Containers métalliques', 'Vieux camions'],
    danger: 'moyen',
    description: '🏚️ Vous êtes dans un entrepôt sombre avec de nombreuses couvertures.'
  },
  { 
    nom: 'Rue principale', 
    couverture: ['Voitures garées', 'Lampadaires'],
    danger: 'élevé',
    description: '🛣️ Zone ouverte avec peu de protection, soyez vigilant!'
  },
  { 
    nom: 'Immeuble en ruines', 
    couverture: ['Murs effondrés', 'Étages supérieurs', 'Escaliers'],
    danger: 'faible',
    description: '🏢 Bâtiment à plusieurs niveaux avec excellente protection.'
  },
  { 
    nom: 'Parc urbain', 
    couverture: ['Arbres', 'Bancs', 'Fontaine'],
    danger: 'moyen',
    description: '🌳 Zone semi-couverte avec végétation et obstacles.'
  },
  { 
    nom: 'Station-service', 
    couverture: ['Pompes à essence', 'Boutique', 'Voitures'],
    danger: 'très élevé',
    description: '⛽ Attention! Zone explosive avec pompes à essence.'
  },
  { 
    nom: 'Parking souterrain', 
    couverture: ['Piliers en béton', 'Véhicules', 'Zones sombres'],
    danger: 'faible',
    description: '🅿️ Sous-sol avec nombreux piliers pour se couvrir.'
  },
  { 
    nom: 'Centre commercial', 
    couverture: ['Vitrines', 'Escalators', 'Kiosques'],
    danger: 'moyen',
    description: '🏬 Grand espace avec multiples boutiques et cachettes.'
  },
  { 
    nom: 'Pont autoroutier', 
    couverture: ['Barrières', 'Voitures abandonnées'],
    danger: 'très élevé',
    description: '🌉 Zone hautement exposée avec vide sur les côtés.'
  }
];

class GameManager {
  constructor() {
    this.players = new Map();
    this.deadPlayers = new Map();
    this.messageTimestamps = new Map();
  }

  getPlayer(phoneNumber) {
    if (!this.players.has(phoneNumber)) {
      this.initPlayer(phoneNumber);
    }
    return this.players.get(phoneNumber);
  }

  initPlayer(phoneNumber) {
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    this.players.set(phoneNumber, {
      vie: 100,
      energie: 100,
      argent: 1000,
      armeEquipee: weapons.pistolets[0],
      inventaire: [weapons.pistolets[0]],
      position: randomLocation,
      kills: 0,
      deaths: 0
    });
  }

  getAllWeapons() {
    const allWeapons = [];
    Object.values(weapons).forEach(category => {
      allWeapons.push(...category);
    });
    return allWeapons;
  }

  getWeaponById(weaponId) {
    const allWeapons = this.getAllWeapons();
    return allWeapons.find(w => w.id === weaponId);
  }

  buyWeapon(phoneNumber, weaponId) {
    const player = this.getPlayer(phoneNumber);
    const weapon = this.getWeaponById(weaponId);
    
    if (!weapon) {
      return { success: false, message: '❌ Arme introuvable!' };
    }

    if (player.inventaire.some(w => w.id === weaponId)) {
      return { success: false, message: '❌ Vous possédez déjà cette arme!' };
    }

    if (player.argent < weapon.prix) {
      return { success: false, message: `❌ Fonds insuffisants! Prix: ${weapon.prix}$ (Vous avez: ${player.argent}$)` };
    }

    player.argent -= weapon.prix;
    player.inventaire.push(weapon);
    
    return { 
      success: true, 
      message: `✅ ${weapon.nom} acheté avec succès!\n💰 Argent restant: ${player.argent}$` 
    };
  }

  equipWeapon(phoneNumber, weaponId) {
    const player = this.getPlayer(phoneNumber);
    const weapon = player.inventaire.find(w => w.id === weaponId);
    
    if (!weapon) {
      return { success: false, message: '❌ Vous ne possédez pas cette arme!' };
    }

    player.armeEquipee = weapon;
    return { success: true, message: `✅ ${weapon.nom} équipé!` };
  }

  shoot(shooterPhone, targetPhone, bodyPart = 'torse') {
    const shooter = this.getPlayer(shooterPhone);
    const target = this.getPlayer(targetPhone);
    
    if (shooter.vie <= 0) {
      return { success: false, message: '💀 Vous êtes mort! Attendez votre réapparition.' };
    }

    if (target.vie <= 0) {
      return { success: false, message: '❌ Cette cible est déjà morte!' };
    }

    if (shooter.energie < 10) {
      return { success: false, message: '⚡ Énergie insuffisante pour tirer!' };
    }

    const part = bodyParts[bodyPart] || bodyParts.torse;
    const baseDamage = shooter.armeEquipee.degats;
    const finalDamage = Math.round(baseDamage * part.multiplicateur);

    shooter.energie -= 10;
    target.vie -= finalDamage;

    let message = `💥 ${shooter.armeEquipee.nom} → ${part.nom}\n`;
    message += `🎯 Dégâts: -${finalDamage}%\n`;
    message += `❤️ Vie restante de la cible: ${Math.max(0, target.vie)}%`;

    if (target.vie <= 0) {
      target.vie = 0;
      shooter.kills++;
      target.deaths++;
      shooter.argent += 500;
      
      this.deadPlayers.set(targetPhone, Date.now());
      
      message += '\n\n💀 ÉLIMINATION!\n💰 +500$ de récompense';
    }

    return { success: true, message, killed: target.vie <= 0 };
  }

  move(phoneNumber) {
    const player = this.getPlayer(phoneNumber);
    
    if (player.energie < 20) {
      return { success: false, message: '⚡ Énergie insuffisante pour se déplacer!' };
    }

    player.energie -= 20;
    const newLocation = locations[Math.floor(Math.random() * locations.length)];
    player.position = newLocation;

    let message = `🚶 Déplacement réussi!\n\n`;
    message += `📍 ${newLocation.nom}\n`;
    message += `${newLocation.description}\n\n`;
    message += `🛡️ Couvertures disponibles:\n`;
    newLocation.couverture.forEach(c => {
      message += `  • ${c}\n`;
    });
    message += `\n⚠️ Niveau de danger: ${newLocation.danger}`;

    return { success: true, message };
  }

  getStatus(phoneNumber) {
    const player = this.getPlayer(phoneNumber);
    
    const vieBar = this.createBar(player.vie, 100, '▰', '▱');
    const energieBar = this.createBar(player.energie, 100, '▰', '▱');

    let message = `╔══════ STATUT ══════╗\n\n`;
    message += `❤️ VIE: ${player.vie}%\n${vieBar}\n\n`;
    message += `⚡ ÉNERGIE: ${player.energie}%\n${energieBar}\n\n`;
    message += `🔫 Arme: ${player.armeEquipee.nom}\n`;
    message += `💥 Dégâts: ${player.armeEquipee.degats}\n`;
    message += `📏 Portée: ${player.armeEquipee.portee}m\n\n`;
    message += `📍 Position: ${player.position.nom}\n`;
    message += `💰 Argent: ${player.argent}$\n`;
    message += `💀 K/D: ${player.kills}/${player.deaths}\n\n`;
    message += `╚═══════════════════╝`;

    return message;
  }

  createBar(current, max, fillChar, emptyChar) {
    const barLength = 10;
    const filled = Math.round((current / max) * barLength);
    const empty = barLength - filled;
    return fillChar.repeat(filled) + emptyChar.repeat(empty);
  }

  getShopMessage() {
    let message = `🛒 ═══ BOUTIQUE D'ARMES ═══\n\n`;
    
    message += `🔫 PISTOLETS:\n`;
    weapons.pistolets.slice(0, 5).forEach(w => {
      message += `  • ${w.nom}: ${w.degats} dégâts - ${w.prix}$\n`;
    });

    message += `\n🔫 FUSILS D'ASSAUT:\n`;
    weapons.fusils_assaut.slice(0, 5).forEach(w => {
      message += `  • ${w.nom}: ${w.degats} dégâts - ${w.prix}$\n`;
    });

    message += `\n🎯 SNIPERS:\n`;
    weapons.snipers.slice(0, 5).forEach(w => {
      message += `  • ${w.nom}: ${w.degats} dégâts - ${w.prix}$\n`;
    });

    message += `\n💣 SHOTGUNS:\n`;
    weapons.shotguns.slice(0, 4).forEach(w => {
      message += `  • ${w.nom}: ${w.degats} dégâts - ${w.prix}$\n`;
    });

    message += `\n\n📝 Pour acheter: /acheter [id_arme]\n`;
    message += `Exemple: /acheter ak47`;

    return message;
  }

  isPlayerDead(phoneNumber) {
    return this.deadPlayers.has(phoneNumber);
  }

  checkRespawn(phoneNumber) {
    if (this.deadPlayers.has(phoneNumber)) {
      const deathTime = this.deadPlayers.get(phoneNumber);
      const oneHour = 60 * 60 * 1000;
      
      if (Date.now() - deathTime >= oneHour) {
        this.deadPlayers.delete(phoneNumber);
        this.initPlayer(phoneNumber);
        return { canRespawn: true, message: '✨ Vous êtes réapparu! Vos statistiques ont été réinitialisées.' };
      }
      
      const timeLeft = oneHour - (Date.now() - deathTime);
      const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
      return { canRespawn: false, message: `💀 Vous êtes mort. Réapparition dans ${minutesLeft} minutes.` };
    }
    return { canRespawn: true };
  }

  regenerateEnergy() {
    this.players.forEach(player => {
      if (player.energie < 100) {
        player.energie = Math.min(100, player.energie + 5);
      }
    });
  }
}

module.exports = { GameManager, weapons, bodyParts };
