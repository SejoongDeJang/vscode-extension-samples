import * as fs from 'fs-extra';
import * as path from 'path';

export interface DiagnosticResult {
  file: string;
  issues: DiagnosticIssue[];
}

export interface DiagnosticIssue {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code?: string;
  source?: string;
}

export class DiagnosticService {
  private supportedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.rs'];

  public async analyzeDirectory(directoryPath: string): Promise<DiagnosticResult[]> {
    const files = await this.getFilesRecursively(directoryPath);
    const results: DiagnosticResult[] = [];

    for (const file of files) {
      if (this.isSupportedFile(file)) {
        const issues = await this.analyzeFile(file);
        results.push({ file, issues });
      }
    }

    return results;
  }

  public async analyzeFile(filePath: string): Promise<DiagnosticIssue[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const issues: DiagnosticIssue[] = [];

      // Simple static analysis - look for common issues
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;

        // Check for TODO comments
        if (line.includes('TODO') || line.includes('FIXME')) {
          issues.push({
            line: lineNumber,
            column: line.indexOf('TODO') !== -1 ? line.indexOf('TODO') : line.indexOf('FIXME'),
            message: 'TODO/FIXME comment found',
            severity: 'info',
            code: 'TODO_COMMENT',
            source: 'diagnostic-cli'
          });
        }

        // Check for console.log (in JS/TS files)
        if (this.isJavaScriptFile(filePath) && line.includes('console.log')) {
          issues.push({
            line: lineNumber,
            column: line.indexOf('console.log'),
            message: 'Console statement found - consider removing for production',
            severity: 'warning',
            code: 'CONSOLE_LOG',
            source: 'diagnostic-cli'
          });
        }

        // Check for very long lines
        if (line.length > 120) {
          issues.push({
            line: lineNumber,
            column: 120,
            message: 'Line too long (over 120 characters)',
            severity: 'warning',
            code: 'LINE_TOO_LONG',
            source: 'diagnostic-cli'
          });
        }

        // Check for trailing whitespace
        if (line.endsWith(' ') || line.endsWith('\t')) {
          issues.push({
            line: lineNumber,
            column: line.length,
            message: 'Trailing whitespace found',
            severity: 'info',
            code: 'TRAILING_WHITESPACE',
            source: 'diagnostic-cli'
          });
        }
      }

      return issues;
    } catch (error) {
      return [{
        line: 1,
        column: 1,
        message: `Error reading file: ${error}`,
        severity: 'error',
        code: 'FILE_READ_ERROR',
        source: 'diagnostic-cli'
      }];
    }
  }

  private async getFilesRecursively(dir: string): Promise<string[]> {
    const files: string[] = [];
    const items = await fs.readdir(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .git directories
        if (item !== 'node_modules' && item !== '.git' && !item.startsWith('.')) {
          const subFiles = await this.getFilesRecursively(fullPath);
          files.push(...subFiles);
        }
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  private isSupportedFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    return this.supportedExtensions.includes(ext);
  }

  private isJavaScriptFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    return ['.js', '.ts', '.jsx', '.tsx'].includes(ext);
  }
}