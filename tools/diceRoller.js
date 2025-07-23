export const diceRollerTool = {
    name: "roll_dice",
    description: "Rolls dice using notation like '1d6', '2d20+5' or combined expressions like '2d6+1d4'",
    parameters: {
        type: "object",
        properties: {
            expression: {
                type: "string",
                description: "Dice expression"
            }
        },
        required: ["expression"]
    }
};

export function roll_dice({ expression }) {
    const cleaned = expression.replace(/\s+/g, '');
    const tokens = cleaned.match(/[+-]?\d*d\d+|[+-]?\d+/gi);
    if (!tokens || tokens.join('') !== cleaned) {
        return `Invalid dice expression: ${expression}`;
    }

    let total = 0;
    const parts = [];

    tokens.forEach((t, idx) => {
        let sign = 1;
        if (t.startsWith('+')) {
            t = t.slice(1);
        } else if (t.startsWith('-')) {
            sign = -1;
            t = t.slice(1);
        }

        const prefix = idx === 0 ? (sign < 0 ? '-' : '') : sign < 0 ? ' - ' : ' + ';

        if (t.toLowerCase().includes('d')) {
            const [cnt, sd] = t.toLowerCase().split('d');
            const count = parseInt(cnt || '1', 10);
            const sides = parseInt(sd, 10);
            if (!sides) {
                return;
            }
            const rolls = [];
            for (let i = 0; i < count; i++) {
                rolls.push(Math.floor(Math.random() * sides) + 1);
            }
            const subtotal = rolls.reduce((a, b) => a + b, 0) * sign;
            total += subtotal;
            parts.push(prefix + rolls.join(', '));
        } else {
            const value = parseInt(t, 10) * sign;
            total += value;
            parts.push(prefix + Math.abs(value));
        }
    });

    return `Rolled ${expression}: [${parts.join('')}] = ${total}`;
}
