import { roll_dice } from './diceRoller.js';

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
            },
            usedSkill: {
                type: "string",
                description: "Which skill provides the bonus",
            },
            difficultyReason: {
                type: "string",
                description: "Reason for choosing this difficulty"
            }
        },
        required: ["difficulty", "skill", "usedSkill", "difficultyReason"]
    }
};

export function skill_check({ difficulty, skill, usedSkill, difficultyReason }) {
    const roll1 = Math.floor(Math.random() * 12) + 1;
    const roll2 = Math.floor(Math.random() * 12) + 1;
    const total = roll1 + roll2 + skill;
    const success = total >= difficulty;
    return `Rolled 2d12 (${roll1} + ${roll2}) + ${skill} = ${total}. ${success ? 'Success' : 'Failure'} against difficulty ${difficulty}. Skill used: ${usedSkill}. Reason: ${difficultyReason}`;
}

export const damageCheckTool = {
    name: "damage_check",
    description: "Performs a skill check and, on success, rolls damage using a dice expression.",
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
            },
            usedSkill: {
                type: "string",
                description: "Which skill provides the bonus",
            },
            difficultyReason: {
                type: "string",
                description: "Reason for choosing this difficulty"
            },
            damage: {
                type: "string",
                description: "Dice expression for damage if the check succeeds"
            }
        },
        required: ["difficulty", "skill", "usedSkill", "damage", "difficultyReason"]
    }
};

export function damage_check({ difficulty, skill, usedSkill, damage, difficultyReason }) {
    const roll1 = Math.floor(Math.random() * 12) + 1;
    const roll2 = Math.floor(Math.random() * 12) + 1;
    const total = roll1 + roll2 + skill;
    const success = total >= difficulty;
    let result = `Rolled 2d12 (${roll1} + ${roll2}) + ${skill} = ${total}. ${success ? 'Success' : 'Failure'} against difficulty ${difficulty}. Skill used: ${usedSkill}. Reason: ${difficultyReason}`;
    if (success) {
        result += ' ' + roll_dice({ expression: damage });
    }
    return result;
}
