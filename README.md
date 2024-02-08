# CodePlusDev VS AI Coding Helper README

"CodePlusDev VS AI Coding Helper" is a powerful tool designed to enhance your coding experience by integrating AI-powered code suggestions directly into Visual Studio Code. This extension leverages OpenAI's GPT services to provide code enhancements or additions based on the context you provide through a dedicated prompt box. This new method allows for a more seamless and efficient way to receive coding suggestions, whether you are improving existing code or starting from scratch.

## Features

"CodePlusDev VS AI Coding Helper" comes with several key features that make coding faster, more efficient, and more intuitive:

- **Direct Prompt Input:** Utilize a dedicated prompt box to directly input your coding queries or requests, eliminating the need for inserting specific comment markers in your code. This approach allows for a streamlined and more intuitive interaction with the AI.

- **Context-Aware Replacements:** When you have code selected, the extension sends your input from the prompt box along with the selected code to GPT services. It then intelligently updates your code with the AI's suggestion, integrating the new code block seamlessly.

- **Seamless Integration:** Designed to work within your VS Code environment, this extension provides inline code suggestions right where you need them, enhancing your productivity and code quality without disrupting your development workflow.

![Update feature](https://codeplus.dev/wp-content/uploads/2024/02/feature-update.png)

> Tip: To showcase the capabilities of "CodePlusDev VS AI Coding Helper" effectively, consider using short, focused animations. These can serve as an excellent way to demonstrate how the extension streamlines the coding process with its AI-powered features.

## Requirements

This extension requires an OpenAI API key to access GPT services. Ensure you have obtained an API key from OpenAI and have it ready for use.

## Extension Settings

This extension contributes the following settings:

- `vs-ai-coding-helper-by-codeplusdev.openaiApiKey`: Your OpenAI API Key for accessing GPT services. This key is essential for the extension to function and provide AI-powered code suggestions.
- `vs-ai-coding-helper-by-codeplusdev.gptModel`: The model name of the OpenAI API you wish to use (default: "gpt-3.5-turbo"). This setting allows you to select which GPT model version the extension will use for generating code suggestions.

## Known Issues

For the most current list of known issues, please refer to the issues section of the extension's repository.

## Release Notes

### 0.0.4 - 9 February 2024

- Added: Line ending support
- Added: Feedback status messages
- Added: `maxCodeReference` settings parameter to limit the using system context token
- Fixed: The error occurring when changing active tab
- Improved: Request system prompt quality
- Improved: Overall code quality

### 0.0.3 (HOTFIX) - 8 February 2024

- Hotfix: Fixed a sorting error that prevented selected text operation.
- Added: The current file character limit is limited to 4000.

### 0.0.2 - 8 February 2024

#### Added

- Programming language information of the currently edited file is now included.
- Code of the currently edited file and the current line information are now added to the prompt system.

#### Fixed

- Resolved a critical prompt issue that was affecting functionality.
- Reduced code clutter with the addition of new lines to improve readability and organization.

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
