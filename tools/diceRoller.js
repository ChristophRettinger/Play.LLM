export const diceRollerTool = {
    type: "function",
    function: {
        name: "roll_dice",
        description: "Rolls dice using notation like '1d6' or '2d20+5'",
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
    }
};

export function roll_dice({ expression }) {
    const regex = /^(\d*)d(\d+)([+-]\d+)?$/i;
    const match = expression.match(regex);
    if (!match) {
        return `Invalid dice expression: ${expression}`;
    }
    const count = parseInt(match[1] || '1', 10);
    const sides = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;

    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const sum = rolls.reduce((a, b) => a + b, 0) + modifier;
    let details = rolls.join(', ');
    if (modifier) {
        details += modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;
    }
    return `Rolled ${expression}: [${details}] = ${sum}`;
}
