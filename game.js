
const axios = require('axios');

// Configuration Pollinations AI
const POLLINATIONS_TEXT_API = 'https://text.pollinations.ai/';
const POLLINATIONS_IMAGE_API = 'https://image.pollinations.ai/prompt/';

// Divisions et classements
const divisions = {
  novice: { nom: 'Novice', min: 0, max: 999, couleur: '🟤' },
  bronze: { nom: 'Bronze', min: 1000, max: 2999, couleur: '🟫' },
  argent: { nom: 'Argent', min: 3000, max: 5999, couleur: '⚪' },
  or: { nom: 'Or', min: 6000, max: 9999, couleur: '🟡' },
  platine: { nom: 'Platine', min: 10000, max: 19999, couleur: '💎' },
  diamant: { nom: 'Diamant', min: 20000, max: 39999, couleur: '💠' },
  maitre: { nom: 'Maître', min: 40000, max: 69999, couleur: '🔷' },
  champion: { nom: 'Champion', min: 70000, max: 99999, couleur: '👑' },
  legende: { nom: 'Légende', min: 100000, max: Infinity, couleur: '⚡' }
};

// Véhicules
const vehicles = {
  voitures: [
    { id: 'civic', nom: 'Honda Civic', prix: 15000, vitesse: 180, essence: 50 },
    { id: 'mustang', nom: 'Ford Mustang', prix: 45000, vitesse: 250, essence: 60 },
    { id: 'lambo', nom: 'Lamborghini Aventador', prix: 350000, vitesse: 350, essence: 70 },
    { id: 'tesla', nom: 'Tesla Model S', prix: 90000, vitesse: 260, essence: 100 },
    { id: 'bugatti', nom: 'Bugatti Chiron', prix: 2500000, vitesse: 420, essence: 80 }
  ],
  motos: [
    { id: 'yamaha', nom: 'Yamaha R1', prix: 18000, vitesse: 290, essence: 18 },
    { id: 'ducati', nom: 'Ducati Panigale', prix: 35000, vitesse: 310, essence: 20 },
    { id: 'harley', nom: 'Harley Davidson', prix: 25000, vitesse: 200, essence: 22 }
  ],
  bateaux: [
    { id: 'jetski', nom: 'Jet-Ski', prix: 12000, vitesse: 120, essence: 30 },
    { id: 'yacht', nom: 'Yacht de luxe', prix: 1200000, vitesse: 80, essence: 500 }
  ],
  avions: [
    { id: 'cessna', nom: 'Cessna 172', prix: 250000, vitesse: 220, essence: 200 },
    { id: 'jet', nom: 'Jet Privé', prix: 5000000, vitesse: 900, essence: 1000 }
  ]
};

// Pays et villes
const pays = {
  usa: { 
    nom: 'États-Unis', 
    villes: ['Los Santos', 'Liberty City', 'Vice City', 'San Fierro'],
    prixBillet: 500
  },
  france: { 
    nom: 'France', 
    villes: ['Paris', 'Marseille', 'Lyon', 'Nice'],
    prixBillet: 800
  },
  japon: { 
    nom: 'Japon', 
    villes: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'],
    prixBillet: 1200
  },
  emirats: { 
    nom: 'Émirats Arabes Unis', 
    villes: ['Dubai', 'Abu Dhabi'],
    prixBillet: 1500
  },
  bresil: { 
    nom: 'Brésil', 
    villes: ['Rio de Janeiro', 'São Paulo', 'Brasilia'],
    prixBillet: 900
  }
};

// Missions principales (200)
const missionsPrincipales = Array.from({ length: 200 }, (_, i) => ({
  id: `main_${i + 1}`,
  nom: `Mission Principale #${i + 1}`,
  description: `Accomplir l'objectif ${i + 1}`,
  recompense: 1000 + (i * 500),
  xp: 100 + (i * 50),
  niveau_requis: Math.floor(i / 10)
}));

// Missions secondaires (450)
const missionsSecondaires = Array.from({ length: 450 }, (_, i) => ({
  id: `side_${i + 1}`,
  nom: `Mission Secondaire #${i + 1}`,
  description: `Tâche secondaire ${i + 1}`,
  recompense: 300 + (i * 100),
  xp: 30 + (i * 10),
  niveau_requis: Math.floor(i / 20)
}));

