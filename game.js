import { IMAGES, NARRATION, DATA } from './data.js';
import { BattleSystem } from './battle.js';
import { SceneRenderer } from './renderer.js';

const GameEngine = {
    state: { scene: 'intro', hero: null, enemy: null, difficulty: 'apprentice', soundEnabled: false },
    onVideoEnd: null, 

    init() { 
        // Attach helpers to DOM elements
        this.attachGlobalListeners();
        // Show Intro Scene immediately
        this.updateScene('intro');
    },

    attachGlobalListeners() {
        document.getElementById('video-play-btn').onclick = () => this.forcePlayVideo();
        document.getElementById('video-skip-btn').onclick = () => this.skipVideo();
        document.getElementById('back-btn').onclick = () => this.back();
        document.getElementById('global-mute-btn').onclick = () => this.toggleSound();
        document.getElementById('close-share-btn').onclick = () => this.toggleShare(false);
    },

    refreshArt() {
        Object.keys(IMAGES).forEach(key => {
            IMAGES[key] = IMAGES[key].map(url => {
                if (url.includes('pollinations.ai')) {
                    const newSeed = Math.floor(Math.random() * 9999);
                    return url.replace(/seed=\d+/, `seed=${newSeed}`);
                }
                return url;
            });
        });
        this.updateBg();
    },
    
    toggleShare(show) {
        const overlay = document.getElementById('share-overlay');
        const content = document.getElementById('share-content');
        if (show) { overlay.classList.remove('opacity-0', 'pointer-events-none'); content.classList.remove('scale-95'); content.classList.add('scale-100'); } 
        else { overlay.classList.add('opacity-0', 'pointer-events-none'); content.classList.remove('scale-100'); content.classList.add('scale-95'); }
    },

    // --- AUDIO TOGGLE ---
    toggleSound() {
        this.state.soundEnabled = !this.state.soundEnabled;
        const vid = document.getElementById('game-video');
        const bgAudio = document.getElementById('bg-player');
        
        // 1. Handle Video
        if(vid) {
            vid.muted = !this.state.soundEnabled;
        }
        
        // 2. Handle Background Music
        if (bgAudio) {
            if (this.state.soundEnabled) {
                bgAudio.volume = 0.15; // Play lightly in background
                bgAudio.play().catch(e => console.log("BG Audio play failed (interaction needed):", e));
            } else {
                bgAudio.pause();
            }
        }

        // 3. Handle Narration
        if (this.state.soundEnabled) {
            this.playNarrative(this.state.scene);
        } else {
            const narrativeAudio = document.getElementById('narrative-player');
            if(narrativeAudio) narrativeAudio.pause();
        }

        // 4. Update UI
        this.updateGlobalMuteIcon();
        if (this.state.scene === 'intro') this.renderCurrentScene(); // Update intro button
    },

    updateGlobalMuteIcon() {
        const icon = document.querySelector('#global-mute-btn i');
        if(icon) {
            icon.setAttribute('data-lucide', this.state.soundEnabled ? 'volume-2' : 'volume-x');
            window.lucide.createIcons();
        }
    },

    playNarrative(scene) {
        const audio = document.getElementById('narrative-player');
        if (!audio) return;
        audio.pause();
        
        const track = NARRATION[scene];
        if (track && this.state.soundEnabled) {
            audio.src = track;
            audio.play().catch(e => console.log("Audio play failed (interaction needed):", e));
        }
    },
    
    // --- CINEMATIC SYSTEM ---
    playCinematic(videoSrc, callback) {
        const overlay = document.getElementById('video-overlay');
        const video = document.getElementById('game-video');
        const btn = document.getElementById('video-play-btn');
        
        const audio = document.getElementById('narrative-player');
        if(audio) audio.pause();
        
        if (!overlay || !video) { if (callback) callback(); return; }

        this.onVideoEnd = callback;
        video.innerHTML = `<source src="${videoSrc}" type="video/mp4">`;
        video.load(); 
        video.muted = !this.state.soundEnabled;

        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10); 

        video.onended = () => this.skipVideo(); 
        video.onerror = () => { console.log("Video failed: " + videoSrc); this.skipVideo(); }

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.log("Autoplay prevented:", err);
                btn.classList.remove('hidden');
            });
        }
    },

    forcePlayVideo() {
        const video = document.getElementById('game-video');
        const btn = document.getElementById('video-play-btn');
        if (video) {
            video.muted = !this.state.soundEnabled; 
            video.play();
        }
        if (btn) btn.classList.add('hidden');
    },

    skipVideo() {
        const overlay = document.getElementById('video-overlay');
        const video = document.getElementById('game-video');
        
        if (video) video.pause();
        if (overlay) {
            overlay.classList.add('opacity-0');
            setTimeout(() => {
                overlay.classList.add('hidden');
                if (this.onVideoEnd) {
                    const cb = this.onVideoEnd;
                    this.onVideoEnd = null; 
                    cb();
                }
            }, 500); 
        }
    },

    updateScene(scene) {
        // Intercept transitions for cinematics
        if (scene === 'combat' && this.state.scene === 'monster_intro') {
            this.playCinematic('middle-vid.mp4', () => this._performSceneUpdate(scene));
            return;
        }
        if (scene === 'town' && this.state.scene === 'traveler') {
            this.playCinematic('final-vid.mp4', () => this._performSceneUpdate(scene));
            return;
        }
        this._performSceneUpdate(scene);
    },

    _performSceneUpdate(scene) {
        const el = document.getElementById('scene-container');
        const bg = document.getElementById('background-layer');
        const ui = document.getElementById('top-ui');
        el.style.opacity = '0';
        
        setTimeout(() => {
            this.state.scene = scene;
            
            if(scene === 'combat') {
                bg.classList.add('opacity-0');
                ui.classList.add('hidden');
                // Pass a callback to know when battle ends
                BattleSystem.init(this.state.hero, this.state.enemy, (win) => {
                    this.updateScene(win ? 'traveler' : 'game_over');
                });
            } else {
                bg.classList.remove('opacity-0');
                ui.classList.toggle('hidden', scene === 'intro' || scene === 'difficulty');
                this.renderCurrentScene();
                this.updateBg();
            }
            el.style.opacity = '1';
            this.playNarrative(scene);
        }, 300);
    },

    renderCurrentScene() {
        const s = this.state.scene;
        const renderer = SceneRenderer[s];
        if (renderer) {
            const args = [];
            if (s === 'intro') args.push(this.state.soundEnabled);
            if (s === 'hero_confirm') args.push(this.state.hero);
            if (s === 'monster_intro') args.push(this.state.enemy);
            
            document.getElementById('scene-container').innerHTML = renderer(...args);
            window.lucide.createIcons();
        }
    },

    updateBg() {
        let key = this.state.scene;
        if (key === 'hero_confirm') key = this.state.hero.name === 'Warrior' ? 'warrior_bg' : 'wizard_bg';
        else if (key === 'monster_intro') key = this.state.enemy.bg; 
        
        const list = IMAGES[key] || IMAGES.intro;
        const url = list[0];
        const bg = document.getElementById('bg-image');
        const loader = document.getElementById('bg-loader');

        loader.classList.remove('opacity-0', 'pointer-events-none');
        bg.classList.add('opacity-0');
        
        const img = new Image();
        img.src = url;
        img.onload = () => { bg.src = url; loader.classList.add('opacity-0', 'pointer-events-none'); bg.classList.replace('opacity-0', 'opacity-70'); };
        img.onerror = () => { loader.classList.add('opacity-0', 'pointer-events-none'); bg.src = ''; }; 
    },

    home() { this.state.hero = null; this.updateScene('intro'); },
    
    start() { 
        this.playCinematic('start-vid.mp4', () => {
            this.updateScene('difficulty');
        });
    },
    
    back() {
        const s = this.state.scene;
        if(s === 'difficulty') this.home();
        else if(s === 'char_select') this.updateScene('difficulty');
        else if(s === 'hero_confirm') this.updateScene('char_select');
        else if(s === 'path_select') this.updateScene('hero_confirm');
        else if(s === 'monster_intro') this.updateScene('path_select');
        else if(s === 'traveler') this.updateScene('path_select');
        else if(s === 'town') this.updateScene('traveler');
        else if(s === 'game_over') this.home();
    },

    setDifficulty(diff) {
        this.state.difficulty = diff;
        this.updateScene('char_select');
    },

    selectHero(k) { this.state.hero = DATA[k]; this.updateScene('hero_confirm'); },
    confirmHero() { this.updateScene('path_select'); },
    
    selectPath(p) { 
        let enemy = {...DATA[p === 'forest' ? 'ogre' : 'troll']};
        const diff = this.state.difficulty;
        if(diff === 'novice') {
            enemy.max = Math.floor(enemy.max * 0.8);
            enemy.dmgMod = Math.max(0, enemy.dmgMod - 1);
            enemy.level = enemy.level - 1; 
        } else if (diff === 'master') {
            enemy.max = Math.floor(enemy.max * 1.5);
            enemy.ac = enemy.ac + 1;
            enemy.dmgMod = enemy.dmgMod + 2;
            enemy.name = "Elder " + enemy.name; 
            enemy.level = enemy.level + 2; 
        }
        this.state.enemy = enemy;
        this.updateScene('monster_intro'); 
    }
};

// --- CRITICAL: ATTACH TO WINDOW ---
// This allows the HTML 'onclick="game.start()"' attributes to work
window.game = GameEngine;
window.battle = BattleSystem;

// Initialize
window.onload = () => GameEngine.init();