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
    const char = chars[name.toLowerCase()];
    if (!char) return `Character ${name} not found.`;

    const abbr = {
        strength: 'STR',
        dexterity: 'DEX',
        cleverness: 'CLV',
        quickness: 'QCK',
        constitution: 'CON',
        magic_ability: 'MAG',
        intuition: 'INT',
        believe: 'BLV',
        luck: 'LCK',
        perception: 'PER',
        natural_physical_resistance: 'NPR',
        natural_magical_resistance: 'NMR',
        influence: 'INF'
    };

    let html = `<strong>${char.name}</strong>`;
    if (char.description) {
        html += `<div class="text-muted small">${char.description}</div>`;
    }
    html += '<table class="table table-sm stats-table mb-1"><tbody>';
    if (char.stats) {
        for (const [k, v] of Object.entries(char.stats)) {
            const label = k.replace(/_/g, ' ');
            const short = abbr[k] || label;
            html += `<tr><th class="py-1 px-2"><abbr title="${label}">${short}</abbr></th><td class="py-1 px-2 text-end">${v}</td></tr>`;
        }
    }
    html += '</tbody></table>';
    html += `<div class="small mb-1">HP <abbr title="Physical">P</abbr>: ${char.current_physical_hp}/${char.max_physical_hp} | HP <abbr title="Mental">M</abbr>: ${char.current_mental_hp}/${char.max_mental_hp}</div>`;

    if (char.aspects && char.aspects.length) {
        const list = char.aspects.map(a => `<abbr title="${a.full_name}">${a.name}</abbr>`).join(', ');
        html += `<div class="small"><strong>Aspects:</strong> ${list}</div>`;
    }
    if (char.gear && char.gear.length) {
        const list = char.gear.map(g => `<abbr title="${g.full_name}">${g.name}</abbr>`).join(', ');
        html += `<div class="small"><strong>Gear:</strong> ${list}</div>`;
    }

    return html.trim();
}
