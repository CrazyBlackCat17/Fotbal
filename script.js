const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menuEl = document.getElementById("menu");
const menuTitleEl = document.getElementById("menuTitle");
const menuSubtitleEl = document.getElementById("menuSubtitle");
const menuButtonsEl = document.getElementById("menuButtons");
const gameViewEl = document.getElementById("gameView");

const leftScoreEl = document.getElementById("leftScore");
const rightScoreEl = document.getElementById("rightScore");
const leftTeamNameEl = document.getElementById("leftTeamName");
const rightTeamNameEl = document.getElementById("rightTeamName");
const leftTeamLogoEl = document.getElementById("leftTeamLogo");
const rightTeamLogoEl = document.getElementById("rightTeamLogo");
const halfInfoEl = document.getElementById("halfInfo");
const timeInfoEl = document.getElementById("timeInfo");
const goalOverlayEl = document.getElementById("goalOverlay");
const halftimeOverlayEl = document.getElementById("halftimeOverlay");
const halftimeScoreEl = document.getElementById("halftimeScore");
const startSecondHalfBtn = document.getElementById("startSecondHalfBtn");
const fulltimeOverlayEl = document.getElementById("fulltimeOverlay");
const fulltimeScoreEl = document.getElementById("fulltimeScore");
const fulltimeWinnerEl = document.getElementById("fulltimeWinner");
const messageEl = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const ballSprite = document.getElementById("ballSprite");

const BALL_SPRITE_CANDIDATES = ["assets/ball-sprite.png", "assets/ball-sprite.svg"];
const KICK_SOUND_FILES = ["assets/kick1.m4a", "assets/kick2.m4a", "assets/kick3.m4a", "assets/kick4.m4a"];
const KICK_SOUND_COOLDOWN_MS = 70;
const REF_WHISTLE_CANDIDATES = ["assets/refwhistle.m4a", "assets/refwhistle.M4a", "assets/refwhistle.mp3", "assets/refwhistle.wav"];
const FINAL_WHISTLE_CANDIDATES = ["assets/finalwhistle.m4a", "assets/finalwhistle.M4a", "assets/finalwhistle.mp3", "assets/finalwhistle.wav"];
const POST_SOUND_CANDIDATES = ["assets/postsound.m4a", "assets/postsound.M4a", "assets/postsound.mp3", "assets/postsound.wav"];
const GOAL_CHEER_CANDIDATES = ["assets/goalcheer1.m4a", "assets/goalcheer1.M4a", "assets/goalcheer1.mp3", "assets/goalcheer1.wav"];
const SIGMA_ULTRAS_FIRST_HALF_CANDIDATES = ["assets/sigmaultras2.m4a", "assets/sigmaultras2.M4a", "assets/sigmaultras2.mp3", "assets/sigmaultras2.wav"];
const SIGMA_ULTRAS_SECOND_HALF_CANDIDATES = ["assets/sigmaultras1.m4a", "assets/sigmaultras1.M4a", "assets/sigmaultras1.mp3", "assets/sigmaultras1.wav"];
const SPARTA_ULTRAS_FIRST_HALF_CANDIDATES = ["assets/spartaultras1.m4a", "assets/spartaultras1.M4a", "assets/spartaultras1.mp3", "assets/spartaultras1.wav"];
const SPARTA_ULTRAS_SECOND_HALF_CANDIDATES = ["assets/spartaultras2.m4a", "assets/spartaultras2.M4a", "assets/spartaultras2.mp3", "assets/spartaultras2.wav"];
const PLZEN_ULTRAS_FIRST_HALF_CANDIDATES = ["assets/plzenultras1.m4a", "assets/plzenultras1.M4a", "assets/plzenultras1.mp3", "assets/plzenultras1.wav"];
const PLZEN_ULTRAS_SECOND_HALF_CANDIDATES = ["assets/plzenultras2.m4a", "assets/plzenultras2.M4a", "assets/plzenultras2.mp3", "assets/plzenultras2.wav"];
const SLAVIA_ULTRAS_FIRST_HALF_CANDIDATES = ["assets/slaviaultras1.m4a", "assets/slaviaultras1.M4a", "assets/slaviaultras1.mp3", "assets/slaviaultras1.wav"];
const SLAVIA_ULTRAS_SECOND_HALF_CANDIDATES = ["assets/slaviaultras2.m4a", "assets/slaviaultras2.M4a", "assets/slaviaultras2.mp3", "assets/slaviaultras2.wav"];
const BANIK_ULTRAS_FIRST_HALF_CANDIDATES = ["assets/banikultras1.m4a", "assets/banikultras1.M4a", "assets/banikultras1.mp3", "assets/banikultras1.wav"];
const BANIK_ULTRAS_SECOND_HALF_CANDIDATES = ["assets/banikultras2.m4a", "assets/banikultras2.M4a", "assets/banikultras2.mp3", "assets/banikultras2.wav"];
const GOAL_CHANT_PAUSE_MS = 4000;

const SETTINGS_STORAGE_KEY = "soccerDuelSettingsV1";
const DEFAULT_SOUND_VOLUME = 0.85;
const DEFAULT_CHANTS_VOLUME = 1;
const DEFAULT_BALL_SPEED_MULTIPLIER = 1.08;

const HALF_DURATION = 60;
const TOTAL_HALVES = 2;
const GOAL_PAUSE_MS = 3000;
const POST_RADIUS = 6;

const FRICTION = 0.997;
const PLAYER_SPEED = 8.3;

const AI_PRESETS = {
  easy: { label: "Lehká", speed: 2.4, reactionFrames: 14 },
  medium: { label: "Střední", speed: 3.2, reactionFrames: 8 },
  hard: { label: "Těžká", speed: 4.3, reactionFrames: 5 },
  extreme: { label: "Extrémní", speed: 5.5, reactionFrames: 2 },
};

const TEAMS = ["Slavia", "Sparta", "Baník", "Hradec Králové", "Karviná", "Pardubice", "Artis Brno", "Sigma Olomouc", "Slovácko", "Viktoria Plzeň", "Mladá Boleslav", "Jablonec", "Slovan Liberec", "Bohemians Praha", "Zlín", "Teplice", "Dukla Praha"];

