### Names

- Use PascalCase for type names.
- Do not use I as a prefix for interface names.
- Use PascalCase for enum values.
- Use camelCase for function names.
- Use camelCase for property names and local variables.
- Do not use \_ as a prefix for private properties.
- Use whole words in names when possible.

### Components

- 1 file per logical component (e.g. parser, scanner, emitter, checker).
- Do not add new files. :)
- files with .generated.\* suffix are auto-generated, do not hand-edit them.

### Types

- Do not export types/functions unless you need to share it across multiple components.
- Do not introduce new types/values to the global namespace.
- Shared types should be defined in types.ts.
- Within a file, type definitions should come first.

### null and undefined

- Use undefined. Do not use null.

### General Assumptions

- Consider objects like Nodes, Symbols, etc. as immutable outside the component that created them. Do not change them.
- Consider arrays as immutable by default after creation.

### Classes

For consistency, do not use classes in the core compiler pipeline. Use function closures instead.

### Flags

More than 2 related Boolean properties on a type should be turned into a flag.

### Comments

Use JSDoc style comments for functions, interfaces, enums, and classes.

### Strings

- Use double quotes for strings.
- All strings visible to the user need to be localized (make an entry in diagnosticMessages.json).

### Diagnostic Messages

- Use a period at the end of a sentence.
- Use indefinite articles for indefinite entities.
- Definite entities should be named (this is for a variable name, type name, etc..).
- When stating a rule, the subject should be in the singular (e.g. "An external module cannot..." instead of "External modules cannot...").
- Use present tense.
