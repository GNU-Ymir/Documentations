# Operator priority

The following table present the precedence of the operators, and
literals. This table presents the priority of the operators, but does
not specify how the operators are used, and their specific syntax. For
example, there are unary operators, and binary operators, that
require respectively one and two operands, but that is not specified
in the table.

| Priority | Description | Operators | Comments |
| --- | --- | --- | --- |
| 0 | Assignement operators | `=` `/=` `-=` `+=` `*=` `%=` `~=` `<<=` `>>=` | |
| 1 | Logical Or | <code>&#124;&#124;</code> | |
| 2 | Logical And | `&&` | |
| 3 | Comparison operators | `<` `>` `<=` `>=` `!=` `==` `of` `is` `in` `!of` `!is` `!in` | Cannot be chained |
| 4 | Range operators | `..` `...` | |
| 5 | Bitshift operators | `<<` `>>` | |
| 6 | Bit operators | <code>&#124;</code> `^` `&` | Warning there is no priority over these operators (or and and) |
| 7 | Additive operators | `+` `~` `-` | `~` is the concatenation operator |
| 8 | Multiplicative operators | `*` `/` `%` | |
| 9 | Power operator | `^^` | |
| 10 | Unary operators | `-` `&` `*` `!` | Always prefixed |
| 11 | Option operator | `?` | Always postfixed |
| 12 | Keyword and Scope operators | `{` `if` `while` `assert` `break` `do` `for` `match` `let` `return` `fn` `dg` `loop` `throw` `__version` `__pragma` `with` `atomic` | This operators have a specific syntax that must be closed, to be completed |
| 13 | Postfix operators | `.` `(` `[` `:.` `#[` `#(` `#{` | `(` `[` `#{` `#[` `#(` must be closed by a balanced `]`, `)` or `}` to be completed |
| 14 | Path operator | `::` | |
| 15 | Literal operators | `(` `!` `[` <code>&#124;</code> `cast` `move` | In that case `(` `[` <code>&#124;</code> start a new expression, `move`  and <code>&#124;</code> start a lambda literal, `(` a tuple, or a 0 priority expression, `[` a slice or array literal, `!` a template call|
| 16 | Decorated expression | `ref` `const` `mut` `dmut` `cte` | |
| 17 | Anything else | | A variable, a literal, etc. |
