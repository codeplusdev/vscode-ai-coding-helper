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
		const maxCodeReference = config.get<number>('maxCodeReference');
		const gptModel = config.get<string>('gptModel');

		if (!openaiApiKey) {
			vscode.window.showWarningMessage('OpenAI API key is not set. Please configure it in the extension settings.');
			return;
		}

		const languageId = editor.document.languageId;

		// 1: LF 2: CRLF
		const nl = editor.document.eol === 1 ? '\n' : '\r\n';

		const nLn = (t = 1) => {
			return nl.repeat(t);
		};

		const prompt = await vscode.window.showInputBox({
			prompt: "Please enter your GPT prompt"
		});

		const cursor_pos = editor.visibleRanges[0].start.line;

		let lineInfo = '';

		if (prompt) {
			let codeBlock = editor.document.getText(editor?.selection);
			let commentLine = editor?.selection?.start.line ?? cursor_pos;
			let endLine = editor?.selection?.end.line ?? cursor_pos;

			if (commentLine < endLine && endLine > 0) {
				lineInfo = `You are currently editing the given code between lines ${commentLine} and ${endLine}. `;
			} else if (cursor_pos > 0) {
				lineInfo = `Now you will write the desired code on lines ${cursor_pos}. `;
			}

			let fileEditInfo = `You are currently writing a full documented ${languageId} code.`;

			if (text.length > 0) {
				fileEditInfo = `You are currently editing below ${languageId} code. Please document the code well. ${lineInfo}So, write only the requested code that replaced with it.`;
			}

			let messages = [
				{
					"role": "system",
					"content": `${fileEditInfo} Comments and documentation should be written in English. 
						Write only the code that is requested or make edits if they are requested.${nl}${text.substring(0, maxCodeReference)}`
				}
			];

			// messages.push(context.workspaceState.get('vs-ai-coding-helper-by-codeplusdev-messages'));
			messages.push({
				"role": "user",
				"content": `${prompt}\n${codeBlock}`
			});

			context.workspaceState.update('vs-ai-coding-helper-by-codeplusdev-messages', messages);

			// Start timer
			const startTime = Date.now();
			vscode.window.showInformationMessage(`Code generation request has been sent!`);

			try {
				const response = await axios.post('https://api.openai.com/v1/chat/completions', {
					model: gptModel,
					messages: messages
				}, {
					headers: {
						'Authorization': `Bearer ${openaiApiKey}`
					}
				});

				// End timer
				const endTime = Date.now();
				const elapsedTime = (endTime - startTime) / 1000; // in seconds

				if (response.status === 200) {
					// Show notification with elapsed time
					vscode.window.showInformationMessage(`Code completion generated in ${elapsedTime.toFixed(2)} seconds`);
				} else {
					vscode.window.showWarningMessage(`Code generation request failed with status code ${response.status} in ${elapsedTime.toFixed(2)} seconds`);
				}

				let responseMessage = response.data.choices[0].message.content;

				console.log({ responseMessage });

				const regex = new RegExp(`\\s*([^\`]*)\\s*\`\`\`[a-z]+\\s+([\\s\\S]*?)\\s+\`\`\`\\s*([^\`]*)\\s*`, 'm');

				const matches = responseMessage.match(regex);

				let completion = '';

				if (matches && matches.length > 1) {
					let comments_prev = matches[1] || false;
					let comments_next = matches[3] || false;
					let code_block = matches[2] || codeBlock;

					if (comments_prev !== false) {
						completion += `${nl}/*${nl} ${comments_prev} ${nl}*/${nl}`;
					}

					completion += code_block ?? '';

					if (comments_next !== false) {
						completion += `${nl}/*${nl} ${comments_next} ${nl}*/${nl}`;
					}
				} else {
					completion = `${nl}/*${nl} ${responseMessage} ${nl}*/${nl}`;
				}

				completion += nl;

				/*
				 This is the completed code that open the tab: 
				*/
				await vscode.window.showTextDocument(editor.document);

				await new Promise( (resolve) => {
					setTimeout(() => {
						resolve(true);
					}, 2000 );
				});

				await vscode.window.activeTextEditor?.edit(editBuilder => {
					if (commentLine > 0) {
						const start = new vscode.Position(commentLine, 0);
						const end = new vscode.Position(endLine + 1, 0);
						const range = new vscode.Range(start, end);
						editBuilder.replace(range, completion);
						editor.selection = new vscode.Selection(start, end);
					} else {
						editBuilder.insert(new vscode.Position(cursor_pos, 0), completion);
					}
				});
			} catch (error) {
				console.error('Error calling OpenAI:', error);
				vscode.window.showErrorMessage('Failed to call OpenAI API');
			}
		}

	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
