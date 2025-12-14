// --- ASSETS & CONFIGURATION ---

export const IMAGES = {
    intro: ["https://image.pollinations.ai/prompt/epic%20fantasy%20book%20cover%20art%201970s%20style%2C%20warrior%20and%20wizard%20looking%20at%20a%20glowing%20tavern%20in%20distance%2C%20frank%20frazetta%20style%2C%20oil%20painting%2C%20dramatic%20lighting%2C%20vibrant%20orange%20and%20purple%20sky?width=1024&height=1024&nologin=true&seed=101"],
    difficulty: ["https://image.pollinations.ai/prompt/fantasy%20armory%20with%20rusty%20and%20golden%20weapons%20on%20wall%201970s%20dnd%20art%20oil%20painting?width=1024&height=1024&nologin=true&seed=150"],
    char_select: ["https://image.pollinations.ai/prompt/fantasy%20rpg%20character%20selection%20warrior%20and%20wizard%20standing%20in%20a%20stone%20hall%20armory%2C%201970s%20d%26d%20art%20style%20oil%20painting%20dramatic%20lighting?width=1024&height=1024&nologin=true&seed=202"],
    
    warrior_bg: ["https://image.pollinations.ai/prompt/fantasy%20warrior%20portrait%20rugged%20face%20scarred%20armor%20heroic%20lighting%201970s%20dnd%20art%20style%20oil%20painting?width=600&height=1024&nologin=true&seed=99"],
    warrior_wounded: ["https://image.pollinations.ai/prompt/fantasy%20warrior%20portrait%20injured%20bleeding%20broken%20armor%20exhausted%20battle%20damage%201970s%20dnd%20art%20style%20oil%20painting?width=600&height=1024&nologin=true&seed=99"],
    
    wizard_bg: ["https://image.pollinations.ai/prompt/fantasy%20wizard%20portrait%20mystical%20glowing%20eyes%20runes%201970s%20dnd%20art%20style%20oil%20painting?width=600&height=1024&nologin=true&seed=404"],
    wizard_wounded: ["https://image.pollinations.ai/prompt/fantasy%20wizard%20portrait%20injured%20bleeding%20torn%20robes%20exhausted%20magical%20burns%201970s%20dnd%20art%20style%20oil%20painting?width=600&height=1024&nologin=true&seed=404"],
    
    forest: ["https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1024&auto=format&fit=crop"],
    mountain: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1024&auto=format&fit=crop"],
    
    ogre_intro: ["https://image.pollinations.ai/prompt/fearsome%20ogre%20portrait%20fantasy%20art%201970s%20style?width=600&height=1024&nologin=true&seed=505"],
    ogre_wounded: ["https://image.pollinations.ai/prompt/fearsome%20ogre%20portrait%20injured%20bleeding%20open%20wounds%20angry%20fantasy%20art%201970s%20style?width=600&height=1024&nologin=true&seed=505"],
    
    troll_intro: ["https://image.pollinations.ai/prompt/menacing%20troll%20portrait%20blue%20skin%20fantasy%20art%201970s%20style?width=600&height=1024&nologin=true&seed=606"],
    troll_wounded: ["https://image.pollinations.ai/prompt/menacing%20troll%20portrait%20injured%20bleeding%20green%20blood%20cuts%20fantasy%20art%201970s%20style?width=600&height=1024&nologin=true&seed=606"],
    
    traveler: ["https://image.pollinations.ai/prompt/fantasy%20victory%20scene%20treasure%20chest%20overflowing%20gold%20coins%20magic%20items%20sunrise%20background%201970s%20oil%20painting%20style?width=1024&height=1024&nologin=true&seed=777"], 
    town: ["https://image.pollinations.ai/prompt/fantasy%20tavern%20party%20scene%2C%20warrior%20and%20wizard%20surrounded%20by%20beautiful%20barmaids%20and%20cheering%20crowd%2C%20magical%20lights%20and%20ale%20flowing%2C%20fantasy%20celebration%20art%20oil%20painting%2C%20vibrant%20and%20cheerful?width=1024&height=1024&nologin=true&seed=45"],
    
    game_over: ["https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1024&auto=format&fit=crop"]
};

export const NARRATION = {
    intro: 'begin.mp3',
    char_select: 'hero-type.mp3',
    path_select: 'path.mp3',
    monster_intro: 'ambush.mp3'
};

export const DATA = {
    ogre: { name: 'Forest Ogre', level: 2, hp: 45, max: 45, ac: 12, ab: 2, dmgDie: 6, dmgMod: 2, weapon: 'Greatclub', bg: 'ogre_intro', wounded_bg: 'ogre_wounded' }, 
    troll: { name: 'Cave Troll', level: 4, hp: 55, max: 55, ac: 13, ab: 3, dmgDie: 8, dmgMod: 1, weapon: 'Rending Claws', bg: 'troll_intro', wounded_bg: 'troll_wounded' },
    warrior: { name: 'Warrior', level: 1, hp: 50, max: 50, ac: 15, ab: 3, dmgDie: 8, dmgMod: 2, weapon: 'Longsword', icon: 'sword', bg: 'warrior_bg', wounded_bg: 'warrior_wounded', desc: 'Master of steel' },
    wizard: { name: 'Wizard', level: 1, hp: 40, max: 40, ac: 11, ab: 5, dmgDie: 10, dmgMod: 3, weapon: 'Arcane Staff', icon: 'scroll', bg: 'wizard_bg', wounded_bg: 'wizard_wounded', desc: 'Master of arcane' }
};