const weapons = {
  pistolets: [
    { id: 'glock17', nom: 'Glock 17', degats: 15, prix: 500, portee: 50 },
    { id: 'deserteagle', nom: 'Desert Eagle', degats: 25, prix: 1200, portee: 60 }
  ],
  fusils_assaut: [
    { id: 'ak47', nom: 'AK-47', degats: 30, prix: 2000, portee: 300 },
    { id: 'm4a1', nom: 'M4A1', degats: 28, prix: 2200, portee: 350 }
  ]
};

const bodyParts = {
  tete: { nom: 'Tête', multiplicateur: 3.0 },
  torse: { nom: 'Torse', multiplicateur: 1.5 },
  bras: { nom: 'Bras', multiplicateur: 0.8 },
  jambes: { nom: 'Jambes', multiplicateur: 0.8 }
};

// Types de PNJ
const pnjTypes = [
  { type: 'civil', agressivite: 0.1, arme: null },
  { type: 'gangster', agressivite: 0.7, arme: 'glock17' },
  { type: 'police', agressivite: 0.5, arme: 'glock17' },
  { type: 'militaire', agressivite: 0.9, arme: 'm4a1' }
];

class GameManager {
  constructor() {
    this.players = new Map();
    this.gameTime = 0; // En minutes de jeu
    this.interactions = new Map();
  }

  async genererTexteIA(prompt) {
    try {
      const response = await axios.post(POLLINATIONS_TEXT_API, {
        messages: [{ role: 'user', content: prompt }],
        model: 'openai'
      }, { timeout: 8000 });
      return response.data;
    } catch (error) {
      return "...";
    }
  }

  async genererImageIA(description) {
    try {
      const encodedPrompt = encodeURIComponent(description);
      const imageUrl = `${POLLINATIONS_IMAGE_API}${encodedPrompt}?width=512&height=512&nologo=true`;
      return imageUrl;
    } catch (error) {
      return null;
    }
  }

  getPlayer(phoneNumber) {
    if (!this.players.has(phoneNumber)) {
      this.initPlayer(phoneNumber);
    }
    return this.players.get(phoneNumber);
  }

  initPlayer(phoneNumber) {
    this.players.set(phoneNumber, {
      vie: 100,
      energie: 100,
      argent: 5000,
      xp: 0,
      niveau: 1,
      division: 'novice',
      armeEquipee: weapons.pistolets[0],
      inventaire: [weapons.pistolets[0]],
      vehicules: [],
      vehiculeActuel: null,
      moteurDemarre: false,
      pays: 'usa',
      ville: 'Los Santos',
      kills: 0,
      deaths: 0,
      missionsTerminees: [],
      tempsJeu: 0, // En minutes
      dernierTick: Date.now()
    });
  }

  getDivision(xp) {
    for (const [key, div] of Object.entries(divisions)) {
      if (xp >= div.min && xp <= div.max) {
        return { id: key, ...div };
      }
    }
    return { id: 'novice', ...divisions.novice };
  }

  updateGameTime() {
    this.gameTime += 1; // +1 minute de jeu toutes les 3 secondes réelles
    
    this.players.forEach((player, phone) => {
      const maintenant = Date.now();
      const ecartSecondes = (maintenant - player.dernierTick) / 1000;
      player.tempsJeu += ecartSecondes / 180; // 1min jeu = 3min réel
      player.dernierTick = maintenant;
      
      if (player.energie < 100) {
        player.energie = Math.min(100, player.energie + 2);
      }
    });
  }

  getTempsJeuFormate(minutes) {
    const jours = Math.floor(minutes / 1440);
    const heures = Math.floor((minutes % 1440) / 60);
    const mins = Math.floor(minutes % 60);
    return `${jours}j ${heures}h ${mins}min`;
  }

  async acheterVehicule(phoneNumber, vehiculeId) {
    const player = this.getPlayer(phoneNumber);
    let vehicule = null;
    
    for (const category of Object.values(vehicles)) {
      vehicule = category.find(v => v.id === vehiculeId);
      if (vehicule) break;
    }

    if (!vehicule) {
      return { success: false, message: '❌ Véhicule introuvable!' };
    }

    if (player.vehicules.find(v => v.id === vehiculeId)) {
      return { success: false, message: '❌ Vous possédez déjà ce véhicule!' };
    }

    if (player.argent < vehicule.prix) {
      return { success: false, message: `❌ Fonds insuffisants! Prix: ${vehicule.prix}$ (Vous: ${player.argent}$)` };
    }

    player.argent -= vehicule.prix;
    player.vehicules.push({ ...vehicule, essence: vehicule.essence });
    
    const contexteAchat = `Tu es un vendeur de voitures dans ${player.ville}. Un client vient d'acheter une ${vehicule.nom}. Décris la scène d'achat en 2 phrases immersives et enthousiastes.`;
    const descriptionIA = await this.genererTexteIA(contexteAchat);
    
    const imagePrompt = `${vehicule.nom} luxury car in ${player.ville} city, cinematic, photorealistic, GTA style`;
    const imageUrl = await this.genererImageIA(imagePrompt);
    
    return { 
      success: true, 
      message: `✅ ${vehicule.nom} acheté!\n\n${descriptionIA}\n\n💰 Argent restant: ${player.argent}$\n📝 /demarrer pour démarrer`,
      image: imageUrl
    };
  }