const TEAM_LOGO_CANDIDATES = {
  "Slavia": ["assets/slavia.png", "assets/Slavia.png", "assets/slavia.jpg", "assets/Slavia.jpg"],
  "Sparta": ["assets/sparta.png", "assets/Sparta.png", "assets/sparta.jpg", "assets/Sparta.jpg"],
  "Baník": ["assets/banik.png", "assets/Banik.png", "assets/baník.png", "assets/Baník.png", "assets/banik.jpg", "assets/Banik.jpg"],
  "Hradec Králové": [
    "assets/hradec-kralove.png",
    "assets/Hradec-Kralove.png",
    "assets/hradec kralove.png",
    "assets/Hradec Kralove.png",
    "assets/Hradec_Kralove.png",
    "assets/hradec-kralove.jpg",
  ],
  "Karviná": ["assets/karvina.png", "assets/Karvina.png", "assets/karvina.jpg", "assets/Karvina.jpg"],
  "Pardubice": ["assets/pardubice.png", "assets/Pardubice.png", "assets/pardubice.jpg", "assets/Pardubice.jpg"],
  "Artis Brno": ["assets/artis-brno.png", "assets/Artis-Brno.png", "assets/artis-brno.jpg", "assets/Artis-Brno.jpg"],
  "Sigma Olomouc": ["assets/sigma.png", "assets/Sigma.png", "assets/sigma.jpg", "assets/Sigma.jpg"],
  "Slovácko": ["assets/slovacko.png", "assets/Slovacko.png", "assets/slovacko.jpg", "assets/Slovacko.jpg"],
  "Viktoria Plzeň": ["assets/viktoria-plzen.png", "assets/Viktoria-Plzen.png", "assets/viktoria-plzen.jpg", "assets/Viktoria-Plzen.jpg"],
  "Mladá Boleslav": ["assets/mlada.png", "assets/Mlada.png", "assets/mlada.jpg", "assets/Mlada.jpg"],
  "Jablonec": ["assets/jablonec.png", "assets/Jablonec.png", "assets/jablonec.jpg", "assets/Jablonec.jpg"],
  "Slovan Liberec": ["assets/liberec.png", "assets/Liberec.png", "assets/liberec.jpg", "assets/Liberec.jpg"],
  "Bohemians Praha": ["assets/bohemians.png", "assets/Bohemians.png", "assets/bohemians.jpg", "assets/Bohemians.jpg"],
  "Zlín": ["assets/zlín.png", "assets/Zlin.png", "assets/zlin.png", "assets/zlín.jpg", "assets/Zlin.jpg", "assets/zlin.jpg"],
  "Teplice": ["assets/teplice.png", "assets/Teplice.png", "assets/teplice.jpg", "assets/Teplice.jpg"],
  "Dukla Praha": ["assets/dukla.png", "assets/Dukla.png", "assets/dukla.jpg", "assets/Dukla.jpg"],
};


const state = {
  aiPreset: AI_PRESETS.medium,
  selectedTeam: "Slavia",
  selectedTeamLogo: null,
  aiTeam: "Sparta",
  aiTeamLogo: null,
  gameActive: false,
  goalPaused: false,
  halfTimePaused: false,
  soundVolume: DEFAULT_SOUND_VOLUME,
  ballSpeedMultiplier: DEFAULT_BALL_SPEED_MULTIPLIER,
  chantsVolume: DEFAULT_CHANTS_VOLUME,
  half: 1,
  timeLeft: HALF_DURATION,
  lastFrameTime: 0,
  confetti: [],
};

const player = { x: canvas.width / 2, y: canvas.height * 0.8, radius: 28, color: "#0f5fff" };
const ai = { x: canvas.width / 2, y: canvas.height * 0.2, radius: 28, color: "#ff4040" };


function getPlayerColorByTeam(teamName) {
  if (teamName === "Slavia") return "#ffffff";
  if (teamName === "Sparta") return "#881515";
  if (teamName === "Baník") return "#4dafff";
  if (teamName === "Teplice") return "#f7c600";
  if (teamName === "Dukla Praha") return "#67101b";
  if (teamName === "Karviná") return "#0f7a2f";
  if (teamName === "Pardubice") return "#ffffff";
  if (teamName === "Viktoria Plzeň") return "#0058a8";
  if (teamName === "Mladá Boleslav") return "#2596be";
  if (teamName === "Jablonec") return "#00874C";
  return "#0f5fff";
}

function getPlayerLogoScaleByTeam(teamName) {
  if (teamName === "Sparta") return { x: 0.76, y: 0.94 };
  if (teamName === "Baník") return { x: 0.76, y: 0.76 };
  if (teamName === "Teplice") return { x: 0.66, y: 0.82 };
  if (teamName === "Dukla Praha") return { x: 0.82, y: 0.60 };
  if (teamName === "Karviná") return { x: 0.9, y: 0.9 };
  if (teamName === "Pardubice") return { x: 0.92, y: 0.92 };
  if (teamName === "Artis Brno") return { x: 1.1, y: 1.1 };
  if (teamName === "Sigma Olomouc") return { x: 1.1, y: 1.1 };
  if (teamName === "Viktoria Plzeň") return { x: 0.78, y: 1.06 };
  if (teamName === "Mladá Boleslav") return { x: 1.8, y: 1.8 };
  if (teamName === "Jablonec") return { x: 0.9, y: 0.9 };
  if (teamName === "Slovan Liberec") return { x: 1, y: 1 };
  if (teamName === "Bohemians Praha") return { x: 1.1, y: 1.1 };
  if (teamName === "Zlín") return { x: 1.1, y: 1.1 };
  return { x: 1, y: 1 };
}

function getPlayerSplitColorsByTeam(teamName) {
  if (teamName === "Viktoria Plzeň") return { left: "#0058a8", right: "#d61f2c" };
  if (teamName === "Baník") return { left: "#E2393E", right: "#4092D5", angleDeg: 45 };
  if (teamName === "Karviná") return { parts: ["#2AA34F", "#ffffff", "#2AA34F"] };
  if (teamName === "Jablonec") return { parts: ["#00874C", "#ffffff", "#00874C"] };
  return null;
}

function getPlayerBorderColorByTeam(teamName) {
  if (teamName === "Karviná") return "#ffffff";
  if (teamName === "Jablonec") return "#ffffff";
  return null;
}

const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 18, vx: 0, vy: 0 };

const dragState = { active: false, pointerId: null, targetX: player.x, targetY: player.y };
const aiBrain = { frame: 0, targetX: ai.x, targetY: ai.y };

let leftScore = 0;
let rightScore = 0;
let gameOver = false;
let lastKickSoundAt = 0;
const kickSoundPool = [];
let refWhistleSound = null;
let finalWhistleSound = null;
let postSound = null;
let goalCheerSound = null;
let sigmaUltrasFirstHalfSound = null;
let sigmaUltrasSecondHalfSound = null;
let spartaUltrasFirstHalfSound = null;
let spartaUltrasSecondHalfSound = null;
let plzenUltrasFirstHalfSound = null;
let plzenUltrasSecondHalfSound = null;
let slaviaUltrasFirstHalfSound = null;
let slaviaUltrasSecondHalfSound = null;
let banikUltrasFirstHalfSound = null;
let banikUltrasSecondHalfSound = null;
let activeSigmaUltrasSound = null;
let sigmaUltrasResumeTimeoutId = null;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function loadSettingsFromStorage() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (typeof parsed.soundVolume === "number") {
      state.soundVolume = clamp(parsed.soundVolume, 0, 1);
    }
    if (typeof parsed.ballSpeedMultiplier === "number") {
      state.ballSpeedMultiplier = clamp(parsed.ballSpeedMultiplier, 0.6, 1.8);
    }
    if (typeof parsed.chantsVolume === "number") {
      state.chantsVolume = clamp(parsed.chantsVolume, 0, 1);
    } else if (typeof parsed.chantsEnabled === "boolean") {
      state.chantsVolume = parsed.chantsEnabled ? 1 : 0;
    }
  } catch (_error) {
    // Ignore invalid or unavailable storage.
  }
}

