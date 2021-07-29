# Prioritato de operatoroj
 
La sekva tabulo prezentas la prioritaton de la operatoroj, kaj
literoj. La tabulo prezentas la prioritato de la operatoroj, sed ne
kiel la operatoroj devas esti uzataj, nek iliaj specifaj
sintaksoj. Ekzemple, estas unuaraj operatoroj, kaj duaraj operatoroj,
kiu respektive necesigas unu, kaj du argumentojn.

| Prioritato | Priskribo | Operatoroj | Komentoj |
| --- | --- | --- | --- |
| 0 | Atribuigaj operatoroj | `=` `/=` `-=` `+=` `*=` `%=` `~=` `<<=` `>>=` | |
| 1 | Logika Aŭ | <code>&#124;&#124;</code> | |
| 2 | Logika Kaj | `&&` | |
| 3 | Komparantaj operatoroj | `<` `>` `<=` `>=` `!=` `==` `of` `is` `in` `!of` `!is` `!in` | Ne ĉenigebla |
| 4 | Intervalaj operatoroj | `..` `...` | |
| 5 | Bitmovaj operatoroj | `<<` `>>` | |
| 6 | Bitaj operatoroj | <code>&#124;</code> `^` `&` | Averto, estas neniu prioritato inter la 'aŭ' kaj 'kaj' bitaj operatoroj |
| 7 | Aldonanta operatoroj | `+` `~` `-` | `~` estas interliga operatoro |
| 8 | Multiplika operatoroj | `*` `/` `%` | |
| 9 | Potenca operatoro | `^^` | |
| 10 | Unuara operatoro | `-` `&` `*` `!` | Ĉiam prefikso |
| 11 | Opcia operatoro | `?` | Ĉiam postfikso |
| 12 | Ĉefvortoj kaj ampleksa operatoroj | `{` `if` `while` `assert` `break` `do` `for` `match` `let` `return` `fn` `dg` `loop` `throw` `__version` `__pragma` `with` `atomic` | Tiuj operatoroj havas specifan sintakson, kiun oni devas fermi, por ke la operatoro estu kompleta |
| 13 | Postaj operatoroj | `.` `(` `[` `:.` `#[` `#(` `#{` | `(` `[` `#{` `#[` `#(` devas esti fermita per konforma `]`, `)` aŭ `}` por esti kompleta |
| 14 | Voja operatoro | `::` | |
| 15 | Literaj operatoroj | `(` `!` `[` <code>&#124;</code> `cast` `move` | En tiu kialo `(` `[` <code>&#124;</code> komencas novan esprimon, `move`  kaj <code>&#124;</code> komencas lambdan literon, `(` opon, aŭ esprimo kun 0 prioritato, `[` tranĉon aŭ statika tabulo, `!` ŝablan vokon |
| 16 | Dekoraciaj operatoroj | `ref` `const` `mut` `dmut` `cte` | |
| 17 | Io ajn alia | | Variablo, litero, ktp. |
