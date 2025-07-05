# Diagnostic Related Information Sample (MVC Architecture)

This sample demonstrates how to provide diagnostic related information in VS Code extensions using the MVC (Model-View-Controller) architectural pattern.

## Architecture Overview

The extension has been refactored to follow the MVC pattern:

### Model (`src/models/DiagnosticItem.ts`)
- **DiagnosticItem**: Represents diagnostic data without any view-specific logic
- **DiagnosticItemData**: Interface defining the structure of diagnostic information
- Pure data model with business logic methods

### View (`src/views/DiagnosticView.ts`)
- **DiagnosticView**: Handles all VSCode UI interactions
- Manages the `DiagnosticCollection`
- Responsible for displaying diagnostics in the editor

### Controller (`src/controllers/DiagnosticController.ts`)
- **DiagnosticController**: Orchestrates the interaction between Model and View
- Handles event listeners and business logic
- Manages the application flow

### Provider (`src/providers/DiagnosticProvider.ts`)
- **IDiagnosticProvider**: Interface for diagnostic providers
- **RustDiagnosticProvider**: Specific implementation for Rust files
- **DiagnosticProviderManager**: Manages multiple diagnostic providers

## Key Features

### 🏗️ MVC Architecture
- **Separation of Concerns**: Each component has a single responsibility
- **Maintainability**: Easier to modify and extend
- **Testability**: Components can be tested independently

### 🔌 Provider Pattern
- **Extensible**: Easy to add new language providers
- **Modular**: Each provider handles specific file types
- **Manageable**: Centralized provider management

### 📊 Diagnostic Information
- Error, warning, and info level diagnostics
- Related information linking to relevant code locations
- Language-specific diagnostic rules

## File Structure

```
src/
├── models/
│   └── DiagnosticItem.ts          # Data model
├── views/
│   └── DiagnosticView.ts          # UI layer
├── controllers/
│   └── DiagnosticController.ts    # Business logic
├── providers/
│   └── DiagnosticProvider.ts      # Provider management
└── extension.ts                   # Entry point
```

## Usage

1. Open the sample in VS Code
2. Press `F5` to run the extension
3. Open a Rust file (`sample-demo.rs`)
4. See diagnostic information with related information in the Problems panel

## Sample Code

The extension analyzes `sample-demo.rs` and shows:
- Error: "cannot assign twice to immutable variable `x`"
- Related information pointing to the first assignment

## Benefits of MVC Architecture

### Before (Monolithic)
```typescript
// Everything in one function
function updateDiagnostics(document, collection) {
  // File checking logic
  // Diagnostic creation logic
  // UI update logic
  // All mixed together
}
```

### After (MVC)
```typescript
// Model: Pure data
class DiagnosticItem {
  toVSCodeDiagnostic() { /* ... */ }
}

// View: UI handling
class DiagnosticView {
  updateDiagnostics() { /* ... */ }
}

// Controller: Orchestration
class DiagnosticController {
  private updateDiagnostics() { /* ... */ }
}
```

## Extension Points

### Adding New Providers
```typescript
// Create a new provider
class JavaScriptDiagnosticProvider implements IDiagnosticProvider {
  provideDiagnostics(document: vscode.TextDocument): DiagnosticItem[] {
    // Implementation
  }
}

// Register it
providerManager.registerProvider('javascript', new JavaScriptDiagnosticProvider());
```

### Customizing Diagnostic Rules
```typescript
// In your provider
private createDiagnostic(message: string, range: vscode.Range): DiagnosticItem {
  return new DiagnosticItem({
    message,
    range: { /* ... */ },
    severity: 'error',
    // ... other properties
  });
}
```

## Related CLI Tool

This extension comes with a companion CLI tool (`diagnostic-cli`) that provides:
- File analysis capabilities
- Multiple output formats (text, JSON, HTML)
- Configuration management
- Batch processing

See the `diagnostic-cli` directory for more information.

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Run extension
# Press F5 in VS Code
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the MVC pattern
4. Add tests for new functionality
5. Submit a pull request

## License

MIT