function persistSettingsToStorage() {
  try {
    const payload = {
      soundVolume: state.soundVolume,
      ballSpeedMultiplier: state.ballSpeedMultiplier,
      chantsVolume: state.chantsVolume,
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
  } catch (_error) {
    // Ignore storage write failures (private mode, quota, etc.).
  }
}

function getGoalBounds() {
  const goalWidth = canvas.width * 0.36;
  const goalLeft = (canvas.width - goalWidth) / 2;
  return { goalLeft, goalRight: goalLeft + goalWidth, goalWidth };
}

function updateMatchInfo() {
  halfInfoEl.textContent = `${state.half}. poločas`;
  timeInfoEl.textContent = `${Math.max(0, Math.ceil(state.timeLeft))} s`;
}

function setMenu(title, subtitle, buttons) {
  menuTitleEl.textContent = title;
  menuSubtitleEl.textContent = subtitle;
  menuButtonsEl.innerHTML = "";

  buttons.forEach((b) => {
    const btn = document.createElement("button");
    if (b.logoSrc) {
      const logo = document.createElement("img");
      logo.src = b.logoSrc;
      if (b.logoFallbackSrc) {
        logo.addEventListener("error", () => {
          if (logo.src !== b.logoFallbackSrc) {
            logo.src = b.logoFallbackSrc;
          }
        }, { once: true });
      }
      logo.alt = "";
      logo.className = b.logoClassName || "menu-team-logo";
      btn.appendChild(logo);

      const label = document.createElement("span");
      label.textContent = b.label;
      btn.appendChild(label);
    } else {
      btn.textContent = b.label;
    }
    if (b.secondary) btn.classList.add("secondary");
    btn.addEventListener("click", b.onClick);
    menuButtonsEl.appendChild(btn);
  });
}


function initBallSprite() {
  if (!ballSprite) return;
  let i = 0;
  const loadNext = () => {
    if (i >= BALL_SPRITE_CANDIDATES.length) return;
    ballSprite.src = BALL_SPRITE_CANDIDATES[i++];
  };

  ballSprite.addEventListener("error", loadNext);
  loadNext();
}

function getEffectiveVolume(baseVolume) {
  return clamp(baseVolume * state.soundVolume, 0, 1);
}

function getEffectiveChantsVolume(baseVolume) {
  return clamp(baseVolume * state.soundVolume * state.chantsVolume, 0, 1);
}

function initKickSounds() {
  KICK_SOUND_FILES.forEach((src) => {
    const sound = new Audio(src);
    sound.preload = "auto";
    sound.volume = 0.9;
    kickSoundPool.push(sound);
  });
}

function playRandomKickSound() {
  if (kickSoundPool.length === 0) return;

  const now = performance.now();
  if (now - lastKickSoundAt < KICK_SOUND_COOLDOWN_MS) return;
  lastKickSoundAt = now;

  const baseSound = kickSoundPool[Math.floor(Math.random() * kickSoundPool.length)];
  const sound = baseSound.cloneNode();
  sound.volume = getEffectiveVolume(baseSound.volume);
  sound.play().catch(() => {});
}


function initRefWhistleSound() {
  refWhistleSound = loadAudioFromCandidates(REF_WHISTLE_CANDIDATES, 0.85);
}

function playRefWhistle() {
  if (!refWhistleSound) return;
  const whistle = refWhistleSound.cloneNode();
  whistle.volume = getEffectiveVolume(refWhistleSound.volume);
  whistle.play().catch(() => {});
}

function initFinalWhistleSound() {
  finalWhistleSound = loadAudioFromCandidates(FINAL_WHISTLE_CANDIDATES, 0.4);
}

function playFinalWhistle() {
  if (!finalWhistleSound) return;
  const whistle = finalWhistleSound.cloneNode();
  whistle.volume = getEffectiveVolume(finalWhistleSound.volume);
  whistle.play().catch(() => {});
}


function loadAudioFromCandidates(candidates, volume = 1) {
  if (!candidates || candidates.length === 0) return null;

  const audio = new Audio();
  audio.preload = "auto";
  audio.volume = volume;

  let i = 0;
  const tryNext = () => {
    if (i >= candidates.length) {
      audio.removeEventListener("error", tryNext);
      return;
    }
    audio.src = candidates[i++];
    audio.load();
  };

  audio.addEventListener("error", tryNext);
  tryNext();
  return audio;
}

function initPostSound() {
  postSound = loadAudioFromCandidates(POST_SOUND_CANDIDATES, 0.8);
}

function playPostSound() {
  if (!postSound) return;
  const post = postSound.cloneNode();
  post.volume = getEffectiveVolume(postSound.volume);
  post.play().catch(() => {});
}

function resolvePostCollision(postX, postY, postRadius = POST_RADIUS) {
  const dx = ball.x - postX;
  const dy = ball.y - postY;
  const distance = Math.hypot(dx, dy);
  const minDistance = ball.radius + postRadius;

  if (distance < minDistance) {
    const safeDistance = distance || 0.001;
    const nx = dx / safeDistance;
    const ny = dy / safeDistance;
    const overlap = minDistance - distance;
    ball.x += nx * overlap;
    ball.y += ny * overlap;

    const relativeSpeed = ball.vx * nx + ball.vy * ny;
    if (relativeSpeed < 0) {
      ball.vx -= 2 * relativeSpeed * nx;
      ball.vy -= 2 * relativeSpeed * ny;
    }

    ball.vx += nx * 0.25;
    ball.vy += ny * 0.25;
    playPostSound();
    return true;
  }

  return false;
}

function initGoalCheerSound() {
  goalCheerSound = loadAudioFromCandidates(GOAL_CHEER_CANDIDATES, 0.85);
}

function playGoalCheerSound() {
  if (!goalCheerSound) return;
  const cheer = goalCheerSound.cloneNode();
  cheer.volume = getEffectiveVolume(goalCheerSound.volume);
  cheer.play().catch(() => {});
}

function initSigmaUltrasSounds() {
  sigmaUltrasFirstHalfSound = loadAudioFromCandidates(SIGMA_ULTRAS_FIRST_HALF_CANDIDATES, 0.72);
  sigmaUltrasSecondHalfSound = loadAudioFromCandidates(SIGMA_ULTRAS_SECOND_HALF_CANDIDATES, 0.72);
  spartaUltrasFirstHalfSound = loadAudioFromCandidates(SPARTA_ULTRAS_FIRST_HALF_CANDIDATES, 0.72);
  spartaUltrasSecondHalfSound = loadAudioFromCandidates(SPARTA_ULTRAS_SECOND_HALF_CANDIDATES, 0.72);
  plzenUltrasFirstHalfSound = loadAudioFromCandidates(PLZEN_ULTRAS_FIRST_HALF_CANDIDATES, 0.72);
  plzenUltrasSecondHalfSound = loadAudioFromCandidates(PLZEN_ULTRAS_SECOND_HALF_CANDIDATES, 0.72);
  slaviaUltrasFirstHalfSound = loadAudioFromCandidates(SLAVIA_ULTRAS_FIRST_HALF_CANDIDATES, 0.72);
  slaviaUltrasSecondHalfSound = loadAudioFromCandidates(SLAVIA_ULTRAS_SECOND_HALF_CANDIDATES, 0.72);
  banikUltrasFirstHalfSound = loadAudioFromCandidates(BANIK_ULTRAS_FIRST_HALF_CANDIDATES, 0.72);
  banikUltrasSecondHalfSound = loadAudioFromCandidates(BANIK_ULTRAS_SECOND_HALF_CANDIDATES, 0.72);

  if (sigmaUltrasFirstHalfSound) sigmaUltrasFirstHalfSound.loop = false;
  if (sigmaUltrasSecondHalfSound) sigmaUltrasSecondHalfSound.loop = false;
  if (spartaUltrasFirstHalfSound) spartaUltrasFirstHalfSound.loop = false;
  if (spartaUltrasSecondHalfSound) spartaUltrasSecondHalfSound.loop = false;
  if (plzenUltrasFirstHalfSound) plzenUltrasFirstHalfSound.loop = false;
  if (plzenUltrasSecondHalfSound) plzenUltrasSecondHalfSound.loop = false;
  if (slaviaUltrasFirstHalfSound) slaviaUltrasFirstHalfSound.loop = false;
  if (slaviaUltrasSecondHalfSound) slaviaUltrasSecondHalfSound.loop = false;
  if (banikUltrasFirstHalfSound) banikUltrasFirstHalfSound.loop = false;
  if (banikUltrasSecondHalfSound) banikUltrasSecondHalfSound.loop = false;
}

function syncSigmaUltrasVolume() {
  if (sigmaUltrasFirstHalfSound) sigmaUltrasFirstHalfSound.volume = getEffectiveChantsVolume(0.72);
  if (sigmaUltrasSecondHalfSound) sigmaUltrasSecondHalfSound.volume = getEffectiveChantsVolume(0.72);
  if (spartaUltrasFirstHalfSound) spartaUltrasFirstHalfSound.volume = getEffectiveChantsVolume(0.72);
  if (spartaUltrasSecondHalfSound) spartaUltrasSecondHalfSound.volume = getEffectiveChantsVolume(0.72);
  if (plzenUltrasFirstHalfSound) plzenUltrasFirstHalfSound.volume = getEffectiveChantsVolume(0.72);
  if (plzenUltrasSecondHalfSound) plzenUltrasSecondHalfSound.volume = getEffectiveChantsVolume(0.72);
  if (slaviaUltrasFirstHalfSound) slaviaUltrasFirstHalfSound.volume = getEffectiveChantsVolume(0.72);
  if (slaviaUltrasSecondHalfSound) slaviaUltrasSecondHalfSound.volume = getEffectiveChantsVolume(0.72);
  if (banikUltrasFirstHalfSound) banikUltrasFirstHalfSound.volume = getEffectiveChantsVolume(0.72);
  if (banikUltrasSecondHalfSound) banikUltrasSecondHalfSound.volume = getEffectiveChantsVolume(0.72);
}

function stopSigmaUltrasChant() {
  if (sigmaUltrasResumeTimeoutId) {
    clearTimeout(sigmaUltrasResumeTimeoutId);
    sigmaUltrasResumeTimeoutId = null;
  }

  if (sigmaUltrasFirstHalfSound) {
    sigmaUltrasFirstHalfSound.pause();
    sigmaUltrasFirstHalfSound.currentTime = 0;
  }

  if (sigmaUltrasSecondHalfSound) {
    sigmaUltrasSecondHalfSound.pause();
    sigmaUltrasSecondHalfSound.currentTime = 0;
  }

  if (spartaUltrasFirstHalfSound) {
    spartaUltrasFirstHalfSound.pause();
    spartaUltrasFirstHalfSound.currentTime = 0;
  }

  if (spartaUltrasSecondHalfSound) {
    spartaUltrasSecondHalfSound.pause();
    spartaUltrasSecondHalfSound.currentTime = 0;
  }

  if (plzenUltrasFirstHalfSound) {
    plzenUltrasFirstHalfSound.pause();
    plzenUltrasFirstHalfSound.currentTime = 0;
  }

  if (plzenUltrasSecondHalfSound) {
    plzenUltrasSecondHalfSound.pause();
    plzenUltrasSecondHalfSound.currentTime = 0;
  }

  if (slaviaUltrasFirstHalfSound) {
    slaviaUltrasFirstHalfSound.pause();
    slaviaUltrasFirstHalfSound.currentTime = 0;
  }

  if (slaviaUltrasSecondHalfSound) {
    slaviaUltrasSecondHalfSound.pause();
    slaviaUltrasSecondHalfSound.currentTime = 0;
  }

  if (banikUltrasFirstHalfSound) {
    banikUltrasFirstHalfSound.pause();
    banikUltrasFirstHalfSound.currentTime = 0;
  }

  if (banikUltrasSecondHalfSound) {
    banikUltrasSecondHalfSound.pause();
    banikUltrasSecondHalfSound.currentTime = 0;
  }

  activeSigmaUltrasSound = null;
}

function playSigmaUltrasForHalf(half) {
  if (state.chantsVolume <= 0) return;

  let targetSound = null;

  if (state.selectedTeam === "Sigma Olomouc") {
    targetSound = half === 1 ? sigmaUltrasFirstHalfSound : sigmaUltrasSecondHalfSound;
  } else if (state.selectedTeam === "Sparta") {
    targetSound = half === 1 ? spartaUltrasFirstHalfSound : spartaUltrasSecondHalfSound;
  } else if (state.selectedTeam === "Viktoria Plzeň") {
    targetSound = half === 1 ? plzenUltrasFirstHalfSound : plzenUltrasSecondHalfSound;
  } else if (state.selectedTeam === "Slavia") {
    targetSound = half === 1 ? slaviaUltrasFirstHalfSound : slaviaUltrasSecondHalfSound;
  } else if (state.selectedTeam === "Baník") {
    targetSound = half === 1 ? banikUltrasFirstHalfSound : banikUltrasSecondHalfSound;
  } else {
    return;
  }

  if (!targetSound) return;

  if (sigmaUltrasResumeTimeoutId) {
    clearTimeout(sigmaUltrasResumeTimeoutId);
    sigmaUltrasResumeTimeoutId = null;
  }

  if (activeSigmaUltrasSound && activeSigmaUltrasSound !== targetSound) {
    activeSigmaUltrasSound.pause();
    activeSigmaUltrasSound.currentTime = 0;
  }

  targetSound.currentTime = 0;
  activeSigmaUltrasSound = targetSound;
  syncSigmaUltrasVolume();
  targetSound.play().catch(() => {});
}

function pauseSigmaUltrasAfterGoal() {
  if (!activeSigmaUltrasSound || activeSigmaUltrasSound.paused) return;

  const pausedSound = activeSigmaUltrasSound;
  const pausedHalf = state.half;
  const pausedTeam = state.selectedTeam;
  pausedSound.pause();

  if (sigmaUltrasResumeTimeoutId) {
    clearTimeout(sigmaUltrasResumeTimeoutId);
  }

  sigmaUltrasResumeTimeoutId = setTimeout(() => {
    sigmaUltrasResumeTimeoutId = null;
    if (!state.gameActive || gameOver || state.chantsVolume <= 0) return;
    if (state.selectedTeam !== pausedTeam) return;
    if (state.half !== pausedHalf || activeSigmaUltrasSound !== pausedSound) return;
    syncSigmaUltrasVolume();
    pausedSound.play().catch(() => {});
  }, GOAL_CHANT_PAUSE_MS);
}

function createSettingSlider(label, options) {
  const wrapper = document.createElement("div");
  wrapper.className = "settings-control";

  const titleRow = document.createElement("div");
  titleRow.className = "settings-control-title";

  const labelEl = document.createElement("span");
  labelEl.textContent = label;

  const valueEl = document.createElement("strong");
  titleRow.appendChild(labelEl);
  titleRow.appendChild(valueEl);

  const input = document.createElement("input");
  input.type = "range";
  input.min = String(options.min);
  input.max = String(options.max);
  input.step = String(options.step);
  input.value = String(options.value);
  input.className = "settings-slider";

  const refreshValue = () => {
    const numericValue = Number(input.value);
    valueEl.textContent = options.format(numericValue);
    options.onChange(numericValue);
  };

  input.addEventListener("input", refreshValue);
  refreshValue();

  wrapper.appendChild(titleRow);
  wrapper.appendChild(input);
  return wrapper;
}

function showSettingsMenu() {
  setMenu("Nastavení", "Uprav hlasitost zvuků, chorálů a rychlost míče.", [
    { label: "Zpět", secondary: true, onClick: showMainMenu },
  ]);

  const controls = document.createElement("div");
  controls.className = "settings-controls";

  controls.appendChild(
    createSettingSlider("Hlasitost zvuků", {
      min: 0,
      max: 1,
      step: 0.01,
      value: state.soundVolume,
      format: (v) => `${Math.round(v * 100)} %`,
      onChange: (v) => {
        state.soundVolume = v;
        syncSigmaUltrasVolume();
        persistSettingsToStorage();
      },
    }),
  );

  controls.appendChild(
    createSettingSlider("Hlasitost chorálů", {
      min: 0,
      max: 1,
      step: 0.01,
      value: state.chantsVolume,
      format: (v) => `${Math.round(v * 100)} %`,
      onChange: (v) => {
        state.chantsVolume = v;
        syncSigmaUltrasVolume();
        if (v <= 0) stopSigmaUltrasChant();
        persistSettingsToStorage();
      },
    }),
  );

  controls.appendChild(
    createSettingSlider("Rychlost míče", {
      min: 0.6,
      max: 1.8,
      step: 0.05,
      value: state.ballSpeedMultiplier,
      format: (v) => `${v.toFixed(2)}x`,
      onChange: (v) => {
        state.ballSpeedMultiplier = v;
        persistSettingsToStorage();
      },
    }),
  );

  menuButtonsEl.prepend(controls);
}

function showMainMenu() {
  state.gameActive = false;
  stopSigmaUltrasChant();
  state.goalPaused = false;
  hideHalftimeOverlay();
  hideFulltimeOverlay();
  goalOverlayEl.classList.add("hidden");
  gameViewEl.classList.add("hidden");
  menuEl.classList.remove("hidden");

  setMenu("Hlavní menu", "Vyber co chceš dělat.", [
    { label: "Hrát hru", onClick: showPlayMenu },

    {
      label: "Nastavení",
      onClick: showSettingsMenu,
    },
  ]);
}

function showPlayMenu() {
  setMenu("Hrát hru", "Vyber herní režim.", [
    { label: "Hrát proti AI", onClick: showDifficultyMenu },
    {
      label: "Hrát online",
      onClick: () =>
        setMenu("Hrát online", "Online režim zatím není hotový.", [
          { label: "Zpět", secondary: true, onClick: showPlayMenu },
        ]),
    },
    { label: "Zpět", secondary: true, onClick: showMainMenu },
  ]);
}

function showDifficultyMenu() {
  setMenu("Obtížnost", "Vyber sílu AI soupeře.", [
    { label: "Lehká", onClick: () => { state.aiPreset = AI_PRESETS.easy; showPlayerTeamMenu(); } },
    { label: "Střední", onClick: () => { state.aiPreset = AI_PRESETS.medium; showPlayerTeamMenu(); } },
    { label: "Těžká", onClick: () => { state.aiPreset = AI_PRESETS.hard; showPlayerTeamMenu(); } },
    { label: "Extrémní", onClick: () => { state.aiPreset = AI_PRESETS.extreme; showPlayerTeamMenu(); } },
    { label: "Zpět", secondary: true, onClick: showPlayMenu },
  ]);
}

function getMenuLogoClassByTeam(teamName) {
  if (teamName === "Viktoria Plzeň") return "menu-team-logo menu-team-logo--viktoria";
  if (teamName === "Mladá Boleslav") return "menu-team-logo menu-team-logo--mlada";
  return "menu-team-logo";
}

function createTeamButtons(onSelect) {
  return TEAMS.map((team) => ({
    label: team,
    logoSrc: getTeamMenuButtonLogo(team),
    logoFallbackSrc: getFallbackTeamLogo(team),
    logoClassName: getMenuLogoClassByTeam(team),
    onClick: () => onSelect(team),
  }));
}

function showPlayerTeamMenu() {
  setMenu("Tvůj tým", `Obtížnost: ${state.aiPreset.label}. Vyber svůj tým.`, [
    ...createTeamButtons((team) => {
      state.selectedTeam = team;
      showAiTeamMenu();
    }),
    { label: "Zpět", secondary: true, onClick: showDifficultyMenu },
  ]);
}

function showAiTeamMenu() {
  setMenu("Tým pro AI", `Tvůj tým: ${state.selectedTeam}. Vyber tým AI soupeře.`, [
    ...createTeamButtons(async (team) => {
      state.aiTeam = team;
      await Promise.all([setSelectedTeamLogo(state.selectedTeam), setAiTeamLogo(team)]);
      startGame();
    }),
    { label: "Zpět", secondary: true, onClick: showPlayerTeamMenu },
  ]);
}

function getTeamInitials(teamName) {
  return teamName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join("")
    .slice(0, 3);
}

function getFallbackTeamLogo(teamName) {
  const initials = getTeamInitials(teamName);
  const baseColor = getPlayerColorByTeam(teamName);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${baseColor}'/><stop offset='100%' stop-color='#1f1f1f'/></linearGradient></defs><circle cx='36' cy='36' r='34' fill='url(#g)' stroke='white' stroke-width='2'/><text x='36' y='42' text-anchor='middle' font-size='24' font-family='Calm Font,Trebuchet MS,Arial,sans-serif' font-weight='700' fill='white'>${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getTeamMenuButtonLogo(teamName) {
  const candidates = TEAM_LOGO_CANDIDATES[teamName] || [];
  return candidates[0] || getFallbackTeamLogo(teamName);
}

function setScoreboardTeamLogo(imgEl, teamName) {
  if (!imgEl) return;
  const logoSrc = getTeamMenuButtonLogo(teamName);
  const fallbackSrc = getFallbackTeamLogo(teamName);
  imgEl.src = logoSrc;
  imgEl.alt = `Logo týmu ${teamName}`;
  imgEl.onerror = () => {
    if (imgEl.src !== fallbackSrc) {
      imgEl.src = fallbackSrc;
      return;
    }
    imgEl.onerror = null;
  };
}

function loadImageFromCandidates(candidates) {
  return new Promise((resolve) => {
    if (!candidates || candidates.length === 0) {
      resolve(null);
      return;
    }

    let i = 0;
    const tryNext = () => {
      if (i >= candidates.length) {
        resolve(null);
        return;
      }

      const img = new Image();
      const src = candidates[i++];
      img.onload = () => resolve(img);
      img.onerror = tryNext;
      img.src = src;
    };

    tryNext();
  });
}

async function setSelectedTeamLogo(teamName) {
  state.selectedTeamLogo = await loadImageFromCandidates([
    ...(TEAM_LOGO_CANDIDATES[teamName] || []),
    getFallbackTeamLogo(teamName),
  ]);
}

async function setAiTeamLogo(teamName) {
  state.aiTeamLogo = await loadImageFromCandidates([
    ...(TEAM_LOGO_CANDIDATES[teamName] || []),
    getFallbackTeamLogo(teamName),
  ]);
}

function showFulltimeOverlay(winnerLabel) {
  fulltimeScoreEl.textContent = `${leftScore} : ${rightScore}`;
  fulltimeWinnerEl.textContent = winnerLabel === "Remíza" ? "Remíza" : `Vyhrává ${winnerLabel}`;
  fulltimeOverlayEl.classList.remove("hidden");
}

function hideFulltimeOverlay() {
  fulltimeOverlayEl.classList.add("hidden");
}

function updateHalftimeScore() {
  halftimeScoreEl.textContent = `${leftScore} : ${rightScore}`;
}

function showHalftimeOverlay() {
  state.halfTimePaused = true;
  playRefWhistle();
  ball.vx = 0;
  ball.vy = 0;
  updateHalftimeScore();
  halftimeOverlayEl.classList.remove("hidden");
}

function hideHalftimeOverlay() {
  state.halfTimePaused = false;
  halftimeOverlayEl.classList.add("hidden");
}

function startSecondHalf() {
  if (!state.gameActive || gameOver || state.half !== 1) return;
  playRefWhistle();
  hideHalftimeOverlay();
  state.half = 2;
  state.timeLeft = HALF_DURATION;
  messageEl.textContent = "Začal 2. poločas!";
  updateMatchInfo();
  resetPositions();
  playSigmaUltrasForHalf(2);
}

function resetPositions() {
  player.x = canvas.width / 2;
  player.y = canvas.height * 0.8;
  ai.x = canvas.width / 2;
  ai.y = canvas.height * 0.2;
  dragState.targetX = player.x;
  dragState.targetY = player.y;
  aiBrain.targetX = ai.x;
  aiBrain.targetY = ai.y;
  aiBrain.frame = 0;

  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  const direction = Math.random() < 0.5 ? -1 : 1;
  ball.vy = direction * (3.1 + Math.random() * 1.5);
  ball.vx = (Math.random() - 0.5) * 3.2;
}

function resetMatch() {
  leftScore = 0;
  rightScore = 0;
  gameOver = false;
  state.goalPaused = false;
  stopSigmaUltrasChant();
  hideHalftimeOverlay();
  hideFulltimeOverlay();
  state.half = 1;
  state.timeLeft = HALF_DURATION;
  state.confetti = [];
  messageEl.textContent = "";
  goalOverlayEl.classList.add("hidden");
  updateScore();
  updateMatchInfo();
  resetPositions();
}

function startGame() {
  playRefWhistle();
  menuEl.classList.add("hidden");
  gameViewEl.classList.remove("hidden");
  state.gameActive = true;
  player.color = getPlayerColorByTeam(state.selectedTeam);
  ai.color = getPlayerColorByTeam(state.aiTeam);
  leftTeamNameEl.textContent = state.selectedTeam;
  rightTeamNameEl.textContent = `${state.aiTeam} (AI)`;
  setScoreboardTeamLogo(leftTeamLogoEl, state.selectedTeam);
  setScoreboardTeamLogo(rightTeamLogoEl, state.aiTeam);
  state.lastFrameTime = performance.now();
  resetMatch();
  playSigmaUltrasForHalf(1);
}

function updateScore() {
  leftScoreEl.textContent = leftScore;
  rightScoreEl.textContent = rightScore;
}

function toCanvasCoords(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
}

function updatePlayerFromDrag() {
  if (!dragState.active) return;
  const dx = dragState.targetX - player.x;
  const dy = dragState.targetY - player.y;
  player.x += clamp(dx, -PLAYER_SPEED, PLAYER_SPEED);
  player.y += clamp(dy, -PLAYER_SPEED, PLAYER_SPEED);
  player.x = clamp(player.x, player.radius, canvas.width - player.radius);
  player.y = clamp(player.y, canvas.height / 2 + player.radius, canvas.height - player.radius);
}

function moveAI() {
  aiBrain.frame += 1;
  if (aiBrain.frame >= state.aiPreset.reactionFrames) {
    aiBrain.frame = 0;
    aiBrain.targetX = ball.x;
    aiBrain.targetY = ball.y < canvas.height / 2 ? ball.y : canvas.height * 0.25;
  }

  const dx = aiBrain.targetX - ai.x;
  const dy = aiBrain.targetY - ai.y;

  ai.x += clamp(dx, -state.aiPreset.speed, state.aiPreset.speed);
  ai.y += clamp(dy, -state.aiPreset.speed, state.aiPreset.speed);
  ai.x = clamp(ai.x, ai.radius, canvas.width - ai.radius);
  ai.y = clamp(ai.y, ai.radius, canvas.height / 2 - ai.radius);
}

function resolveCollision(paddle) {
  const dx = ball.x - paddle.x;
  const dy = ball.y - paddle.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = ball.radius + paddle.radius;
  if (distance < minDistance) {
    const safeDistance = distance || 0.001;
    const nx = dx / safeDistance;
    const ny = dy / safeDistance;
    const overlap = minDistance - distance;
    ball.x += nx * overlap;
    ball.y += ny * overlap;
    const relativeSpeed = ball.vx * nx + ball.vy * ny;
    if (relativeSpeed < 0) {
      ball.vx -= 2 * relativeSpeed * nx;
      ball.vy -= 2 * relativeSpeed * ny;
    }
    ball.vx += nx * 0.72;
    ball.vy += ny * 0.72;
    playRandomKickSound();
  }
}

function spawnGoalConfetti() {
  const colors = ["#ff5252", "#ffd740", "#40c4ff", "#69f0ae", "#ff80ab", "#ffffff"];
  for (let i = 0; i < 90; i += 1) {
    state.confetti.push({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 120,
      y: canvas.height * 0.45 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 5,
      vy: -2 - Math.random() * 4,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      spin: (Math.random() - 0.5) * 0.3,
      angle: Math.random() * Math.PI * 2,
    });
  }
}

function updateConfetti(deltaSec) {
  state.confetti = state.confetti.filter((p) => p.life > 0);
  state.confetti.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 7.5 * deltaSec;
    p.life -= 0.85 * deltaSec;
    p.angle += p.spin;
  });
}