  demarrerMoteur(phoneNumber) {
    const player = this.getPlayer(phoneNumber);
    
    if (!player.vehiculeActuel) {
      return { success: false, message: '❌ Vous devez d\'abord monter dans un véhicule! (/monter [id])' };
    }

    const vehicule = player.vehicules.find(v => v.id === player.vehiculeActuel);
    if (vehicule.essence <= 0) {
      return { success: false, message: '⛽ Pas d\'essence! Allez à la station-service.' };
    }

    player.moteurDemarre = !player.moteurDemarre;
    const etat = player.moteurDemarre ? 'démarré' : 'coupé';
    
    return { 
      success: true, 
      message: `🔑 Moteur ${etat}!\n🚗 ${vehicule.nom}\n⛽ Essence: ${vehicule.essence}%` 
    };
  }

  monterVehicule(phoneNumber, vehiculeId) {
    const player = this.getPlayer(phoneNumber);
    const vehicule = player.vehicules.find(v => v.id === vehiculeId);
    
    if (!vehicule) {
      return { success: false, message: '❌ Vous ne possédez pas ce véhicule!' };
    }

    player.vehiculeActuel = vehiculeId;
    player.moteurDemarre = false;
    
    return { 
      success: true, 
      message: `🚗 Vous êtes monté dans: ${vehicule.nom}\n📝 Utilisez /demarrer pour démarrer le moteur` 
    };
  }

  async acheterBillet(phoneNumber, paysId) {
    const player = this.getPlayer(phoneNumber);
    const destination = pays[paysId];
    
    if (!destination) {
      return { success: false, message: '❌ Pays introuvable!' };
    }

    if (player.argent < destination.prixBillet) {
      return { success: false, message: `❌ Fonds insuffisants! Billet: ${destination.prixBillet}$` };
    }

    player.argent -= destination.prixBillet;
    player.pays = paysId;
    player.ville = destination.villes[0];
    
    const texteIA = await this.genererTexteIA(
      `Tu es un steward d'avion. Le passager arrive à ${destination.nom}, ville de ${player.ville}. Décris l'arrivée en 2 phrases courtes et immersives.`
    );
    
    return { 
      success: true, 
      message: `✈️ Vol vers ${destination.nom}\n🌍 Arrivée: ${player.ville}\n\n${texteIA}\n\n💰 Argent restant: ${player.argent}$` 
    };
  }

  async interagirPNJ(phoneNumber) {
    const player = this.getPlayer(phoneNumber);
    const pnj = pnjTypes[Math.floor(Math.random() * pnjTypes.length)];
    const interactionId = `${phoneNumber}_${Date.now()}`;
    
    const contexte = `Tu es un ${pnj.type} dans ${player.ville}, ${pays[player.pays].nom}. Un joueur t'approche. Réagis en 2 phrases courtes selon ton personnage (${pnj.type}).`;
    const reactionIA = await this.genererTexteIA(contexte);
    
    this.interactions.set(interactionId, {
      pnj,
      startTime: Date.now(),
      player: phoneNumber,
      actif: true
    });

    setTimeout(() => {
      const interaction = this.interactions.get(interactionId);
      if (interaction && interaction.actif) {
        if (Math.random() < pnj.agressivite) {
          player.vie -= 20;
          this.interactions.delete(interactionId);
        }
      }
    }, 60000); // 1 minute

    return { 
      success: true, 
      message: `🎭 PNJ ${pnj.type} rencontré!\n\n💬 "${reactionIA}"\n\n⏱️ Vous avez 1 minute pour réagir:\n/attaquer - /parler - /fuir`,
      interactionId
    };
  }

