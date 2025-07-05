import * as fs from 'fs-extra';
import * as path from 'path';
import { DiagnosticResult, DiagnosticIssue } from './DiagnosticService';

export class ReportService {
  public async generateReport(results: DiagnosticResult[], format: string): Promise<string> {
    switch (format.toLowerCase()) {
      case 'json':
        return this.generateJsonReport(results);
      case 'html':
        return this.generateHtmlReport(results);
      case 'text':
      default:
        return this.generateTextReport(results);
    }
  }

  public async saveReport(report: string, filePath: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, report, 'utf-8');
  }

  private generateJsonReport(results: DiagnosticResult[]): string {
    return JSON.stringify({
      summary: this.generateSummary(results),
      results: results
    }, null, 2);
  }

  private generateTextReport(results: DiagnosticResult[]): string {
    let report = '';
    const summary = this.generateSummary(results);

    // Header
    report += '📋 Diagnostic Report\n';
    report += '==================\n\n';

    // Summary
    report += `📊 Summary:\n`;
    report += `  - Total files analyzed: ${summary.totalFiles}\n`;
    report += `  - Files with issues: ${summary.filesWithIssues}\n`;
    report += `  - Total issues: ${summary.totalIssues}\n`;
    report += `  - Errors: ${summary.errors}\n`;
    report += `  - Warnings: ${summary.warnings}\n`;
    report += `  - Info: ${summary.info}\n\n`;

    // Details
    if (results.length > 0) {
      report += '📝 Details:\n';
      report += '----------\n\n';

      for (const result of results) {
        if (result.issues.length > 0) {
          report += `📄 ${result.file}:\n`;
          
          for (const issue of result.issues) {
            const severityIcon = this.getSeverityIcon(issue.severity);
            report += `  ${severityIcon} Line ${issue.line}:${issue.column} - ${issue.message}`;
            if (issue.code) {
              report += ` (${issue.code})`;
            }
            report += '\n';
          }
          report += '\n';
        }
      }
    }

    return report;
  }

  private generateHtmlReport(results: DiagnosticResult[]): string {
    const summary = this.generateSummary(results);
    
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagnostic Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .summary {
            background-color: #ecf0f1;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .summary-item {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .summary-item h3 {
            margin: 0 0 10px 0;
            color: #34495e;
        }
        .summary-item .number {
            font-size: 2em;
            font-weight: bold;
            color: #3498db;
        }
        .file-section {
            margin-bottom: 30px;
            border: 1px solid #bdc3c7;
            border-radius: 5px;
            overflow: hidden;
        }
        .file-header {
            background-color: #34495e;
            color: white;
            padding: 15px;
            font-weight: bold;
        }
        .issue {
            padding: 10px 15px;
            border-bottom: 1px solid #ecf0f1;
            display: flex;
            align-items: center;
        }
        .issue:last-child {
            border-bottom: none;
        }
        .issue-icon {
            margin-right: 10px;
            font-size: 1.2em;
        }
        .issue-location {
            font-weight: bold;
            color: #7f8c8d;
            margin-right: 10px;
        }
        .issue-message {
            flex: 1;
        }
        .issue-code {
            font-family: monospace;
            background-color: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.9em;
        }
        .error { background-color: #ffe6e6; }
        .warning { background-color: #fff3cd; }
        .info { background-color: #e7f3ff; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 Diagnostic Report</h1>
        
        <div class="summary">
            <h2>📊 Summary</h2>
            <div class="summary-grid">
                <div class="summary-item">
                    <h3>Total Files</h3>
                    <div class="number">${summary.totalFiles}</div>
                </div>
                <div class="summary-item">
                    <h3>Files with Issues</h3>
                    <div class="number">${summary.filesWithIssues}</div>
                </div>
                <div class="summary-item">
                    <h3>Total Issues</h3>
                    <div class="number">${summary.totalIssues}</div>
                </div>
                <div class="summary-item">
                    <h3>Errors</h3>
                    <div class="number" style="color: #e74c3c;">${summary.errors}</div>
                </div>
                <div class="summary-item">
                    <h3>Warnings</h3>
                    <div class="number" style="color: #f39c12;">${summary.warnings}</div>
                </div>
                <div class="summary-item">
                    <h3>Info</h3>
                    <div class="number" style="color: #3498db;">${summary.info}</div>
                </div>
            </div>
        </div>`;

    if (results.length > 0) {
      html += '<h2>📝 Details</h2>';
      
      for (const result of results) {
        if (result.issues.length > 0) {
          html += `
        <div class="file-section">
            <div class="file-header">📄 ${result.file}</div>`;
          
          for (const issue of result.issues) {
            const severityClass = issue.severity;
            const severityIcon = this.getSeverityIcon(issue.severity);
            html += `
            <div class="issue ${severityClass}">
                <span class="issue-icon">${severityIcon}</span>
                <span class="issue-location">Line ${issue.line}:${issue.column}</span>
                <span class="issue-message">${issue.message}</span>
                ${issue.code ? `<span class="issue-code">${issue.code}</span>` : ''}
            </div>`;
          }
          
          html += '</div>';
        }
      }
    }

    html += `
    </div>
</body>
</html>`;

    return html;
  }

  private generateSummary(results: DiagnosticResult[]): {
    totalFiles: number;
    filesWithIssues: number;
    totalIssues: number;
    errors: number;
    warnings: number;
    info: number;
  } {
    const summary = {
      totalFiles: results.length,
      filesWithIssues: 0,
      totalIssues: 0,
      errors: 0,
      warnings: 0,
      info: 0
    };

    for (const result of results) {
      if (result.issues.length > 0) {
        summary.filesWithIssues++;
      }
      
      for (const issue of result.issues) {
        summary.totalIssues++;
        switch (issue.severity) {
          case 'error':
            summary.errors++;
            break;
          case 'warning':
            summary.warnings++;
            break;
          case 'info':
            summary.info++;
            break;
        }
      }
    }

    return summary;
  }

  private getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📝';
    }
  }
}