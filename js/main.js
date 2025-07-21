import { diceRollerTool, roll_dice } from '../tools/diceRoller.js';
import { nameGeneratorTool, generate_name } from '../tools/nameGenerator.js';
import { skillCheckTool, skill_check, damageCheckTool, damage_check } from '../tools/skillCheck.js';
import {
    createCharacterTool,
    getCharacterTool,
    modifyCharacterTool,
    listCharactersTool,
    create_character,
    get_character,
    modify_character,
    list_characters
} from '../tools/characterManager.js';
import { displayStatsTool, display_stats } from '../tools/displayStats.js';

const chatEl = document.getElementById('chat');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const clearBtn = document.getElementById('clear-data');
const toolToggle = document.getElementById('show-tools');
const deployment = 'MA01ChatGPT-gpt-4-32k';

const tools = [
    { type: 'function', function: diceRollerTool },
    { type: 'function', function: nameGeneratorTool },
    { type: 'function', function: skillCheckTool },
    { type: 'function', function: damageCheckTool },
    { type: 'function', function: createCharacterTool },
    { type: 'function', function: getCharacterTool },
    { type: 'function', function: modifyCharacterTool },
    { type: 'function', function: listCharactersTool },
    { type: 'function', function: displayStatsTool }
];

const toolFunctions = {
    roll_dice,
    generate_name,
    skill_check,
    damage_check,
    create_character,
    get_character,
    modify_character,
    list_characters,
    display_stats
};

let messages = [];
let showTools = false;

toolToggle.addEventListener('change', () => {
    showTools = toolToggle.checked;
    document.querySelectorAll('.message.function, .message.stats').forEach(el => {
        el.style.display = showTools ? '' : 'none';
    });
});

function appendMessage(role, content) {
    const div = document.createElement('div');
    div.className = `message ${role} mb-2`;
    div.innerHTML = marked.parse(content);
    chatEl.appendChild(div);
    if ((role === 'function' || role === 'stats') && !showTools) {
        div.style.display = 'none';
    }
    chatEl.scrollTop = chatEl.scrollHeight;
}

function getAzureConfig() {
    let key = localStorage.getItem('azure_api_key');
    if (!key) {
        key = prompt('Enter your Azure OpenAI API key');
        if (key) {
            localStorage.setItem('azure_api_key', key);
        }
    }
    let resource = localStorage.getItem('azure_resource');
    if (!resource) {
        resource = prompt('Enter your Azure OpenAI resource name');
        if (resource) {
            localStorage.setItem('azure_resource', resource);
        }
    }
    return { key, resource };
}

async function callLLM() {
    const { key, resource } = getAzureConfig();
    if (!key || !resource) {
        alert('API key and resource are required');
        return;
    }
    const url = `https://${resource}.openai.azure.com/openai/deployments/${deployment}/chat/completions?api-version=2025-01-01-preview`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': key
        },
        body: JSON.stringify({
            messages,
            tools,
            tool_choice: 'auto'
        })
    });

    if (!res.ok) {
        appendMessage('assistant', `Error: ${res.status}`);
        return;
    }

    const data = await res.json();
    if (data.error) {
        appendMessage('assistant', `Error: ${data.error.message || data.error}`);
        return;
    }

    const choice = data.choices[0];
    const msg = choice.message;

    messages.push(msg);

    if (msg.tool_calls) {
        for (const call of msg.tool_calls) {
            const func = toolFunctions[call.function.name];
            if (func) {
                const args = JSON.parse(call.function.arguments || '{}');
                const result = func(args);
                messages.push({
                    role: 'tool',
                    tool_call_id: call.id,
                    content: result
                });
                const role = call.function.name === 'display_stats' ? 'stats' : 'function';
                appendMessage(role, result);
            }
        }
        await callLLM();
        return;
    }

    if (msg.content) {
        appendMessage('assistant', msg.content);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendMessage('user', text);
    messages.push({ role: 'user', content: text });
    input.value = '';
    await callLLM();
});

clearBtn.addEventListener('click', () => {
    const keep = ['azure_api_key', 'azure_resource'];
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!keep.includes(k)) toRemove.push(k);
    }
    toRemove.forEach(k => localStorage.removeItem(k));
    messages = [];
    chatEl.innerHTML = '';
});