  async getClassement() {
    const joueurs = Array.from(this.players.entries()).map(([phone, p]) => ({
      phone,
      xp: p.xp,
      division: this.getDivision(p.xp),
      kills: p.kills,
      argent: p.argent
    })).sort((a, b) => b.xp - a.xp);

    let msg = `🏆 ═══ CLASSEMENT MONDIAL ═══\n\n`;
    joueurs.slice(0, 10).forEach((j, i) => {
      msg += `${i + 1}. ${j.division.couleur} ${j.division.nom}\n`;
      msg += `   XP: ${j.xp} | K: ${j.kills} | 💰 ${j.argent}$\n\n`;
    });

    return msg;
  }

  getStatus(phoneNumber) {
    const player = this.getPlayer(phoneNumber);
    const division = this.getDivision(player.xp);
    const tempsJeu = this.getTempsJeuFormate(player.tempsJeu);
    
    let message = `╔══════ PROFIL ══════╗\n\n`;
    message += `${division.couleur} Division: ${division.nom}\n`;
    message += `⭐ Niveau: ${player.niveau}\n`;
    message += `💎 XP: ${player.xp}\n`;
    message += `⏰ Temps de jeu: ${tempsJeu}\n\n`;
    message += `❤️ VIE: ${player.vie}%\n`;
    message += `⚡ ÉNERGIE: ${player.energie}%\n`;
    message += `💰 ARGENT: ${player.argent}$\n\n`;
    message += `🌍 Localisation: ${player.ville}, ${pays[player.pays].nom}\n`;
    message += `🔫 Arme: ${player.armeEquipee.nom}\n`;
    
    if (player.vehiculeActuel) {
      const v = player.vehicules.find(ve => ve.id === player.vehiculeActuel);
      message += `🚗 Véhicule: ${v.nom} ${player.moteurDemarre ? '🔥' : '❄️'}\n`;
    }
    
    message += `\n📊 K/D: ${player.kills}/${player.deaths}\n`;
    message += `✅ Missions: ${player.missionsTerminees.length}/650\n`;
    message += `\n╚═══════════════════╝`;

    return message;
  }

  getGarageMenu() {
    let msg = `🚗 ═══ GARAGE ═══\n\n`;
    
    msg += `🚙 VOITURES:\n`;
    vehicles.voitures.forEach(v => {
      msg += `  ${v.id} - ${v.nom}: ${v.prix}$ (${v.vitesse}km/h)\n`;
    });

    msg += `\n🏍️ MOTOS:\n`;
    vehicles.motos.forEach(v => {
      msg += `  ${v.id} - ${v.nom}: ${v.prix}$ (${v.vitesse}km/h)\n`;
    });

    msg += `\n\n📝 /achetervehicule [id]\n📝 /monter [id]\n📝 /demarrer`;
    return msg;
  }

  getVoyageMenu() {
    let msg = `✈️ ═══ AGENCE DE VOYAGE ═══\n\n`;
    
    Object.entries(pays).forEach(([id, p]) => {
      msg += `${id} - ${p.nom}: ${p.prixBillet}$\n`;
      msg += `   Villes: ${p.villes.join(', ')}\n\n`;
    });

    msg += `📝 /voyage [pays]`;
    return msg;
  }

  getMissionsMenu(type = 'main') {
    const missions = type === 'main' ? missionsPrincipales : missionsSecondaires;
    let msg = `📋 ═══ MISSIONS ${type === 'main' ? 'PRINCIPALES' : 'SECONDAIRES'} ═══\n\n`;
    
    missions.slice(0, 10).forEach(m => {
      msg += `${m.id}: ${m.nom}\n`;
      msg += `   💰 ${m.recompense}$ | 💎 ${m.xp}XP\n`;
      msg += `   Niveau requis: ${m.niveau_requis}\n\n`;
    });

    msg += `📝 /mission [id]`;
    return msg;
  }

  checkRespawn(playerId) {
    const player = this.getPlayer(playerId);
    
    if (player.vie <= 0) {
      const tempsRestant = Math.ceil((3600000 - (Date.now() - player.tempsRespawn)) / 1000);
      
      if (tempsRestant > 0) {
        const minutes = Math.floor(tempsRestant / 60);
        const secondes = tempsRestant % 60;
        return {
          canRespawn: false,
          message: `💀 Vous êtes mort! Réapparition dans ${minutes}m ${secondes}s`
        };
      } else {
        player.vie = 100;
        player.energie = 100;
        return {
          canRespawn: true,
          message: `✅ Vous êtes réapparu! Vie et énergie restaurées.`
        };
      }
    }
    
    return { canRespawn: true, message: '' };
  }