function drawConfetti() {
  state.confetti.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });
}

function triggerGoalPause() {
  state.goalPaused = true;
  ball.vx = 0;
  ball.vy = 0;

  goalOverlayEl.classList.remove("hidden");
  spawnGoalConfetti();

  setTimeout(() => {
    state.goalPaused = false;
    goalOverlayEl.classList.add("hidden");
    if (!gameOver && state.gameActive) resetPositions();
  }, GOAL_PAUSE_MS);
}

function endMatch() {
  gameOver = true;
  stopSigmaUltrasChant();
  playFinalWhistle();
  const winner = leftScore === rightScore ? "Remíza" : leftScore > rightScore ? state.selectedTeam : state.aiTeam;
  showFulltimeOverlay(winner);
  messageEl.textContent = "";
}

function updateMatchClock(deltaSec) {
  if (gameOver || state.goalPaused || state.halfTimePaused) return;

  state.timeLeft -= deltaSec;
  if (state.timeLeft > 0) {
    updateMatchInfo();
    return;
  }

  if (state.half < TOTAL_HALVES) {
    state.timeLeft = 0;
    showHalftimeOverlay();
    messageEl.textContent = "Konec 1. poločasu.";
  } else {
    state.timeLeft = 0;
    endMatch();
  }

  updateMatchInfo();
}

