import * as vscode from 'vscode';
import { DiagnosticController } from './controllers/DiagnosticController';

let controller: DiagnosticController;

export function activate(context: vscode.ExtensionContext) {
	controller = new DiagnosticController(context);
}

export function deactivate() {
	if (controller) {
		controller.dispose();
	}
}
