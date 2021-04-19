
export const ABILITY_SCORES = [
    "STR","DEX","CON","INT","WIS","CHA","None"
];
export const DAMAGE_TYPES = [
    "Bludgeoning", 
    "Piercing", 
    "Slashing", 
    "Acid",
    "Cold",
    "Fire",
    "Force",
    "Lightning",
    "Necrotic",
    "Poison",
    "Psychic",
    "Radiant",
    "Thunder"
];
export const DURATIONS = [
    "Instantaneous",
    "1 Round",
    "2 Rounds",
    "1 Minute",
    "10 Minutes",
    "1 Hour",
    "8 Hours",
    "24 Hours",
    "Until Dispelled",
    "Special"
];
export const COMPONENTS = ["V","S","M"];
export const CASTING_TIMES = [
    "A",
    "BA",
    "RA",
    "1 Minute",
    "10 Minutes",
    "1 Hour",
    "Special"
];
export const RESOURCES = [
    "None", 
    "Channel Divinity",
    "Ki", 
    "Lay on Hands", 
    "Healing Light", 
    "Rage",
    "Slot", 
    "Sorcery Point", 
    "Superiority Dice", 
    "Psionic Energy Dice", 
    "Special"
];
export const SCHOOLS = [
    "Conjuration",
    "Necromancy",
    "Evocation",
    "Abjuration",
    "Transmutation",
    "Divination",
    "Enchantment",
    "Illusion"
];
export const REFRESH_RULES = [
    "Short Rest",
    "Long Rest",
    "Dawn",
    "1 Hour",
    "2 Hours",
    "8 Hours",
    "24 Hours", 
    "Special"
];
export const FEATURE_TYPES = [
    "Modifier",
    "Spell Modifier",
    "Skill Proficiencies",
    "Skill Proficiency Choices",
    "Armor Proficiencies",
    "Weapon Proficiencies", 
    "Special Weapon Proficiencies",
    "Saving Throw Proficiencies",
    "Tool Proficiency",
    "Feat",
    "Expertise",
    "Advantage",
    "Damage Multiplier",
    "Resource",
    "Language",
    "Ability Score Improvement",
    "Ability",
    "Creature Ability",
    "Minion Ability",
    "Spell as Ability",
    "Item Affecting Ability", // This is for Pact Weapon, Infusions, and Alchemist Potions
    "Ritual Casting",
    "Spellcasting",
    "Spellcasting Focus",
    "Spell Book",
    "Cantrips",
    "Spells",
    "Bonus Spells",
    "Eldritch Invocation",
    "Pact Boon",
    "Specific Special Feature",
    "Special Feature",
    "Special Feature Choices",
    "Mystic Arcanum",
    "Sense"
];
export const ITEM_TYPES = [
    "Armor",
    "Weapon",
    "Ammunition",
    "Artisan's Tools",
    "Game Set",
    "Instrument",
    "Potion",
    "Ring",
    "Rod",
    "Scroll",
    "Staff",
    "Tool",
    "Vehicle",
    "Wand",
    "Wondrous",
    "Other",
    "Holy Symbol",
    "Arcane Focus",
    "Druidic Focus"
];
export const MULTIPLIER_MAP = {
    "Vulnerability": 2,
    "Resistance": 0.5,
    "Immunity": 0,
    "Absorption Half": -0.5,
    "Absorption Whole": -1
};
export const PERCENTAGE_LEVEL_MAP = {
    "Full": 1,
    "Half": (1/2),
    "Third": (1/3),
    "Quarter": (1/4)
};
export const PROFICIENCY_MAP = {
    "--": -1,
    "Not Proficient": 0,
    "Half Proficient": 0.5,
    "Proficient": 1,
    "Expert": 2
};
