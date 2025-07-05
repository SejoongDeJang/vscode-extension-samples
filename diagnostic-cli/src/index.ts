#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { DiagnosticService } from './services/DiagnosticService';
import { ConfigService } from './services/ConfigService';
import { ReportService } from './services/ReportService';

const program = new Command();

program
  .name('diagnostic-cli')
  .description('CLI tool for managing diagnostic information')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analyze files for diagnostic information')
  .option('-d, --directory <path>', 'Directory to analyze', '.')
  .option('-f, --format <format>', 'Output format (json, text, html)', 'text')
  .option('-o, --output <file>', 'Output file path')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔍 Analyzing files...'));
      
      const diagnosticService = new DiagnosticService();
      const results = await diagnosticService.analyzeDirectory(options.directory);
      
      const reportService = new ReportService();
      const report = await reportService.generateReport(results, options.format);
      
      if (options.output) {
        await reportService.saveReport(report, options.output);
        console.log(chalk.green(`✅ Report saved to ${options.output}`));
      } else {
        console.log(report);
      }
    } catch (error) {
      console.error(chalk.red('❌ Error during analysis:'), error);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Manage configuration')
  .option('-s, --set <key=value>', 'Set configuration value')
  .option('-g, --get <key>', 'Get configuration value')
  .option('-l, --list', 'List all configuration values')
  .action(async (options) => {
    try {
      const configService = new ConfigService();
      
      if (options.set) {
        const [key, value] = options.set.split('=');
        if (!key || !value) {
          console.error(chalk.red('❌ Invalid format. Use: key=value'));
          process.exit(1);
        }
        await configService.setConfig(key, value);
        console.log(chalk.green(`✅ Configuration set: ${key}=${value}`));
      } else if (options.get) {
        const value = await configService.getConfigValue(options.get);
        console.log(`${options.get}: ${value || 'Not set'}`);
      } else if (options.list) {
        const config = await configService.getAllConfig();
        console.log(chalk.blue('📋 Configuration:'));
        Object.entries(config).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
    } catch (error) {
      console.error(chalk.red('❌ Error managing configuration:'), error);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate diagnostic configuration')
  .option('-c, --config <path>', 'Configuration file path')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔍 Validating configuration...'));
      
      const configService = new ConfigService();
      const isValid = await configService.validateConfig(options.config);
      
      if (isValid) {
        console.log(chalk.green('✅ Configuration is valid'));
      } else {
        console.log(chalk.red('❌ Configuration is invalid'));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('❌ Error validating configuration:'), error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize diagnostic configuration')
  .action(async () => {
    try {
      console.log(chalk.blue('🚀 Initializing diagnostic configuration...'));
      
      const configService = new ConfigService();
      await configService.initializeConfig();
      
      console.log(chalk.green('✅ Configuration initialized successfully'));
    } catch (error) {
      console.error(chalk.red('❌ Error initializing configuration:'), error);
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}