# Changelog

All notable changes to `@ai-sdk-tools/agents` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-07

### Added

- **Core Agent System**
  - `Agent` class with handoff capabilities built on AI SDK v5
  - Support for any AI provider (OpenAI, Anthropic, Google, Meta, xAI, etc.)
  - Tool integration with automatic handoff tool generation
  - Context preservation across agent transfers

- **Multi-Agent Orchestration**
  - `Runner` class for managing multi-agent conversations
  - Automatic agent registration and discovery
  - Execution tracing and debugging support
  - Configurable turn limits and error handling

- **Intelligent Routing**
  - `RouterAgent` for intelligent agent selection
  - `createTriageAgent` helper for common routing patterns
  - Keyword-based routing with extensible architecture
  - Support for default agents and fallback logic

- **Handoff System**
  - `createHandoff` utility for agent-to-agent transfers
  - `createHandoffTool` for automatic tool generation
  - Context processing and preservation during handoffs
  - Handoff tracing and callback support

- **Type Safety**
  - Full TypeScript support with comprehensive type definitions
  - Type-safe agent configuration and execution
  - Strongly typed handoff instructions and context
  - Generic tool and result types

- **Developer Experience**
  - Simple `run()` function for quick execution
  - Comprehensive error handling and reporting
  - Execution metadata and performance tracking
  - Integration hooks for monitoring and debugging

### Features

- **Provider Agnostic**: Works with any AI SDK v5 compatible model
- **Streaming Support**: Full compatibility with AI SDK streaming
- **Tool Integration**: Seamless integration with existing AI SDK tools
- **Context Management**: Intelligent context preservation across handoffs
- **Execution Tracing**: Complete audit trail of agent interactions
- **Flexible Architecture**: Extensible design for custom workflows

### Documentation

- Complete README with examples and API reference
- TypeScript definitions for all public APIs
- Integration examples with other @ai-sdk-tools packages
- Best practices and usage patterns
