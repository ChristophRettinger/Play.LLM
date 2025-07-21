// Tool to manage RPG characters and monsters using local storage

function loadCharacters() {
    const json = localStorage.getItem('rpg_characters');
    if (!json) return {};
    try {
        return JSON.parse(json);
    } catch {
        return {};
    }
}

function saveCharacters(chars) {
    localStorage.setItem('rpg_characters', JSON.stringify(chars));
}

const skillKeys = [
    'strength',
    'dexterity',
    'cleverness',
    'quickness',
    'constitution',
    'magic_ability',
    'intuition',
    'believe',
    'luck',
    'perception',
    'natural_physical_resistance',
    'natural_magical_resistance',
    'influence'
];

export const createCharacterTool = {
    name: 'create_character',
    description: 'Creates a character or monster with all attributes',
    parameters: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Character name' },
            description: { type: 'string', description: 'Short description' },
            stats: {
                type: 'object',
                description: 'Ability scores between -20 and 20',
                properties: {
                    strength: { type: 'integer' },
                    dexterity: { type: 'integer' },
                    cleverness: { type: 'integer' },
                    quickness: { type: 'integer' },
                    constitution: { type: 'integer' },
                    magic_ability: { type: 'integer' },
                    intuition: { type: 'integer' },
                    believe: { type: 'integer' },
                    luck: { type: 'integer' },
                    perception: { type: 'integer' },
                    natural_physical_resistance: { type: 'integer' },
                    natural_magical_resistance: { type: 'integer' },
                    influence: { type: 'integer' }
                }
            },
            max_physical_hp: { type: 'integer' },
            current_physical_hp: { type: 'integer' },
            max_mental_hp: { type: 'integer' },
            current_mental_hp: { type: 'integer' },
            aspects: {
                type: 'array',
                description: 'Situation aspects',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Unique name' },
                        full_name: { type: 'string', description: 'Full description' }
                    },
                    required: ['name', 'full_name']
                }
            },
            gear: {
                type: 'array',
                description: 'Important gear or attributes',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Unique name' },
                        full_name: { type: 'string', description: 'Full description' }
                    },
                    required: ['name', 'full_name']
                }
            }
        },
        required: ['name']
    }
};

export function create_character(args) {
    const chars = loadCharacters();
    const nameKey = args.name.toLowerCase();
    const stats = {};
    skillKeys.forEach(k => {
        stats[k] = args.stats && args.stats[k] !== undefined ? args.stats[k] : 0;
    });
    const char = {
        ...args,
        stats,
        max_physical_hp: args.max_physical_hp ?? 40,
        current_physical_hp: args.current_physical_hp ?? 40,
        max_mental_hp: args.max_mental_hp ?? 40,
        current_mental_hp: args.current_mental_hp ?? 40,
        aspects: args.aspects || [],
        gear: args.gear || []
    };
    chars[nameKey] = char;
    saveCharacters(chars);
    return `Character ${args.name} saved.`;
}

export const getCharacterTool = {
    name: 'get_character',
    description: 'Retrieves a character by name',
    parameters: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Character name' }
        },
        required: ['name']
    }
};

export function get_character({ name }) {
    const chars = loadCharacters();
    const char = chars[name.toLowerCase()];
    if (!char) return `Character ${name} not found.`;
    return JSON.stringify(char);
}

export const modifyCharacterTool = {
    name: 'modify_character',
    description: 'Modifies fields of a character by name',
    parameters: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Character to modify' },
            description: { type: 'string', description: 'New description', nullable: true },
            stats: {
                type: 'object',
                description: 'Ability scores to set',
                additionalProperties: { type: 'integer' }
            },
            current_physical_hp: { type: 'integer', nullable: true },
            max_physical_hp: { type: 'integer', nullable: true },
            current_mental_hp: { type: 'integer', nullable: true },
            max_mental_hp: { type: 'integer', nullable: true },
            add_aspects: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Unique name' },
                        full_name: { type: 'string', description: 'Full description' }
                    },
                    required: ['name', 'full_name']
                }
            },
            remove_aspects: {
                type: 'array',
                items: { type: 'string' }
            },
            add_gear: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Unique name' },
                        full_name: { type: 'string', description: 'Full description' }
                    },
                    required: ['name', 'full_name']
                }
            },
            remove_gear: {
                type: 'array',
                items: { type: 'string' }
            }
        },
        required: ['name']
    }
};

export function modify_character(args) {
    const chars = loadCharacters();
    const nameKey = args.name.toLowerCase();
    const char = chars[nameKey];
    if (!char) return `Character ${args.name} not found.`;
    if (args.description !== undefined) char.description = args.description;
    if (args.stats) {
        char.stats = { ...char.stats, ...args.stats };
    }
    ['current_physical_hp','max_physical_hp','current_mental_hp','max_mental_hp'].forEach(k => {
        if (args[k] !== undefined) char[k] = args[k];
    });
    if (args.add_aspects) {
        char.aspects = char.aspects || [];
        for (const a of args.add_aspects) {
            if (!char.aspects.some(x => x.name.toLowerCase() === a.name.toLowerCase())) {
                char.aspects.push(a);
            }
        }
    }
    if (args.remove_aspects && char.aspects) {
        const remove = args.remove_aspects.map(n => n.toLowerCase());
        char.aspects = char.aspects.filter(a => !remove.includes(a.name.toLowerCase()));
    }
    if (args.add_gear) {
        char.gear = char.gear || [];
        for (const g of args.add_gear) {
            if (!char.gear.some(x => x.name.toLowerCase() === g.name.toLowerCase())) {
                char.gear.push(g);
            }
        }
    }
    if (args.remove_gear && char.gear) {
        const remove = args.remove_gear.map(n => n.toLowerCase());
        char.gear = char.gear.filter(g => !remove.includes(g.name.toLowerCase()));
    }
    saveCharacters(chars);
    return `Character ${args.name} updated.`;
}

export const listCharactersTool = {
    name: 'list_characters',
    description: 'Lists all stored characters. Optionally filter by name substring.',
    parameters: {
        type: 'object',
        properties: {
            filter: { type: 'string', description: 'Text to filter names', nullable: true }
        }
    }
};

export function list_characters({ filter = '' } = {}) {
    const chars = loadCharacters();
    const f = filter.toLowerCase();
    const names = Object.values(chars)
        .map(c => c.name)
        .filter(n => n.toLowerCase().includes(f));
    return names.join(', ');
}

