import * as vscode from 'vscode';
import axios from 'axios';


export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vs-ai-coding-helper-by-codeplusdev.findGptComments', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No active editor');
			return;
		}

		const document = editor.document;
		const text = document.getText();
		const config = vscode.workspace.getConfiguration('vs-ai-coding-helper-by-codeplusdev');
		const openaiApiKey = config.get<string>('openaiApiKey');
		const gptModel = config.get<string>('gptModel') ?? 'gpt-3.5-turbo-instruct';

		if (!openaiApiKey) {
			vscode.window.showWarningMessage('OpenAI API key is not set. Please configure it in the extension settings.');
			return;
		}

		const regex = /\/\/ GPT: (.+?)\n?\r?/g;

		const matches = Array.from(text.matchAll(regex));
		
		matches.forEach(async (match) => {
			
			if (match) {
				let prompt = match[1].trim();
				let codeBlock = editor.document.getText(editor?.selection);
				let commentLine = editor?.selection?.start.line ?? document.positionAt(match.index ?? 0).line;
				let endLine = editor?.selection?.end.line ?? document.positionAt(match.index ?? 0 + match[0].length).line ?? match.index ?? 0 + 1;

				let messages = [
					{
						"role": "system",
						"content": `You are currently writing code. There should be no text in your responses that could disrupt the operation of the code. 
						  Comments and documentation should be written in English. Write only the code that is requested or make edits if they are requested.`
					}
				];

				// messages.push(context.workspaceState.get('vs-ai-coding-helper-by-codeplusdev-messages'));
				messages.push({
					"role": "user",
					"content": `${prompt}\n${codeBlock}`
				});

				context.workspaceState.update('vs-ai-coding-helper-by-codeplusdev-messages', messages);

				try {
					const response = await axios.post('https://api.openai.com/v1/chat/completions', {
						model: gptModel,
						messages: messages
					}, {
						headers: {
							'Authorization': `Bearer ${openaiApiKey}`
						}
					});

					let responseMessage = response.data.choices[0].message.content;

					console.log({responseMessage});

					const regex = new RegExp(`(.*?)\\s*\`\`\`[a-z]+\\s+([\\s\\S]*?)\\s+\`\`\`\\s*(.*?)`, 'm');

					const matches = responseMessage.match(regex);

					let completion = '';

					if (matches && matches.length > 1) {
						let comments_prev = matches[1] || false;
						let comments_next = matches[3] || false;

						if (comments_prev !== false) {
							completion += `/*\n ${comments_prev} \n*/`;
						}

						completion += matches[2];

						if (comments_next !== false) {
							completion += `/*\n ${comments_next} \n*/\n`;
						}
					} else {
						completion = `/*\n ${responseMessage} \n*/\n`;
					}

					console.log(completion);

					await editor.edit(editBuilder => {
						const start = new vscode.Position(commentLine, 0);
						const end = document.lineAt(endLine).range.end;
						const range = new vscode.Range(start, end);
						editBuilder.replace(range, completion);
					});
				} catch (error) {
					console.error('Error calling OpenAI:', error);
					vscode.window.showErrorMessage('Failed to call OpenAI API');
				}
			}
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
