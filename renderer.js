import { DATA } from './data.js';

// Helper for generic buttons
const btn = (fn, txt, i) => `<button onclick="game.${fn}" class="group relative px-8 py-4 bg-gradient-to-b from-yellow-700 to-yellow-900 text-yellow-100 font-bold rounded-xl shadow-lg active:scale-95 transition-all border border-yellow-600/50 overflow-hidden w-full md:w-auto flex items-center justify-center gap-3"><span class="relative flex items-center gap-2 font-old text-xl tracking-wider">${txt} <i data-lucide="${i}" class="w-5 h-5"></i></span></button>`;

export const SceneRenderer = {
    intro(soundEnabled) {
        // Sound Button Logic
        const soundBtnClass = soundEnabled 
            ? "bg-green-800/80 text-green-200 border-green-500 hover:bg-green-700"
            : "bg-red-900/80 text-red-200 border-red-500 animate-pulse hover:bg-red-800";
        const soundIcon = soundEnabled ? "volume-2" : "volume-x";
        const soundText = soundEnabled ? "Sound On" : "Enable Sound";

        return `<div class="text-center space-y-6 max-w-md px-4 relative z-10 flex flex-col items-center">
                <div class="flex justify-center"><i data-lucide="shield" class="w-24 h-24 text-yellow-600 fill-yellow-950/50 animate-pulse"></i></div>
                <h1 class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-700 filter drop-shadow-xl font-old leading-tight">Quest for the<br/>Golden Pint</h1>
                
                <!-- Sound Toggle -->
                <button onclick="game.toggleSound()" class="px-6 py-2 rounded-full border ${soundBtnClass} transition-all font-bold flex items-center gap-2 shadow-lg scale-90 hover:scale-100 mb-2">
                    <i data-lucide="${soundIcon}" class="w-4 h-4"></i> ${soundText}
                </button>

                ${btn('start()', 'Begin Adventure', 'sword')}
                <div class="flex gap-4 mt-6">
                    <button onclick="game.refreshArt()" class="px-4 py-2 glass-panel rounded-full text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2 group border-white/5 hover:border-white/20"><i data-lucide="refresh-cw" class="w-3 h-3 group-hover:animate-spin"></i> Reroll Art</button>
                    <button onclick="game.toggleShare(true)" class="px-4 py-2 glass-panel rounded-full text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2 group border-white/5 hover:border-white/20"><i data-lucide="qr-code" class="w-3 h-3"></i> Share</button>
                </div>
            </div>`;
    },

    difficulty() {
        return `<div class="flex flex-col gap-4 w-full max-w-md px-4">
                <h2 class="text-4xl text-yellow-500 font-bold text-center drop-shadow-xl font-old mb-4">Select Difficulty</h2>
                <button onclick="game.setDifficulty('novice')" class="glass-panel p-6 rounded-xl hover:bg-green-900/40 transition-all text-left group border-l-4 border-l-green-500">
                    <h3 class="text-2xl font-bold text-green-100 font-old tracking-wide flex justify-between">Novice <span class="text-xs bg-green-900 text-green-200 px-2 py-1 rounded font-sans self-center">EASY</span></h3>
                    <p class="text-xs text-slate-400 font-sans mt-1">Enemies are weaker (-20% HP). Good for a casual story.</p>
                </button>
                <button onclick="game.setDifficulty('apprentice')" class="glass-panel p-6 rounded-xl hover:bg-blue-900/40 transition-all text-left group border-l-4 border-l-blue-500">
                    <h3 class="text-2xl font-bold text-blue-100 font-old tracking-wide flex justify-between">Apprentice <span class="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded font-sans self-center">NORMAL</span></h3>
                    <p class="text-xs text-slate-400 font-sans mt-1">The standard experience. Balanced combat.</p>
                </button>
                <button onclick="game.setDifficulty('master')" class="glass-panel p-6 rounded-xl hover:bg-red-900/40 transition-all text-left group border-l-4 border-l-red-500">
                    <h3 class="text-2xl font-bold text-red-100 font-old tracking-wide flex justify-between">Master <span class="text-xs bg-red-900 text-red-200 px-2 py-1 rounded font-sans self-center">HARD</span></h3>
                    <p class="text-xs text-slate-400 font-sans mt-1">Enemies are brutal (+50% HP, Higher AC). Death is likely.</p>
                </button>
            </div>`;
    },

    char_select() {
        const heroCard = (key) => {
            const d = DATA[key];
            const color = key === 'warrior' ? 'red' : 'blue';
            return `<button onclick="game.selectHero('${key}')" class="relative overflow-hidden p-1 glass-panel rounded-xl group active:scale-95 border border-white/10 hover:border-${color}-500/50 text-left w-full transition-all">
                <div class="absolute inset-0 bg-gradient-to-r from-${color}-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="rounded-xl p-4 flex items-center gap-4 relative z-10">
                    <div class="w-16 h-16 bg-${color}-950/80 rounded-full flex items-center justify-center border-2 border-${color}-900 shrink-0">
                        <i data-lucide="${d.icon}" class="w-8 h-8 text-${color}-500"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-baseline">
                            <h3 class="text-2xl font-bold text-${color}-100 font-old tracking-wide">${d.name}</h3>
                            <span class="text-xs font-bold text-${color}-400 font-sans uppercase tracking-wider">Lvl ${d.level} ${key}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-x-2 text-xs font-sans text-slate-300 mt-1">
                            <span><span class="text-slate-500">HP:</span> ${d.max}</span>
                            <span><span class="text-slate-500">AC:</span> ${d.ac}</span>
                            <span><span class="text-slate-500">AB:</span> +${d.ab}</span>
                            <span class="col-span-2 truncate mt-1"><span class="text-slate-500">Wpn:</span> ${d.weapon} (1d${d.dmgDie}+${d.dmgMod})</span>
                        </div>
                    </div>
                </div>
            </button>`;
        };

        return `<div class="flex flex-col gap-4 w-full max-w-md px-4">
                <h2 class="text-4xl text-yellow-500 font-bold text-center drop-shadow-xl font-old mb-2">Select Hero</h2>
                <div class="grid gap-3">
                    ${heroCard('warrior')}
                    ${heroCard('wizard')}
                </div>
            </div>`;
    },

    hero_confirm(hero) {
        return `<div class="flex flex-col items-center justify-center gap-6 max-w-md px-4 text-center w-full"><h2 class="text-4xl text-yellow-500 font-bold drop-shadow-xl font-old">You have chosen</h2><h1 class="text-6xl font-extrabold text-white font-old mb-2 tracking-wide drop-shadow-lg">${hero.name}</h1><p class="text-slate-200 text-lg italic glass-panel px-6 py-4 rounded-xl border border-white/10 font-old">"${hero.desc}"</p>${btn('confirmHero()', 'Continue Journey', 'arrow-right')}</div>`;
    },

    path_select() {
        return `<div class="flex flex-col gap-6 w-full max-w-md px-4"><h2 class="text-4xl text-yellow-500 font-bold text-center drop-shadow-xl font-old">Choose Path</h2><p class="glass-panel p-4 rounded-xl text-slate-200 text-center text-sm leading-relaxed border border-white/10 font-old">The road ahead forks. To the left, ancient woods whisper warnings. To the right, mountains loom cold and silent.</p><div class="grid gap-4"><button onclick="game.selectPath('forest')" class="glass-panel p-6 rounded-xl hover:border-green-500 transition-all text-left group"><h3 class="text-2xl font-bold text-green-100 mb-1 group-hover:text-green-400 font-old tracking-wide">Dark Forest</h3><p class="text-xs text-slate-400 font-sans">Danger: Ogre</p></button><button onclick="game.selectPath('mountain')" class="glass-panel p-6 rounded-xl hover:border-indigo-500 transition-all text-left group"><h3 class="text-2xl font-bold text-indigo-100 mb-1 group-hover:text-indigo-400 font-old tracking-wide">Rocky Pass</h3><p class="text-xs text-slate-400 font-sans">Danger: Troll</p></button></div></div>`;
    },

    monster_intro(enemy) {
        return `<div class="flex flex-col items-center justify-center gap-8 max-w-md px-4 text-center w-full"><h2 class="text-6xl text-red-600 font-black drop-shadow-2xl font-old tracking-wider animate-pulse">AMBUSH</h2><div class="glass-panel p-6 rounded-xl border-red-500/30 bg-black/40"><p class="text-slate-200 text-xl leading-relaxed font-old">A <span class="text-red-400 font-bold">Lvl ${enemy.level} ${enemy.name}</span> emerges from the shadows!</p></div>${btn("updateScene('combat')", 'Roll for Initiative', 'swords')}</div>`;
    },

    traveler() {
        return `<div class="text-center px-4 max-w-md flex flex-col items-center"><div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center ring-4 ring-yellow-500/50 mx-auto mb-6 shadow-2xl"><i data-lucide="trophy" class="w-10 h-10 text-yellow-400"></i></div><h2 class="text-6xl font-bold text-white mb-4 font-old drop-shadow-xl">Victory!</h2><div class="glass-panel p-6 rounded-xl border-yellow-500/30 text-yellow-100 text-lg mb-6 font-old">"You have triumphed! The treasures of the path are yours."</div>${btn("updateScene('town')", "Go to Tavern", "beer")}</div>`;
    },

    town() {
        return `<div class="text-center px-4 max-w-md flex flex-col items-center"><div class="flex justify-center gap-4 mb-6 text-yellow-500"><i data-lucide="crown" class="w-12 h-12"></i><i data-lucide="beer" class="w-12 h-12"></i></div><h1 class="text-5xl font-extrabold text-yellow-400 mb-4 font-old">The Golden Pint</h1><p class="glass-panel p-4 rounded-xl text-slate-200 mb-6 font-old text-lg leading-relaxed">You are the hero of the hour! Ale flows freely as cheerful barmaids surround you. The entire tavern raises a pint in your honor, a true hero's welcome after a journey well fought.</p>${btn("home()", "Replay", "rotate-ccw")}</div>`;
    },

    game_over() {
        return `<div class="text-center px-4 flex flex-col items-center"><i data-lucide="skull" class="w-24 h-24 text-red-600 mx-auto mb-6"></i><h1 class="text-6xl font-black text-red-600 mb-6 font-old">You Died</h1>${btn("home()", "Try Again", "rotate-ccw")}</div>`;
    }
};