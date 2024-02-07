import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.findGptComments', async () => {
		const editor = vscode.window.activeTextEditor;
		const config = vscode.workspace.getConfiguration('gpt3integration');
		const openaiApiKey = config.get<string>('openaiApiKey');

		if (!editor) {
			vscode.window.showInformationMessage('No active editor');
			return;
		}

		console.log(editor);

		if (!openaiApiKey) {
			vscode.window.showWarningMessage('OpenAI API key is not set. Please configure it in the extension settings.');
		}

		const document = editor.document;

		const lines = document.getText().split(/\r?\n/);

		const regex = /\/\/ GPT: (.+)\n(([^\n]+\n{0,3})*)/;

		let match;
		let commentLine = 0;
		let endLine = 0;
		let codeStarted = false;
		let prompt = '';
		let codeBlock = '';
		let prompts = [];

		lines.forEach((text) => {
			if (codeStarted) {
				// Burada kod bloğunun boyutunu veya token sayısını kontrol edebilirsiniz
				// Örneğin: if (codeBlock.length > MAX_LENGTH) { continue; }

				if (text.includes("\n\n\n")) {
					prompts.push({prompt:"", code: "", commentLine, endLine});
					codeStarted = false;
				}

				codeBlock += text + "\n";

				return;
			}

			match = regex.exec(text);
			if (match) {
				commentLine = document.positionAt(match.index).line;
				endLine = commentLine + lines.length - 1;

				prompt = match[1].trim();


				return;
			}

		});

		try {
			if (!openaiApiKey) {
				vscode.window.showWarningMessage('OpenAI API key is not set. Please configure it in the extension settings.');
				return;
			}

			const response = await axios.post('https://api.openai.com/v1/completions', {
				model: 'text-davinci-002',
				prompt: `${prompt}\n${codeBlock}`,
				temperature: 0.5,
				max_tokens: 100, // Token limitini burada belirleyin
			}, {
				headers: {
					'Authorization': `Bearer ${openaiApiKey}`
				}
			});

			const completion = response.data.choices[0].text.trim();
			await editor.edit(editBuilder => {
				editBuilder.replace(new vscode.Range(commentLine + 1, 0, endLine, 0), completion);
			});
		} catch (error) {
			console.error('Error calling OpenAI:', error);
			vscode.window.showErrorMessage('Failed to call OpenAI API');
		}

		context.subscriptions.push(disposable);
	});
}

export function deactivate() { }