function updateBall() {
  ball.x += ball.vx * state.ballSpeedMultiplier;
  ball.y += ball.vy * state.ballSpeedMultiplier;
  ball.vx *= FRICTION;
  ball.vy *= FRICTION;

  const { goalLeft, goalRight } = getGoalBounds();
  const inGoalChannel = ball.x > goalLeft && ball.x < goalRight;
  const goalLineTop = 0;
  const goalLineBottom = canvas.height;
  const postYTop = 8 - POST_RADIUS;
  const postYBottom = canvas.height - 8 + POST_RADIUS;

  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.vx *= -1;
    ball.x = clamp(ball.x, ball.radius, canvas.width - ball.radius);
  }

  resolveCollision(player);
  resolveCollision(ai);

  resolvePostCollision(goalLeft, postYTop);
  resolvePostCollision(goalRight, postYTop);
  resolvePostCollision(goalLeft, postYBottom);
  resolvePostCollision(goalRight, postYBottom);

  if (ball.y + ball.radius < goalLineTop && inGoalChannel) {
    leftScore += 1;
    scorePoint();
    return;
  }

  if (ball.y - ball.radius > goalLineBottom && inGoalChannel) {
    rightScore += 1;
    scorePoint();
    return;
  }

  if (ball.y - ball.radius <= goalLineTop && !inGoalChannel) {
    ball.vy *= -1;
    ball.y = goalLineTop + ball.radius;
  }

  if (ball.y + ball.radius >= goalLineBottom && !inGoalChannel) {
    ball.vy *= -1;
    ball.y = goalLineBottom - ball.radius;
  }
}

