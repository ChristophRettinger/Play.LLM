# Play.LLM

This repository contains a simple single page application for chatting with an LLM using the Azure OpenAI service. It demonstrates use of function calling tools implemented in separate JavaScript files.

## Usage

Open `index.html` in a browser. On first use you will be prompted for your Azure OpenAI API key and resource name, which are stored in local storage. The deployment is fixed to the GPT-4o model. A **Clear Data** button lets you wipe stored chat history and character data while keeping your API settings.

The application includes several example tools available to the LLM:

- **Dice Roller** – roll dice using expressions like `2d6+3`.
- **Name Generator** – generate random fantasy names.
- **Skill Check** – roll 2d12 plus a skill bonus to beat a difficulty.
- **Damage Check** – perform a skill check and roll damage dice on success.
- **Character Manager** – create, retrieve and modify RPG characters stored in local storage.
- **List Characters** – view existing characters filtered by text.

Messages support Markdown rendering.

## Model compatibility

The sample assumes your Azure OpenAI deployments support the modern `tools`
interface for function calling. Both `4o` and `o3-mini` work with this API and
the application sends tool definitions using the `tools` and `tool_choice`
parameters. If your deployment requires the legacy `functions` parameters,
adjust `js/main.js` accordingly.
