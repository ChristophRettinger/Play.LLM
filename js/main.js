import { diceRollerTool, roll_dice } from '../tools/diceRoller.js';
import { nameGeneratorTool, generate_name } from '../tools/nameGenerator.js';

const chatEl = document.getElementById('chat');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const modelSelect = document.getElementById('model-select');

const tools = [
    { type: 'function', function: diceRollerTool },
    { type: 'function', function: nameGeneratorTool }
];

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
    const deployment = modelSelect.value;
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
                appendMessage('function', result);
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
