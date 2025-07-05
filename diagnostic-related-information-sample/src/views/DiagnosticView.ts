import * as vscode from 'vscode';
import { DiagnosticItem } from '../models/DiagnosticItem';

export class DiagnosticView {
    private collection: vscode.DiagnosticCollection;

    constructor() {
        this.collection = vscode.languages.createDiagnosticCollection('mvc-diagnostics');
    }

    public updateDiagnostics(document: vscode.TextDocument, diagnosticItems: DiagnosticItem[]): void {
        if (diagnosticItems.length === 0) {
            this.collection.delete(document.uri);
            return;
        }

        const vscDiagnostics = diagnosticItems.map(item => item.toVSCodeDiagnostic(document));
        this.collection.set(document.uri, vscDiagnostics);
    }

    public clearDiagnostics(document?: vscode.TextDocument): void {
        if (document) {
            this.collection.delete(document.uri);
        } else {
            this.collection.clear();
        }
    }

    public dispose(): void {
        this.collection.dispose();
    }

    public getCollection(): vscode.DiagnosticCollection {
        return this.collection;
    }
}