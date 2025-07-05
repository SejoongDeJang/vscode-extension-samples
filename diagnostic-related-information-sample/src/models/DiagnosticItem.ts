import * as vscode from 'vscode';

export interface DiagnosticItemData {
    code: string;
    message: string;
    range: {
        start: { line: number; character: number };
        end: { line: number; character: number };
    };
    severity: 'Error' | 'Warning' | 'Information' | 'Hint';
    source: string;
    relatedInformation?: Array<{
        location: {
            uri: string;
            range: {
                start: { line: number; character: number };
                end: { line: number; character: number };
            };
        };
        message: string;
    }>;
}

export class DiagnosticItem {
    private data: DiagnosticItemData;

    constructor(data: DiagnosticItemData) {
        this.data = data;
    }

    public getMessage(): string {
        return this.data.message;
    }

    public getCode(): string {
        return this.data.code;
    }

    public getRange(): DiagnosticItemData['range'] {
        return this.data.range;
    }

    public getSeverity(): DiagnosticItemData['severity'] {
        return this.data.severity;
    }

    public getSource(): string {
        return this.data.source;
    }

    public getRelatedInformation(): DiagnosticItemData['relatedInformation'] {
        return this.data.relatedInformation;
    }

    public toVSCodeDiagnostic(document: vscode.TextDocument): vscode.Diagnostic {
        const diagnostic = new vscode.Diagnostic(
            new vscode.Range(
                new vscode.Position(this.data.range.start.line, this.data.range.start.character),
                new vscode.Position(this.data.range.end.line, this.data.range.end.character)
            ),
            this.data.message,
            this.getSeverityLevel()
        );

        diagnostic.code = this.data.code;
        diagnostic.source = this.data.source;

        if (this.data.relatedInformation) {
            diagnostic.relatedInformation = this.data.relatedInformation.map(info => 
                new vscode.DiagnosticRelatedInformation(
                    new vscode.Location(
                        vscode.Uri.parse(info.location.uri),
                        new vscode.Range(
                            new vscode.Position(info.location.range.start.line, info.location.range.start.character),
                            new vscode.Position(info.location.range.end.line, info.location.range.end.character)
                        )
                    ),
                    info.message
                )
            );
        }

        return diagnostic;
    }

    private getSeverityLevel(): vscode.DiagnosticSeverity {
        switch (this.data.severity) {
            case 'Error':
                return vscode.DiagnosticSeverity.Error;
            case 'Warning':
                return vscode.DiagnosticSeverity.Warning;
            case 'Information':
                return vscode.DiagnosticSeverity.Information;
            case 'Hint':
                return vscode.DiagnosticSeverity.Hint;
            default:
                return vscode.DiagnosticSeverity.Error;
        }
    }
}