function scorePoint() {
  updateScore();
  messageEl.textContent = "GOAL!";
  playGoalCheerSound();
  pauseSigmaUltrasAfterGoal();
  triggerGoalPause();
}

function drawGoal(x, y, width, depth, isTop) {
  const sign = isTop ? -1 : 1;
  ctx.fillStyle = "rgba(16, 80, 36, 0.78)";
  ctx.fillRect(x, y + sign * depth, width, depth);
  ctx.strokeStyle = "rgba(220, 250, 220, 0.92)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + sign * depth);
  ctx.lineTo(x + width, y + sign * depth);
  ctx.lineTo(x + width, y);
  ctx.stroke();

  const postY = y + sign * POST_RADIUS;
  ctx.fillStyle = "#f5f5f5";
  ctx.beginPath();
  ctx.arc(x, postY, POST_RADIUS, 0, Math.PI * 2);
  ctx.arc(x + width, postY, POST_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const stripeCountPerHalf = 6;
  const halfHeight = canvas.height / 2;

  for (let i = 0; i < stripeCountPerHalf; i += 1) {
    const stripeTop = Math.round((i / stripeCountPerHalf) * halfHeight);
    const stripeBottom = Math.round(((i + 1) / stripeCountPerHalf) * halfHeight);
    const stripeHeight = stripeBottom - stripeTop;

    ctx.fillStyle = i % 2 === 0 ? "#1f9b3b" : "#238332";
    ctx.fillRect(0, stripeTop, canvas.width, stripeHeight);
    ctx.fillRect(0, halfHeight + stripeTop, canvas.width, stripeHeight);
  }

  const lineColor = "rgba(210, 245, 200, 0.82)";
  const halfY = canvas.height / 2;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 5;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

  ctx.beginPath();
  ctx.moveTo(8, halfY);
  ctx.lineTo(canvas.width - 8, halfY);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, halfY, 48, 0, Math.PI * 2);
  ctx.stroke();

  const boxWidth = canvas.width * 0.68;
  const boxX = (canvas.width - boxWidth) / 2;
  const bigBoxDepth = 86;
  const smallBoxDepth = 38;

  ctx.strokeRect(boxX, 8, boxWidth, bigBoxDepth);
  ctx.strokeRect(boxX + boxWidth * 0.22, 8, boxWidth * 0.56, smallBoxDepth);

  ctx.strokeRect(boxX, canvas.height - 8 - bigBoxDepth, boxWidth, bigBoxDepth);
  ctx.strokeRect(
    boxX + boxWidth * 0.22,
    canvas.height - 8 - smallBoxDepth,
    boxWidth * 0.56,
    smallBoxDepth,
  );

  ctx.beginPath();
  ctx.arc(canvas.width / 2, 8 + bigBoxDepth, 34, 0, Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height - 8 - bigBoxDepth, 34, Math.PI, Math.PI * 2);
  ctx.stroke();

  const cornerR = 24;
  ctx.beginPath();
  ctx.arc(8, 8, cornerR, 0, Math.PI / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width - 8, 8, cornerR, Math.PI / 2, Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(8, canvas.height - 8, cornerR, -Math.PI / 2, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width - 8, canvas.height - 8, cornerR, Math.PI, Math.PI * 1.5);
  ctx.stroke();

  const { goalLeft, goalWidth } = getGoalBounds();
  drawGoal(goalLeft, 8, goalWidth, 26, true);
  drawGoal(goalLeft, canvas.height - 8, goalWidth, 26, false);
}

function drawCircle(entity, logoImage = null, logoScale = { x: 1, y: 1 }, borderColor = null, splitColors = null) {
  if (splitColors) {
    const angle = ((splitColors.angleDeg || 0) * Math.PI) / 180;
    const parts = Array.isArray(splitColors.parts) && splitColors.parts.length > 0
      ? splitColors.parts
      : [splitColors.left, splitColors.right].filter(Boolean);

    ctx.save();
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.translate(entity.x, entity.y);
    if (angle !== 0) ctx.rotate(angle);

    if (parts.length === 0) {
      ctx.fillStyle = entity.color;
      ctx.fillRect(-entity.radius, -entity.radius, entity.radius * 2, entity.radius * 2);
    } else {
      const stripeWidth = (entity.radius * 2) / parts.length;
      parts.forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.fillRect(-entity.radius + stripeWidth * index, -entity.radius, stripeWidth, entity.radius * 2);
      });
    }

    ctx.restore();
  } else {
    ctx.fillStyle = entity.color;
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, entity.radius - 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
    ctx.clip();

    const width = entity.radius * 2 * logoScale.x;
    const height = entity.radius * 2 * logoScale.y;
    ctx.drawImage(logoImage, entity.x - width / 2, entity.y - height / 2, width, height);
    ctx.restore();
  }

  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.arc(entity.x - entity.radius * 0.3, entity.y - entity.radius * 0.3, entity.radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

function drawSoccerBall() {
  const r = ball.radius;
  ctx.save();
  ctx.translate(ball.x, ball.y);

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  if (ballSprite && ballSprite.complete && ballSprite.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();

    const logoSize = r * 2;
    ctx.drawImage(ballSprite, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
    ctx.restore();
  }

  ctx.restore();
}

function draw() {
  drawField();
  drawSoccerBall();
  drawCircle(
    player,
    state.selectedTeamLogo,
    getPlayerLogoScaleByTeam(state.selectedTeam),
    getPlayerBorderColorByTeam(state.selectedTeam),
    getPlayerSplitColorsByTeam(state.selectedTeam),
  );
  drawCircle(
    ai,
    state.aiTeamLogo,
    getPlayerLogoScaleByTeam(state.aiTeam),
    getPlayerBorderColorByTeam(state.aiTeam),
    getPlayerSplitColorsByTeam(state.aiTeam),
  );
  drawConfetti();
}

function gameLoop(now) {
  const deltaSec = Math.min(0.05, Math.max(0, (now - state.lastFrameTime) / 1000));
  state.lastFrameTime = now;

  if (state.gameActive) {
    updateConfetti(deltaSec);

    if (!gameOver && !state.goalPaused && !state.halfTimePaused) {
      updateMatchClock(deltaSec);
      updatePlayerFromDrag();
      moveAI();
      updateBall();
    } else if (!gameOver && (state.goalPaused || state.halfTimePaused)) {
      updateMatchInfo();
    }

    draw();
  }

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("pointerdown", (event) => {
  if (!state.gameActive || dragState.active) return;
  canvas.setPointerCapture(event.pointerId);
  const coords = toCanvasCoords(event);
  dragState.active = true;
  dragState.pointerId = event.pointerId;
  dragState.targetX = coords.x;
  dragState.targetY = coords.y;
  canvas.classList.add("dragging");
  event.preventDefault();
});

canvas.addEventListener("pointermove", (event) => {
  if (!state.gameActive || !dragState.active || event.pointerId !== dragState.pointerId) return;
  const coords = toCanvasCoords(event);
  dragState.targetX = coords.x;
  dragState.targetY = coords.y;
  event.preventDefault();
});

function stopDrag(pointerId) {
  if (!dragState.active || pointerId !== dragState.pointerId) return;
  dragState.active = false;
  dragState.pointerId = null;
  canvas.classList.remove("dragging");
}

canvas.addEventListener("pointerup", (event) => {
  stopDrag(event.pointerId);
  event.preventDefault();
});
canvas.addEventListener("pointercancel", (event) => stopDrag(event.pointerId));

resetBtn.addEventListener("click", () => {
  const wantsNewMatch = window.confirm("Opravdu chceš začít nový zápas?");
  if (!wantsNewMatch) return;

  resetMatch();
  playRefWhistle();
  playSigmaUltrasForHalf(1);
});

backToMenuBtn.addEventListener("click", showMainMenu);
startSecondHalfBtn.addEventListener("click", startSecondHalf);

initBallSprite();
initKickSounds();
initRefWhistleSound();
initFinalWhistleSound();
initPostSound();
initGoalCheerSound();
initSigmaUltrasSounds();
loadSettingsFromStorage();
showMainMenu();
state.lastFrameTime = performance.now();
requestAnimationFrame(gameLoop);
