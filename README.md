# CodePlusDev VS AI Coding Helper README

This is the README for the extension "CodePlusDev VS AI Coding Helper", a powerful tool designed to enhance your coding experience by integrating AI-powered code suggestions directly into Visual Studio Code. This extension leverages OpenAI's GPT services to scan your code for specific comment markers (`// GPT: prompt`) and provides code enhancements or additions based on the context provided in the prompt. Whether you have existing code that needs improvement or you're starting from scratch, this extension aims to boost your productivity and code quality.

## Features

"CodePlusDev VS AI Coding Helper" comes with several key features that make coding faster, more efficient, and more intuitive:

- **AI-Powered Code Suggestions:** Automatically generates code suggestions by analyzing comments starting with `// GPT: prompt` in your source code.
- **Context-Aware Replacements:** If code is selected, it sends the prompt along with the selected code to GPT services and updates the code with the AI's suggestion.
- **Seamless Integration:** Works within your VS Code environment, providing inline code suggestions for an improved coding workflow.

![Update feature](https://codeplus.dev/wp-content/uploads/2024/02/feature-update.png)

> Tip: To best showcase your extension, consider using animations to demonstrate its capabilities. Short, focused animations can effectively illustrate how your extension works in action.

## Requirements

This extension requires an OpenAI API key to access GPT services. Ensure you have obtained an API key from OpenAI and have it ready for use.

## Extension Settings

This extension contributes the following settings:

- `vs-ai-coding-helper-by-codeplusdev.openaiApiKey`: Your OpenAI API Key for accessing GPT services. This key is essential for the extension to function and provide AI-powered code suggestions.
- `vs-ai-coding-helper-by-codeplusdev.gptModel`: The model name of the OpenAI API you wish to use (default: "gpt-3.5-turbo"). This setting allows you to select which GPT model version the extension will use for generating code suggestions.

## Known Issues

For the most current list of known issues, please refer to the issues section of the extension's repository.

## Release Notes

### 0.0.1

Initial release of "CodePlusDev VS AI Coding Helper".

---

## Following Extension Guidelines

We've ensured that "CodePlusDev VS AI Coding Helper" adheres to the [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines), following best practices for creating an enjoyable and seamless user experience.

## Working with Markdown

VS Code supports Markdown for README files like this one. Here are some editor keyboard shortcuts to improve your writing experience:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For More Information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy coding with CodePlusDev VS AI Coding Helper!**
