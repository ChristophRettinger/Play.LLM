# Play.LLM

This repository contains a simple single page application for chatting with an LLM via the [OpenRouter](https://openrouter.ai) API. It demonstrates use of function calling tools implemented in separate JavaScript files.

## Usage

Open `index.html` in a browser. On first use you will be prompted for your OpenRouter API key, which is stored in local storage. A dropdown allows selecting the model to use. The default is `mistralai/mistral-small-3.2-24b-instruct:free` but you can also choose `google/gemini-2.0-flash-exp:free` or `google/gemini-2.5-flash-lite-preview-06-17`.

The application includes two example tools available to the LLM:

- **Dice Roller** – roll dice using expressions like `2d6+3`.
- **Name Generator** – generate random fantasy names.

Messages support Markdown rendering.
