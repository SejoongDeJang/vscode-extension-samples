import * as vscode from 'vscode';
import * as path from 'path';
import { DiagnosticItem, DiagnosticItemData } from '../models/DiagnosticItem';

export interface IDiagnosticProvider {
    provideDiagnostics(document: vscode.TextDocument): DiagnosticItem[];
}

export class RustDiagnosticProvider implements IDiagnosticProvider {
    private static readonly RUST_FILE_EXTENSION = '.rs';

    provideDiagnostics(document: vscode.TextDocument): DiagnosticItem[] {
        if (!this.isRustFile(document)) {
            return [];
        }

        if (!this.isTargetFile(document)) {
            return [];
        }

        return this.createSampleDiagnostics(document);
    }

    private isRustFile(document: vscode.TextDocument): boolean {
        return path.extname(document.uri.fsPath) === RustDiagnosticProvider.RUST_FILE_EXTENSION;
    }

    private isTargetFile(document: vscode.TextDocument): boolean {
        return path.basename(document.uri.fsPath) === 'sample-demo.rs';
    }

    private createSampleDiagnostics(document: vscode.TextDocument): DiagnosticItem[] {
        const diagnosticData: DiagnosticItemData = {
            code: '',
            message: 'cannot assign twice to immutable variable `x`',
            range: {
                start: { line: 3, character: 4 },
                end: { line: 3, character: 10 }
            },
            severity: 'Error',
            source: '',
            relatedInformation: [{
                location: {
                    uri: document.uri.toString(),
                    range: {
                        start: { line: 1, character: 8 },
                        end: { line: 1, character: 9 }
                    }
                },
                message: 'first assignment to `x`'
            }]
        };

        return [new DiagnosticItem(diagnosticData)];
    }
}

export class DiagnosticProviderManager {
    private providers: Map<string, IDiagnosticProvider> = new Map();

    public registerProvider(languageId: string, provider: IDiagnosticProvider): void {
        this.providers.set(languageId, provider);
    }

    public unregisterProvider(languageId: string): void {
        this.providers.delete(languageId);
    }

    public getProvider(languageId: string): IDiagnosticProvider | undefined {
        return this.providers.get(languageId);
    }

    public getAllProviders(): Map<string, IDiagnosticProvider> {
        return new Map(this.providers);
    }

    public provideDiagnostics(document: vscode.TextDocument): DiagnosticItem[] {
        const provider = this.getProvider(document.languageId);
        if (!provider) {
            return [];
        }

        return provider.provideDiagnostics(document);
    }
}