  getShopMessage() {
    let msg = `🔫 ═══ ARMURERIE ═══\n\n`;
    
    msg += `🔫 PISTOLETS:\n`;
    weapons.pistolets.forEach(w => {
      msg += `  ${w.id} - ${w.nom}: ${w.prix}$ (${w.degats} dégâts)\n`;
    });

    msg += `\n🎯 FUSILS D'ASSAUT:\n`;
    weapons.fusils_assaut.forEach(w => {
      msg += `  ${w.id} - ${w.nom}: ${w.prix}$ (${w.degats} dégâts)\n`;
    });

    msg += `\n\n📝 /acheter [id]\n📝 /equiper [id]`;
    return msg;
  }

  buyWeapon(playerId, weaponId) {
    const player = this.getPlayer(playerId);
    let weapon = null;
    
    for (const category of Object.values(weapons)) {
      weapon = category.find(w => w.id === weaponId);
      if (weapon) break;
    }

    if (!weapon) {
      return { success: false, message: '❌ Arme introuvable!' };
    }

    if (player.inventaire.find(w => w.id === weaponId)) {
      return { success: false, message: '❌ Vous possédez déjà cette arme!' };
    }

    if (player.argent < weapon.prix) {
      return { success: false, message: `❌ Fonds insuffisants! Prix: ${weapon.prix}$` };
    }

    player.argent -= weapon.prix;
    player.inventaire.push(weapon);
    
    return { 
      success: true, 
      message: `✅ ${weapon.nom} acheté!\n💰 Argent restant: ${player.argent}$` 
    };
  }

  equipWeapon(playerId, weaponId) {
    const player = this.getPlayer(playerId);
    const weapon = player.inventaire.find(w => w.id === weaponId);
    
    if (!weapon) {
      return { success: false, message: '❌ Vous ne possédez pas cette arme!' };
    }

    player.armeEquipee = weapon;
    return { 
      success: true, 
      message: `✅ ${weapon.nom} équipé!` 
    };
  }

  async move(playerId) {
    const player = this.getPlayer(playerId);
    const locations = ['Rue principale', 'Ruelle sombre', 'Parc central', 'Zone industrielle', 'Plage', 'Centre-ville'];
    const newLocation = locations[Math.floor(Math.random() * locations.length)];
    
    const contexte = `Décris en 2 phrases l'ambiance et l'atmosphère quand un personnage arrive à "${newLocation}" dans ${player.ville}, ${pays[player.pays].nom}. Style GTA, immersif.`;
    const description = await this.genererTexteIA(contexte);
    
    const imagePrompt = `${newLocation} in ${player.ville}, ${pays[player.pays].nom}, GTA style, cinematic lighting, urban environment`;
    const imageUrl = await this.genererImageIA(imagePrompt);
    
    return {
      success: true,
      message: `📍 ${newLocation}\n🌍 ${player.ville}, ${pays[player.pays].nom}\n\n${description}`,
      image: imageUrl
    };
  }

  async shoot(shooterId, targetId, bodyPart = 'torse') {
    const shooter = this.getPlayer(shooterId);
    const target = this.getPlayer(targetId);
    
    if (shooter.energie < 10) {
      return { success: false, message: '❌ Pas assez d\'énergie pour tirer!' };
    }

    const part = bodyParts[bodyPart] || bodyParts.torse;
    const degats = Math.floor(shooter.armeEquipee.degats * part.multiplicateur);
    
    target.vie -= degats;
    shooter.energie -= 10;
    
    const contexte = `Décris en 1 phrase courte et percutante un tir de ${shooter.armeEquipee.nom} qui touche la ${part.nom}. Style action, intense.`;
    const description = await this.genererTexteIA(contexte);
    
    let message = `🔫 ${shooter.armeEquipee.nom}\n`;
    message += `🎯 ${part.nom}\n\n`;
    message += `${description}\n\n`;
    message += `💥 ${degats} dégâts\n`;
    message += `❤️ Vie cible: ${Math.max(0, target.vie)}%`;

    const imagePrompt = `${shooter.armeEquipee.nom} gun shooting action scene, GTA style, cinematic, muzzle flash`;
    const imageUrl = await this.genererImageIA(imagePrompt);

    if (target.vie <= 0) {
      target.vie = 0;
      target.tempsRespawn = Date.now();
      shooter.kills++;
      target.deaths++;
      shooter.xp += 100;
      message += `\n\n💀 ÉLIMINATION!\n+100 XP`;
      return { success: true, message, killed: true, image: imageUrl };
    }

    return { success: true, message, killed: false, image: imageUrl };
  }
}

module.exports = { GameManager, weapons, bodyParts, vehicles, pays };
