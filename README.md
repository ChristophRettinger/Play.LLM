# Play.LLM

This repository contains a simple single page application for chatting with an LLM via the [OpenRouter](https://openrouter.ai) API. It demonstrates use of function calling tools implemented in separate JavaScript files.

## Usage

Open `index.html` in a browser. On first use you will be prompted for your OpenRouter API key, which is stored in local storage. A dropdown allows selecting the model to use. The default is `mistralai/mistral-small-3.2-24b-instruct:free` but you can also choose `google/gemini-2.0-flash-exp:free` or `google/gemini-2.5-flash-lite-preview-06-17`.

The application includes two example tools available to the LLM:

- **Dice Roller** – roll dice using expressions like `2d6+3`.
- **Name Generator** – generate random fantasy names.

Messages support Markdown rendering.

## Model compatibility

Not every model exposed by OpenRouter uses the same interface for function
calling. The `mistralai/mistral-small-3.2-24b-instruct:free` model supports
tool calls but expects the older `functions`/`function_call` parameters from the
OpenAI API. Other models (such as `gemini-2.0-flash-exp:free`) use the newer
`tools` API. If you encounter server errors when a tool call is attempted,
ensure the request matches the interface expected by the selected model and
adjust `js/main.js` accordingly.
