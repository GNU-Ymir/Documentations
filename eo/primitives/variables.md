# Variabloj kaj Ŝanĝebleco

Oni deklaras variabloj per la vorto **`let`**. La sintakso de deklaroj
de variablo estas prezentata en la sekva bloko da kodo.

```grammar
var_deklaro := 'let' ena_var_dekl (',' ena_var_decl)*
ena_var_dekl  := (dekoracio)* Nomo (':' tipo)? '=' esprimo
dekoracio := 'mut' | 'dmut' | 'ref'
Nomo := ('_')* [A-z] ([A-z0-9_])*
```

<br>

Deklaro de variablo estas komponita de kvar partoj, 1) Iu nomo, kiu
estas uzita por referenci la variablon, 2) dekoracioj, kiu donas
malsimilajn kondutojn al la programo rilate al la variablo, 3) valoro,
kiu estas la unua valoro de la variablo, 4) tipo, opcia parto de la
deklaro kiu, kiam ĝi mankas, estas induktita de la tipo de la unua
valoro asociita al la variablo. Alie, kiam la tipo estas donita, ĝi
estas kontrolita kaj devas kongrui kun la tipo de la unua valoro de la
variablo.

## Tipo de variablo




