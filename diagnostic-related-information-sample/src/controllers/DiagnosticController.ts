import * as vscode from 'vscode';
import { DiagnosticProviderManager, RustDiagnosticProvider } from '../providers/DiagnosticProvider';
import { DiagnosticView } from '../views/DiagnosticView';

export class DiagnosticController {
    private providerManager: DiagnosticProviderManager;
    private view: DiagnosticView;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.providerManager = new DiagnosticProviderManager();
        this.view = new DiagnosticView();
        this.setupProviders();
        this.setupEventListeners();
    }

    private setupProviders(): void {
        const rustProvider = new RustDiagnosticProvider();
        this.providerManager.registerProvider('rust', rustProvider);
    }

    private setupEventListeners(): void {
        // 활성 편집기 변경 시 진단 업데이트
        this.context.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor(editor => {
                if (editor) {
                    this.updateDiagnostics(editor.document);
                }
            })
        );

        // 문서 내용 변경 시 진단 업데이트
        this.context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(event => {
                this.updateDiagnostics(event.document);
            })
        );

        // 초기 진단 설정
        if (vscode.window.activeTextEditor) {
            this.updateDiagnostics(vscode.window.activeTextEditor.document);
        }
    }

    private updateDiagnostics(document: vscode.TextDocument): void {
        const diagnosticItems = this.providerManager.provideDiagnostics(document);
        this.view.updateDiagnostics(document, diagnosticItems);
    }

    public dispose(): void {
        this.view.dispose();
    }

    public getProviderManager(): DiagnosticProviderManager {
        return this.providerManager;
    }
}