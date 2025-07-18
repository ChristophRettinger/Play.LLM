export const skillCheckTool = {
    name: "skill_check",
    description: "Performs a skill check by rolling 2d12 and adding the player's skill level to beat a difficulty.",
    parameters: {
        type: "object",
        properties: {
            difficulty: {
                type: "integer",
                description: "Target number to beat"
            },
            skill: {
                type: "integer",
                description: "Player's skill bonus"
            }
        },
        required: ["difficulty", "skill"]
    }
};

export function skill_check({ difficulty, skill }) {
    const roll1 = Math.floor(Math.random() * 12) + 1;
    const roll2 = Math.floor(Math.random() * 12) + 1;
    const total = roll1 + roll2 + skill;
    const success = total >= difficulty;
    return `Rolled 2d12 (${roll1} + ${roll2}) + ${skill} = ${total}. ${success ? 'Success' : 'Failure'} against difficulty ${difficulty}.`;
}
