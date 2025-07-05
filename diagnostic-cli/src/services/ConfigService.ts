import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

export interface DiagnosticConfig {
  rules: {
    [key: string]: {
      enabled: boolean;
      severity: 'error' | 'warning' | 'info';
      options?: any;
    };
  };
  excludePatterns: string[];
  includePatterns: string[];
  outputFormat: 'json' | 'text' | 'html';
  maxLineLength: number;
  checkTrailingWhitespace: boolean;
  checkTodoComments: boolean;
  checkConsoleStatements: boolean;
}

export class ConfigService {
  private configPath: string;
  private defaultConfig: DiagnosticConfig = {
    rules: {
      'TODO_COMMENT': {
        enabled: true,
        severity: 'info'
      },
      'CONSOLE_LOG': {
        enabled: true,
        severity: 'warning'
      },
      'LINE_TOO_LONG': {
        enabled: true,
        severity: 'warning'
      },
      'TRAILING_WHITESPACE': {
        enabled: true,
        severity: 'info'
      }
    },
    excludePatterns: [
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**',
      '*.min.js'
    ],
    includePatterns: [
      '**/*.js',
      '**/*.ts',
      '**/*.jsx',
      '**/*.tsx',
      '**/*.py',
      '**/*.java',
      '**/*.cpp',
      '**/*.c',
      '**/*.rs'
    ],
    outputFormat: 'text',
    maxLineLength: 120,
    checkTrailingWhitespace: true,
    checkTodoComments: true,
    checkConsoleStatements: true
  };

  constructor() {
    this.configPath = path.join(os.homedir(), '.diagnostic-cli', 'config.json');
  }

  public async getConfig(): Promise<DiagnosticConfig> {
    try {
      if (await fs.pathExists(this.configPath)) {
        const config = await fs.readJSON(this.configPath);
        return { ...this.defaultConfig, ...config };
      }
    } catch (error) {
      console.warn('Warning: Could not read config file, using defaults');
    }
    return this.defaultConfig;
  }

  public async setConfig(key: string, value: any): Promise<void> {
    const config = await this.getConfig();
    const keys = key.split('.');
    let current = config as any;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    await this.saveConfig(config);
  }

  public async getConfigValue(key: string): Promise<any> {
    const config = await this.getConfig();
    const keys = key.split('.');
    let current = config as any;

    for (const k of keys) {
      if (!(k in current)) {
        return undefined;
      }
      current = current[k];
    }

    return current;
  }

  public async getAllConfig(): Promise<DiagnosticConfig> {
    return await this.getConfig();
  }

  public async saveConfig(config: DiagnosticConfig): Promise<void> {
    await fs.ensureDir(path.dirname(this.configPath));
    await fs.writeJSON(this.configPath, config, { spaces: 2 });
  }

  public async initializeConfig(): Promise<void> {
    await this.saveConfig(this.defaultConfig);
  }

  public async validateConfig(configPath?: string): Promise<boolean> {
    try {
      const targetPath = configPath || this.configPath;
      
      if (!(await fs.pathExists(targetPath))) {
        return false;
      }

      const config = await fs.readJSON(targetPath);
      
      // Basic validation
      if (!config || typeof config !== 'object') {
        return false;
      }

      // Check required fields
      const requiredFields = ['rules', 'excludePatterns', 'includePatterns', 'outputFormat'];
      for (const field of requiredFields) {
        if (!(field in config)) {
          return false;
        }
      }

      // Validate outputFormat
      if (!['json', 'text', 'html'].includes(config.outputFormat)) {
        return false;
      }

      // Validate rules
      if (typeof config.rules !== 'object') {
        return false;
      }

      for (const [ruleName, rule] of Object.entries(config.rules)) {
        if (typeof rule !== 'object' || !rule) {
          return false;
        }

        const ruleObj = rule as any;
        if (typeof ruleObj.enabled !== 'boolean') {
          return false;
        }

        if (!['error', 'warning', 'info'].includes(ruleObj.severity)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}