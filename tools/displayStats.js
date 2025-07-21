export const displayStatsTool = {
    name: 'display_stats',
    description: 'Displays the stats of a character or monster in a formatted block',
    parameters: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Character name' }
        },
        required: ['name']
    }
};

function loadCharacters() {
    const json = localStorage.getItem('rpg_characters');
    if (!json) return {};
    try {
        return JSON.parse(json);
    } catch {
        return {};
    }
}

export function display_stats({ name }) {
    const chars = loadCharacters();
    const char = chars[name];
    if (!char) return `Character ${name} not found.`;

    let md = `**${char.name}**`;
    if (char.description) {
        md += `\n_${char.description}_`;
    }
    md += '\n\n| Stat | Value |\n|---|---|\n';
    if (char.stats) {
        for (const [k, v] of Object.entries(char.stats)) {
            const label = k.replace(/_/g, ' ');
            md += `| ${label} | ${v} |\n`;
        }
    }
    md += `\n**Physical HP:** ${char.current_physical_hp}/${char.max_physical_hp}`;
    md += `\n**Mental HP:** ${char.current_mental_hp}/${char.max_mental_hp}`;

    if (char.aspects && char.aspects.length) {
        md += '\n\n**Aspects**:\n';
        for (const a of char.aspects) {
            md += `- **${a.name}**: ${a.full_name}\n`;
        }
    }
    if (char.gear && char.gear.length) {
        md += '\n\n**Gear**:\n';
        for (const g of char.gear) {
            md += `- **${g.name}**: ${g.full_name}\n`;
        }
    }

    return md.trim();
}
