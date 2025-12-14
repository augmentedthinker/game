import { IMAGES } from './data.js';

export const BattleSystem = {
    state: { hero: null, enemy: null, turn: 'player', phase: 'attack', lastCrit: false, isOver: false, heroWounded: false, enemyWounded: false, auto: false, skipped: false },
    onComplete: null, // Callback for when battle ends

    init(heroData, enemyData, onCompleteCallback) {
        this.onComplete = onCompleteCallback;
        this.state = {
            hero: { ...heroData, currentHp: heroData.max },
            enemy: { ...enemyData, currentHp: enemyData.max },
            turn: 'player', phase: 'attack', lastCrit: false, isOver: false,
            heroWounded: false, enemyWounded: false, auto: false, skipped: false
        };
        
        // Preload wounded images immediately
        const preloadHero = new Image(); preloadHero.src = IMAGES[heroData.wounded_bg][0];
        const preloadEnemy = new Image(); preloadEnemy.src = IMAGES[enemyData.wounded_bg][0];

        this.renderBattleInterface();
        this.updateUI();
        this.setTurnUI('player', 'attack');
        this.log("Roll D20 to attack!", "text-yellow-400");
        window.lucide.createIcons();
    },

    startFight() {
        const el = document.getElementById('vs-overlay');
        if(el) {
            el.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => el.remove(), 500);
        }
    },

    renderBattleInterface() {
        const container = document.getElementById('scene-container');
        container.innerHTML = `
        <div id="battle-frame" class="relative w-full max-w-[420px] h-[80vh] md:h-[90vh] bg-slate-950 shadow-2xl flex flex-col overflow-hidden rounded-[2rem] border-[4px] border-slate-800 ring-1 ring-white/10 lg:rounded-[3rem] lg:border-[8px] animate-in fade-in zoom-in duration-500">
            
            <div id="vs-overlay" onclick="battle.startFight()" class="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm transition-all duration-500 hover:bg-black/70">
                <h1 class="text-9xl font-black text-red-600 font-old animate-pulse drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] scale-150 transform mb-4">VS</h1>
                <p class="text-white/90 font-sans text-lg tracking-[0.5em] font-bold animate-bounce border border-white/20 px-6 py-2 rounded-full bg-white/5">TAP TO FIGHT</p>
            </div>

            <div class="h-[55%] w-full flex relative bg-slate-900">
                <div id="hero-panel" class="split-panel active-turn border-r-4 border-slate-900">
                    <div class="absolute inset-0 flex items-center justify-center bg-slate-900 z-20 transition-opacity duration-300" id="hero-loader">
                        <div class="flex flex-col items-center gap-2"><i data-lucide="loader-2" class="w-8 h-8 text-blue-500 animate-spin"></i><span class="text-xs text-blue-500 font-bold uppercase tracking-widest">Summoning Hero</span></div>
                    </div>
                    <img id="hero-img" src="${IMAGES[this.state.hero.bg][0]}" class="split-image opacity-0 transition-opacity duration-700" alt="Hero">
                    <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 flex flex-col z-10">
                        <div class="flex justify-between items-end">
                            <div><div class="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Lvl ${this.state.hero.level} Hero</div><span class="text-xl font-bold text-blue-100 text-glow tracking-wider">${this.state.hero.name.toUpperCase()}</span></div>
                            <span id="hero-hp-text" class="text-xl font-bold text-white text-glow">${this.state.hero.currentHp}</span>
                        </div>
                        <div class="hp-track h-4 border-2"><div id="hero-bar" class="hp-fill bg-blue-600" style="width: 100%"></div></div>
                    </div>
                </div>
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none opacity-50"><span class="text-4xl md:text-6xl font-black text-white italic text-glow drop-shadow-2xl" style="font-family: serif;">VS</span></div>
                <div id="enemy-panel" class="split-panel inactive-turn border-l-4 border-slate-900">
                    <div class="absolute inset-0 flex items-center justify-center bg-slate-900 z-20 transition-opacity duration-300" id="enemy-loader">
                        <div class="flex flex-col items-center gap-2"><i data-lucide="loader-2" class="w-8 h-8 text-red-500 animate-spin"></i><span class="text-xs text-red-500 font-bold uppercase tracking-widest">Summoning Enemy</span></div>
                    </div>
                    <img id="enemy-img" src="${IMAGES[this.state.enemy.bg][0]}" class="split-image opacity-0 transition-opacity duration-700" alt="Enemy">
                    <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 flex flex-col z-10">
                        <div class="flex justify-between items-end">
                            <div><div class="text-[10px] font-bold text-red-400 uppercase tracking-widest">Lvl ${this.state.enemy.level} Enemy</div><span class="text-xl font-bold text-red-100 text-glow tracking-wider">${this.state.enemy.name.toUpperCase()}</span></div>
                            <span id="enemy-hp-text" class="text-xl font-bold text-white text-glow">${this.state.enemy.currentHp}</span>
                        </div>
                        <div class="hp-track h-4 border-2"><div id="enemy-bar" class="hp-fill bg-red-600" style="width: 100%"></div></div>
                    </div>
                </div>
            </div>
            <div class="h-[45%] w-full bg-slate-900 border-t-4 border-slate-700 flex flex-col items-center p-2 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-20">
                <div class="w-full text-center mb-2">
                    <div id="turn-banner" class="inline-block mb-1 bg-yellow-600 text-black px-6 py-1 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg transition-colors duration-300">Your Turn</div>
                    <div id="log-text" class="text-xs md:text-sm text-slate-300 h-6 leading-6 truncate font-sans">Roll D20 to Attack!</div>
                </div>
                <div class="flex flex-wrap justify-center gap-2 mb-4 w-full px-2">
                    <div id="d4-btn" class="die-btn" onclick="battle.rollUserDie(4)"><svg viewBox="0 0 100 100" class="overflow-visible"><path d="M50 10 L90 80 H10 Z" class="die-shape" /><path d="M50 10 L50 60 L10 80 M50 60 L90 80" class="die-inner" /><text x="50" y="72" text-anchor="middle" class="die-text">4</text></svg></div>
                    <div id="d6-btn" class="die-btn" onclick="battle.rollUserDie(6)"><svg viewBox="0 0 100 100" class="overflow-visible"><path d="M20 30 L70 30 L70 80 L20 80 Z" class="die-shape" /><path d="M20 30 L40 10 L90 10 L70 30" class="die-shape" /><path d="M70 30 L90 10 L90 60 L70 80" class="die-shape" /><text x="45" y="60" text-anchor="middle" class="die-text">6</text></svg></div>
                    <div id="d8-btn" class="die-btn" onclick="battle.rollUserDie(8)"><svg viewBox="0 0 100 100" class="overflow-visible"><path d="M50 2 L95 50 L50 98 L5 50 Z" class="die-shape" /><path d="M50 2 L50 98 M5 50 L95 50" class="die-inner" /><text x="50" y="60" text-anchor="middle" class="die-text">8</text></svg></div>
                    <div id="d10-btn" class="die-btn" onclick="battle.rollUserDie(10)"><svg viewBox="0 0 100 100" class="overflow-visible"><path d="M50 2 L90 35 L50 98 L10 35 Z" class="die-shape" /><path d="M50 2 L50 98 M10 35 L50 65 L90 35" class="die-inner" /><text x="50" y="52" text-anchor="middle" class="die-text" style="font-size: 14px">10</text></svg></div>
                    <div id="d12-btn" class="die-btn" onclick="battle.rollUserDie(12)"><svg viewBox="0 0 100 100" class="overflow-visible"><path d="M50 5 L88 32 L73 78 L27 78 L12 32 Z" class="die-shape" /><path d="M50 25 L70 38 L63 60 H37 L30 38 Z" class="die-inner" fill="rgba(0,0,0,0.2)"/><path d="M50 5 L50 25 M88 32 L70 38 M73 78 L63 60 M27 78 L37 60 M12 32 L30 38" class="die-inner" /><text x="50" y="55" text-anchor="middle" class="die-text">12</text></svg></div>
                    <div id="d20-btn" class="die-btn die-active" onclick="battle.rollUserDie(20)"><svg viewBox="0 0 100 100" class="overflow-visible"><path d="M50 5 L92 28 L92 72 L50 95 L8 72 L8 28 Z" class="die-shape" /><path d="M28 35 L72 35 L50 75 Z" class="die-inner" stroke-width="1.5" /><path d="M50 5 L28 35" class="die-inner" /><path d="M50 5 L72 35" class="die-inner" /><path d="M92 28 L72 35" class="die-inner" /><path d="M92 72 L72 35" class="die-inner" /><path d="M92 72 L50 75" class="die-inner" /><path d="M50 95 L50 75" class="die-inner" /><path d="M8 72 L50 75" class="die-inner" /><path d="M8 72 L28 35" class="die-inner" /><path d="M8 28 L28 35" class="die-inner" /><path d="M8 28 L50 5" class="die-inner" /><text x="50" y="60" text-anchor="middle" class="die-text" style="font-size: 18px;">20</text></svg></div>
                </div>
                <div class="absolute bottom-4 left-4">
                        <button onclick="game.home()" class="text-slate-600 hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-bold">Flee</button>
                </div>
                <div class="absolute bottom-4 right-4 flex gap-2">
                        <button onclick="battle.toggleAuto()" id="auto-btn" class="text-slate-500 hover:text-yellow-400 transition-all text-xs uppercase tracking-widest font-bold border border-slate-700 px-3 py-1 rounded hover:bg-slate-800">Auto</button>
                        <button onclick="battle.skipFight()" class="text-slate-500 hover:text-blue-400 transition-all text-xs uppercase tracking-widest font-bold border border-slate-700 px-3 py-1 rounded hover:bg-slate-800">Skip</button>
                </div>
            </div>
        </div>`;

        // --- ROBUST IMAGE LOADING HANDLER ---
        const handleImageLoad = (imgId, loaderId) => {
            const img = document.getElementById(imgId);
            const loader = document.getElementById(loaderId);
            if(!img || !loader) return;
            const onLoaded = () => { img.classList.remove('opacity-0'); loader.classList.add('opacity-0', 'pointer-events-none'); };
            const onError = () => { loader.innerHTML = `<div class="flex flex-col items-center text-red-500"><i data-lucide="alert-triangle" class="w-8 h-8 mb-2"></i><span class="text-[10px] uppercase font-bold">Image Failed</span></div>`; window.lucide.createIcons(); };
            if (img.complete && img.naturalHeight !== 0) onLoaded();
            else { img.onload = onLoaded; img.onerror = onError; }
        };
        handleImageLoad('hero-img', 'hero-loader');
        handleImageLoad('enemy-img', 'enemy-loader');
    },
    
    toggleAuto() {
        if (this.state.isOver) return;
        this.state.auto = !this.state.auto;
        const btn = document.getElementById('auto-btn');
        if (this.state.auto) {
            btn.classList.add('auto-active', 'bg-yellow-900/20');
            if (this.state.turn === 'player') {
                // Trigger immediate roll if it's currently our turn
                if (this.state.phase === 'attack') this.rollUserDie(20);
                else if (this.state.phase === 'damage') this.rollUserDie(this.state.hero.dmgDie);
            }
        } else {
            btn.classList.remove('auto-active', 'bg-yellow-900/20');
        }
    },
    
    skipFight() {
        if (this.state.isOver) return;
        this.state.skipped = true;
        this.state.auto = false; // Stop auto logic from interfering
        
        // Simulate combat loop until someone dies
        while (this.state.hero.currentHp > 0 && this.state.enemy.currentHp > 0) {
            // Hero Turn
            let roll = Math.floor(Math.random() * 20) + 1;
            if (roll === 20 || (roll !== 1 && (roll + this.state.hero.ab >= this.state.enemy.ac))) {
                let dmg = Math.floor(Math.random() * this.state.hero.dmgDie) + 1 + this.state.hero.dmgMod;
                if (roll === 20) dmg += Math.floor(Math.random() * this.state.hero.dmgDie) + 1;
                this.state.enemy.currentHp -= dmg;
            }
            if (this.state.enemy.currentHp <= 0) break;

            // Enemy Turn
            roll = Math.floor(Math.random() * 20) + 1;
            if (roll !== 1 && (roll + this.state.enemy.ab >= this.state.enemy.ac)) {
                let dmg = Math.floor(Math.random() * this.state.enemy.dmgDie) + 1 + this.state.enemy.dmgMod;
                this.state.hero.currentHp -= dmg;
            }
        }

        // Finalize State
        this.state.hero.currentHp = Math.max(0, this.state.hero.currentHp);
        this.state.enemy.currentHp = Math.max(0, this.state.enemy.currentHp);
        this.updateUI();
        
        if (this.state.enemy.currentHp <= 0) {
            this.log("BATTLE SKIPPED: VICTORY!", "text-green-400");
            this.endGame(true);
        } else {
            this.log("BATTLE SKIPPED: DEFEAT", "text-red-500");
            this.endGame(false);
        }
    },

    rollUserDie(sides) {
        if (document.getElementById('vs-overlay') || this.state.skipped) return;
        if (this.state.isOver || this.state.turn !== 'player') return;
        if (this.state.phase === 'attack' && sides !== 20) return;
        if (this.state.phase === 'damage' && sides !== this.state.hero.dmgDie) return;

        this.animateDie(sides);
        
        const delay = this.state.auto ? 800 : 2000;
        
        setTimeout(() => {
            if (this.state.skipped) return;
            if (this.state.phase === 'attack') this.resolvePlayerAttack();
            else if (this.state.phase === 'damage') this.resolvePlayerDamage();
        }, delay); 
    },

    resolvePlayerAttack() {
        if (this.state.skipped) return;
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + this.state.hero.ab;
        const isCrit = roll === 20;
        const isMiss = roll === 1 || total < this.state.enemy.ac;

        if (!isMiss) {
            this.state.lastCrit = isCrit;
            this.log(isCrit ? `CRITICAL HIT! (Natural 20)` : `HIT! Rolled ${roll} + ${this.state.hero.ab} = ${total}`, 'text-green-400');
            this.state.phase = 'damage';
            this.setTurnUI('player', 'damage');
            
            if (this.state.auto && !this.state.skipped) {
                setTimeout(() => this.rollUserDie(this.state.hero.dmgDie), 800);
            }
        } else {
            this.log(`MISSED! Rolled ${roll} + ${this.state.hero.ab} = ${total} (vs AC ${this.state.enemy.ac})`, 'text-red-400');
            this.triggerMiss('enemy'); 
            setTimeout(() => {
                if(!this.state.skipped) this.startEnemyTurn();
            }, 2000); 
        }
    },

    resolvePlayerDamage() {
        if (this.state.skipped) return;
        let dmg = Math.floor(Math.random() * this.state.hero.dmgDie) + 1;
        if (this.state.lastCrit) dmg += Math.floor(Math.random() * this.state.hero.dmgDie) + 1; 
        dmg += this.state.hero.dmgMod;
        this.state.enemy.currentHp = Math.max(0, this.state.enemy.currentHp - dmg);
        this.triggerDamage('enemy', dmg); 
        this.updateUI();
        let msg = `DEALT ${dmg} DAMAGE! (Rolled ${dmg - this.state.hero.dmgMod}`; 
        if(this.state.lastCrit) msg += ` (Crit)`;
        msg += ` + ${this.state.hero.dmgMod})`;
        this.log(msg, 'text-white');
        if (this.state.enemy.currentHp <= 0) setTimeout(() => { if(!this.state.skipped) this.endGame(true); }, 3500);
        else this.startEnemyTurn();
    },

    startEnemyTurn() {
        if (this.state.skipped || this.state.isOver) return;
        this.state.turn = 'enemy';
        this.setTurnUI('enemy', 'wait');
        this.log(`${this.state.enemy.name} prepares to attack...`, "text-red-500");
        
        // Faster enemy turns if auto is on
        const stepDelay = this.state.auto ? 800 : 2000;
        const animDelay = this.state.auto ? 500 : 1000;

        setTimeout(() => { 
            if (this.state.skipped) return;
            this.animateDie(20); 
            setTimeout(() => {
                if (this.state.skipped) return;
                const roll = Math.floor(Math.random() * 20) + 1;
                const total = roll + this.state.enemy.ab;
                const isHit = !((roll === 1) || (total < this.state.hero.ac));
                if (isHit) {
                    this.log(`ENEMY HITS! Rolled ${roll} + ${this.state.enemy.ab} = ${total}`, 'text-red-400');
                    setTimeout(() => {
                        if (this.state.skipped) return;
                        this.animateDie(this.state.enemy.dmgDie);
                        setTimeout(() => {
                            if (this.state.skipped) return;
                            let dmg = Math.floor(Math.random() * this.state.enemy.dmgDie) + 1;
                            dmg += this.state.enemy.dmgMod;
                            this.state.hero.currentHp = Math.max(0, this.state.hero.currentHp - dmg);
                            this.triggerDamage('hero', dmg); 
                            this.updateUI();
                            this.log(`TOOK ${dmg} DAMAGE!`, 'text-red-500');
                            if (this.state.hero.currentHp <= 0) setTimeout(() => { if(!this.state.skipped) this.endGame(false); }, 3500);
                            else setTimeout(() => { if(!this.state.skipped) this.startPlayerTurn(); }, 3500);
                        }, stepDelay);
                    }, stepDelay);
                } else {
                    this.log(`ENEMY MISSED!`, 'text-slate-400');
                    this.triggerMiss('hero'); 
                    setTimeout(() => { if(!this.state.skipped) this.startPlayerTurn(); }, 3000); 
                }
            }, stepDelay); 
        }, animDelay);
    },

    startPlayerTurn() {
        if (this.state.skipped) return;
        this.state.turn = 'player';
        this.state.phase = 'attack';
        this.setTurnUI('player', 'attack');
        this.log("Your turn! Roll D20.", "text-yellow-500");
        
        if (this.state.auto && !this.state.isOver) {
            setTimeout(() => this.rollUserDie(20), 800);
        }
    },

    setTurnUI(who, phase) {
        const banner = document.getElementById('turn-banner');
        if(!banner) return;
        if (who === 'player') {
            banner.innerText = phase === 'attack' ? "Your Turn: Roll to Hit" : "Hit! Roll Damage";
            banner.className = "inline-block mb-1 bg-yellow-600 text-black px-6 py-1 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg animate-pulse";
        } else {
            banner.innerText = "Enemy Turn";
            banner.className = "inline-block mb-1 bg-red-900 text-white px-6 py-1 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg";
        }
        document.getElementById('hero-panel').className = `split-panel border-r-4 border-slate-900 transition-all duration-500 ${who === 'player' ? 'active-turn' : 'inactive-turn'}`;
        document.getElementById('enemy-panel').className = `split-panel border-l-4 border-slate-900 transition-all duration-500 ${who === 'enemy' ? 'active-turn' : 'inactive-turn'}`;
        document.querySelectorAll('.die-btn').forEach(btn => btn.classList.remove('die-active'));
        if (who === 'player' && !this.state.auto) { // Only highlight dice if not auto
            if (phase === 'attack') document.getElementById('d20-btn').classList.add('die-active');
            else if (phase === 'damage') document.getElementById(`d${this.state.hero.dmgDie}-btn`).classList.add('die-active');
        }
    },

    updateUI() {
        document.getElementById('hero-hp-text').innerText = this.state.hero.currentHp;
        document.getElementById('enemy-hp-text').innerText = this.state.enemy.currentHp;
        const heroPct = (this.state.hero.currentHp / this.state.hero.max);
        const enemyPct = (this.state.enemy.currentHp / this.state.enemy.max);
        document.getElementById('hero-bar').style.width = (heroPct * 100) + '%';
        document.getElementById('enemy-bar').style.width = (enemyPct * 100) + '%';
        if (heroPct <= 0.5 && !this.state.heroWounded) { this.state.heroWounded = true; document.getElementById('hero-img').src = IMAGES[this.state.hero.wounded_bg][0]; }
        if (enemyPct <= 0.5 && !this.state.enemyWounded) { this.state.enemyWounded = true; document.getElementById('enemy-img').src = IMAGES[this.state.enemy.wounded_bg][0]; }
    },

    animateDie(sides) {
        const el = document.getElementById(`d${sides}-btn`);
        if(el) { el.classList.add('rolling'); setTimeout(() => { el.classList.remove('rolling'); }, 2000); }
    },

    triggerDamage(who, amount) {
        const panel = document.getElementById(`${who}-panel`);
        panel.classList.add('taking-damage');
        setTimeout(() => panel.classList.remove('taking-damage'), 400);
        const text = document.createElement('div');
        text.className = 'damage-text';
        text.innerText = `-${amount}`;
        panel.appendChild(text);
        setTimeout(() => text.remove(), 3000);
    },

    triggerMiss(who) {
        const panel = document.getElementById(`${who}-panel`);
        const text = document.createElement('div');
        text.className = 'miss-text';
        text.innerText = "MISS";
        panel.appendChild(text);
        setTimeout(() => text.remove(), 2000);
    },

    log(msg, color) {
        const el = document.getElementById('log-text');
        if(!el) return;
        el.innerText = msg;
        el.className = `text-xs md:text-sm h-6 leading-6 truncate font-sans font-bold ${color}`;
    },

    endGame(win) {
        this.state.isOver = true;
        if(this.onComplete) this.onComplete(win);
    }
};