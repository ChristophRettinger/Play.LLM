import { diceRollerTool, roll_dice } from '../tools/diceRoller.js';
import { nameGeneratorTool, generate_name } from '../tools/nameGenerator.js';

const chatEl = document.getElementById('chat');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');

const functions = [diceRollerTool, nameGeneratorTool];
const toolFunctions = {
    roll_dice,
    generate_name
};

let messages = [];

function appendMessage(role, content) {
    const div = document.createElement('div');
    div.className = `message ${role} mb-2`;
    div.innerHTML = marked.parse(content);
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
}

function getApiKey() {
    let key = localStorage.getItem('openrouter_api_key');
    if (!key) {
        key = prompt('Enter your OpenRouter API key');
        if (key) {
            localStorage.setItem('openrouter_api_key', key);
        }
    }
    return key;
}

async function callLLM() {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('API key required');
        return;
    }
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'mistralai/mistral-small-3.2-24b-instruct:free',
            messages,
            functions,
            function_call: 'auto'
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

    if (msg.function_call) {
        const call = msg.function_call;
        const func = toolFunctions[call.name];
        if (func) {
            const args = JSON.parse(call.arguments || '{}');
            const result = func(args);
            messages.push({
                role: 'function',
                name: call.name,
                content: result
            });
            appendMessage('function', result);
        }
        await callLLM();
        return;
    }

    if (msg.content) {
        appendMessage('assistant', msg.content);
    }
    messages.push(msg);
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
