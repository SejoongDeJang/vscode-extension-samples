# Diagnostic CLI

A powerful command-line tool for analyzing code files and generating diagnostic reports.

## Installation

```bash
npm install -g diagnostic-cli
```

## Usage

### Analyze Files

Analyze files in a directory and generate diagnostic reports:

```bash
# Analyze current directory
diagnostic-cli analyze

# Analyze specific directory
diagnostic-cli analyze -d /path/to/project

# Generate JSON report
diagnostic-cli analyze -f json

# Save report to file
diagnostic-cli analyze -o report.html -f html
```

### Configuration Management

Manage diagnostic configuration:

```bash
# Initialize configuration
diagnostic-cli init

# Set configuration values
diagnostic-cli config -s maxLineLength=100
diagnostic-cli config -s rules.CONSOLE_LOG.enabled=false

# Get configuration values
diagnostic-cli config -g maxLineLength
diagnostic-cli config -g rules.CONSOLE_LOG.enabled

# List all configuration
diagnostic-cli config -l
```

### Validate Configuration

Validate your diagnostic configuration:

```bash
# Validate default configuration
diagnostic-cli validate

# Validate specific configuration file
diagnostic-cli validate -c /path/to/config.json
```

## Commands

### `analyze`

Analyze files for diagnostic information.

**Options:**
- `-d, --directory <path>` - Directory to analyze (default: current directory)
- `-f, --format <format>` - Output format: json, text, html (default: text)
- `-o, --output <file>` - Output file path

**Examples:**
```bash
diagnostic-cli analyze -d ./src -f json -o report.json
diagnostic-cli analyze -d ./project -f html -o report.html
```

### `config`

Manage configuration settings.

**Options:**
- `-s, --set <key=value>` - Set configuration value
- `-g, --get <key>` - Get configuration value
- `-l, --list` - List all configuration values

**Examples:**
```bash
diagnostic-cli config -s maxLineLength=120
diagnostic-cli config -g outputFormat
diagnostic-cli config -l
```

### `validate`

Validate diagnostic configuration.

**Options:**
- `-c, --config <path>` - Configuration file path

**Examples:**
```bash
diagnostic-cli validate
diagnostic-cli validate -c ./custom-config.json
```

### `init`

Initialize diagnostic configuration with default values.

**Example:**
```bash
diagnostic-cli init
```

## Configuration

The configuration file is stored at `~/.diagnostic-cli/config.json` and includes:

### Default Configuration

```json
{
  "rules": {
    "TODO_COMMENT": {
      "enabled": true,
      "severity": "info"
    },
    "CONSOLE_LOG": {
      "enabled": true,
      "severity": "warning"
    },
    "LINE_TOO_LONG": {
      "enabled": true,
      "severity": "warning"
    },
    "TRAILING_WHITESPACE": {
      "enabled": true,
      "severity": "info"
    }
  },
  "excludePatterns": [
    "node_modules/**",
    ".git/**",
    "dist/**",
    "build/**",
    "*.min.js"
  ],
  "includePatterns": [
    "**/*.js",
    "**/*.ts",
    "**/*.jsx",
    "**/*.tsx",
    "**/*.py",
    "**/*.java",
    "**/*.cpp",
    "**/*.c",
    "**/*.rs"
  ],
  "outputFormat": "text",
  "maxLineLength": 120,
  "checkTrailingWhitespace": true,
  "checkTodoComments": true,
  "checkConsoleStatements": true
}
```

## Supported File Types

- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- Python (.py)
- Java (.java)
- C++ (.cpp)
- C (.c)
- Rust (.rs)

## Output Formats

### Text
Human-readable text format with colored output.

### JSON
Machine-readable JSON format for integration with other tools.

### HTML
Beautiful HTML report with interactive features.

## Features

- 🔍 **Multi-language support** - Analyze various programming languages
- 📊 **Multiple output formats** - Text, JSON, and HTML reports
- ⚙️ **Configurable rules** - Customize which issues to detect
- 🎨 **Beautiful reports** - Clean and professional output
- 🚀 **Fast analysis** - Efficient file processing
- 🔧 **CLI interface** - Easy to use command-line interface

## Examples

### Basic Usage

```bash
# Quick analysis of current directory
diagnostic-cli analyze

# Analyze with custom settings
diagnostic-cli analyze -d ./src -f html -o report.html
```

### Advanced Configuration

```bash
# Initialize configuration
diagnostic-cli init

# Disable console.log warnings
diagnostic-cli config -s rules.CONSOLE_LOG.enabled=false

# Set custom line length
diagnostic-cli config -s maxLineLength=100

# Validate configuration
diagnostic-cli validate
```

## Development

```bash
# Clone the repository
git clone https://github.com/your-username/diagnostic-cli.git

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details.