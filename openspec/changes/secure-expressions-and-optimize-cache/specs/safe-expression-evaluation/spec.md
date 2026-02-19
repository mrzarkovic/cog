## ADDED Requirements

### Requirement: Expression validation for security

The system SHALL validate all template expressions at compile-time and reject expressions containing potentially unsafe language features. Unsafe features include global object access (`window`, `document`, `global`), function constructors (`Function`, `eval`), dynamic code execution, or other patterns that could lead to arbitrary code execution.

#### Scenario: Reject window access

- **WHEN** a template expression contains `window.location`
- **THEN** the system throws a validation error and prevents the expression from being compiled

#### Scenario: Reject eval and Function

- **WHEN** a template expression contains `eval(...)` or `Function(...)`
- **THEN** the system throws a validation error

#### Scenario: Reject fetch and XMLHttpRequest

- **WHEN** a template expression contains `fetch(...)` or `new XMLHttpRequest()`
- **THEN** the system throws a validation error

#### Scenario: Reject proto pollution

- **WHEN** a template expression contains `__proto__`, `constructor`, or `prototype`
- **THEN** the system throws a validation error

### Requirement: Safe property and method access

The system SHALL allow safe property and method access on variables and nested objects. Property access includes dot notation and bracket notation. Method calls are allowed only on safe types (Array, String, Number, Object, Boolean, Date).

#### Scenario: Allow simple property access

- **WHEN** template expression is `{{ user.name }}`
- **THEN** the expression evaluates and returns the value of `user.name`

#### Scenario: Allow nested property access

- **WHEN** template expression is `{{ user.profile.settings.theme }}`
- **THEN** the expression evaluates and returns the deeply nested value

#### Scenario: Allow bracket notation

- **WHEN** template expression is `{{ items[0] }}` or `{{ data['key'] }}`
- **THEN** the expression evaluates and returns the accessed value

#### Scenario: Allow safe array methods

- **WHEN** template expression is `{{ items.length }}` or `{{ names.map(...) }}`
- **THEN** the expression evaluates successfully (Array methods are in the allowed list)

#### Scenario: Allow safe string methods

- **WHEN** template expression is `{{ message.toUpperCase() }}` or `{{ text.slice(0, 5) }}`
- **THEN** the expression evaluates successfully (String methods are in the allowed list)

### Requirement: Arithmetic and comparison operators

The system SHALL support all arithmetic operators (`+`, `-`, `*`, `/`, `%`), comparison operators (`<`, `>`, `<=`, `>=`, `==`, `===`, `!=`, `!==`), and logical operators (`&&`, `||`, `!`).

#### Scenario: Arithmetic operations

- **WHEN** template expression is `{{ a + b }}` or `{{ count * 2 }}`
- **THEN** the expression evaluates correctly

#### Scenario: Comparison operations

- **WHEN** template expression is `{{ x > 5 }}` or `{{ name === 'John' }}`
- **THEN** the expression evaluates to a boolean result

#### Scenario: Logical operations

- **WHEN** template expression is `{{ isActive && isVisible }}` or `{{ !disabled }}`
- **THEN** the expression evaluates correctly

### Requirement: Ternary and conditional operators

The system SHALL support the ternary conditional operator (`? :`) for inline conditionals.

#### Scenario: Ternary operator

- **WHEN** template expression is `{{ isLoading ? 'Loading...' : 'Done' }}`
- **THEN** the expression evaluates to the correct branch

### Requirement: Function calls within expressions

The system SHALL allow function calls on safe built-in methods and user-provided functions defined in the Cog state. Function calls on arbitrary global functions (like `parseInt` from window) are restricted unless explicitly whitelisted.

#### Scenario: Call user-defined function

- **WHEN** state contains a function variable `const format = variable('format', (x) => x.toFixed(2))`
- **THEN** template expression `{{ format(value) }}` evaluates correctly

#### Scenario: Call safe built-in methods

- **WHEN** template expression is `{{ parseInt(count) }}` (from user state, not global)
- **THEN** if `parseInt` is defined in state, it evaluates; otherwise validation error

#### Scenario: Reject arbitrary global function calls

- **WHEN** template expression is `{{ setTimeout(() => {}, 1000) }}`
- **THEN** the system throws a validation error (setTimeout is not in safe call list)

### Requirement: Cache optimization

The system SHALL cache compiled expression functions using a stable cache key independent of the full state object. The cache key SHALL be based on the expression content only, not on state variable names or count.

#### Scenario: Cache hit with different state sizes

- **WHEN** same expression `{{ count + 1 }}` is used with different numbers of state variables (10 vars initially, then 20 vars)
- **THEN** the cached compiled function is reused; no recompilation occurs

#### Scenario: Cache miss on different expression

- **WHEN** expression `{{ count + 1 }}` is in cache, then a new expression `{{ count + 2 }}` is evaluated
- **THEN** the new expression is compiled and cached separately

#### Scenario: Cache is memory-bounded

- **WHEN** 1000+ unique expressions are evaluated over time
- **THEN** the cache maintains reasonable memory usage (no unbounded growth); least-recently-used expressions may be evicted

### Requirement: Backward compatibility

The system SHALL maintain compatibility with all existing safe Cog templates. Expressions that worked before (and are still safe) SHALL continue to work without modification.

#### Scenario: Existing counter app works unchanged

- **WHEN** an existing counter app with `{{ count }}` expressions is used
- **THEN** the expressions work exactly as before with no code changes required

#### Scenario: Existing list rendering works unchanged

- **WHEN** existing list template with `{{ items.map(item => `<div>{{ item.name }}</div>`) }}` is used
- **THEN** the template works exactly as before

### Requirement: Clear error messages

The system SHALL provide clear, actionable error messages when expression validation fails. Error messages SHALL indicate what pattern was rejected and why.

#### Scenario: Helpful rejection message

- **WHEN** a template expression contains `{{ window.alert('hi') }}`
- **THEN** the error message clearly states: "Invalid expression: 'window' is not allowed" or similar

#### Scenario: Error message includes suggestion

- **WHEN** developer uses `fetch()` in an expression
- **THEN** the error suggests moving the fetch call to a `variable()` function instead
