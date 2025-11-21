import * as vscode from "vscode";
import * as path from "path";

export const activate = (context) => {
	const provider = vscode.languages.registerDocumentLinkProvider(
		[
			{ language: "html", scheme: "file" },
			{ language: "css", scheme: "file" },
		],
		{
			provideDocumentLinks(document) {
				const ws = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ||
					"";
				const text = document.getText();
				const links = [];
				const regex = /@basePath\/[A-Za-z0-9._\-\/]+/g;
				let m;
				while ((m = regex.exec(text)) !== null) {
					const raw = m[0];
					const rest = raw.slice("@basePath/".length);
					const resolved = path.join(ws, rest);
					const start = document.positionAt(m.index);
					const end = document.positionAt(m.index + raw.length);
					links.push(
						new vscode.DocumentLink(
							new vscode.Range(start, end),
							vscode.Uri.file(resolved),
						),
					);
				}
				return links;
			},
		},
	);
	context.subscriptions.push(provider);
};
