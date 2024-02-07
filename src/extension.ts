import * as vscode from 'vscode';
import axios from 'axios';

// export function activate(context: vscode.ExtensionContext) {
// 	let disposable = vscode.commands.registerCommand('extension.findGptComments', async () => {
// 		const editor = vscode.window.activeTextEditor;
// 		if (!editor) {
// 			vscode.window.showInformationMessage('No active editor');
// 			return;
// 		}

// 		const document = editor.document;
// 		const text = document.getText();
// 		const config = vscode.workspace.getConfiguration('gpt3integration');
// 		const openaiApiKey = config.get<string>('openaiApiKey');

// 		if (!openaiApiKey) {
// 			vscode.window.showWarningMessage('OpenAI API key is not set. Please configure it in the extension settings.');
// 			return;
// 		}

// 		const regex = /\/\/ GPT: (.+)\n((.*)\n{0,3}?)*?(?=(\n{3,})|(\/\/ GPT:)|$)/g;
// 		let matches = text.matchAll(regex);

// 		for (const match of matches) {
// 			if (match) {
// 				let prompt = match[1].trim();
// 				let codeBlock = match[2].trim();
// 				let commentLine = document.positionAt(match.index ?? 0).line;
// 				let endLine = document.positionAt(match.index ?? 0 + match[0].length).line;

// 				// await editor.edit(editBuilder => {
// 				// 	editBuilder.insert(new vscode.Position(0, 0), codeBlock);
// 				// });

// 				try {
// 					const response = await axios.post('https://api.openai.com/v1/completions', {
// 						model: 'text-davinci-002',
// 						prompt: `${prompt}\n${codeBlock}`,
// 						temperature: 0.5,
// 						max_tokens: 100,
// 					}, {
// 						headers: {
// 							'Authorization': `Bearer ${openaiApiKey}`
// 						}
// 					});

// 					const completion = response.data.choices[0].text.trim();
// 					await editor.edit(editBuilder => {
// 						editBuilder.replace(new vscode.Range(commentLine + 1, 0, endLine, 0), completion);
// 					});
// 				} catch (error) {
// 					console.error('Error calling OpenAI:', error);
// 					vscode.window.showErrorMessage('Failed to call OpenAI API');
// 					return;
// 				}
// 			}
// 		}

// 	});

// 	context.subscriptions.push(disposable);
// }


export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.findGptComments', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No active editor');
			return;
		}

		const document = editor.document;
		const text = document.getText();
		const config = vscode.workspace.getConfiguration('gpt3integration');
		const openaiApiKey = config.get<string>('openaiApiKey');
		const gptModel = config.get<string>('gptModel') ?? 'gpt-3.5-turbo-instruct';

		if (!openaiApiKey) {
			vscode.window.showWarningMessage('OpenAI API key is not set. Please configure it in the extension settings.');
			return;
		}



		// Düzeltilmiş regex ifadesi
		const regex = /\/\/ GPT: (.+)\n/g;

		// matchAll kullanarak tüm eşleşmeleri bulma
		const matches = Array.from(text.matchAll(regex));

		console.log({ matches });
		// Array.from(matches).forEach((match) => {
		// 	console.log(match);
		// });

		matches.forEach(async (match) => {

			if (match) {
				let prompt = match[1].trim();
				let codeBlock = editor.document.getText(editor?.selection);
				let commentLine = editor?.selection?.start.line ?? document.positionAt(match.index ?? 0).line;
				let endLine = editor?.selection?.end.line ?? document.positionAt(match.index ?? 0 + match[0].length).line ?? match.index ?? 0 + 1;

				console.log(prompt);
				// console.log(`${prompt}\n${codeBlock}`);

				let messages = [
					{
						"role": "system",
						"content": `You are currently writing code. There should be no text in your responses that could disrupt the operation of the code. 
						  Comments and documentation should be written in English. Write only the code that is requested or make edits if they are requested.`
					}
				];

				// messages.push(context.workspaceState.get('codeplusdev-gpt-messages'));
				messages.push({
					"role": "user",
					"content": `${prompt}\n${codeBlock}`
				});

				context.workspaceState.update('codeplusdev-gpt-messages', messages);

				try {
					const response = await axios.post('https://api.openai.com/v1/chat/completions', {
						model: gptModel,
						messages: messages
					}, {
						headers: {
							'Authorization': `Bearer ${openaiApiKey}`
						}
					});

					let completion = response.data.choices[0].message.content;

					const regex = new RegExp(`(.*?)\`\`\`[a-z]+\\s+([\\s\\S]*?)\\s+\`\`\`(.*?)`, 'm');

					const matches = completion.match(regex);

					if (matches && matches.length > 1) {
						completion = "\n\n/*\n" + matches[1] + "\n*/\n\n";
						completion += matches[2];
						completion += "\n\n/*\n" + matches[3] + "\n*/\n\n";
					}

					console.log(completion);

					await editor.edit(editBuilder => {
						const start = new vscode.Position(commentLine + 1, 0);
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
