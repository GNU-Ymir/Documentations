# Macro 

Macros are used to perform operation at a syntactic level, instead of
a semantic level, as it is done by all the other symbols. A macro call
is an expansion of a syntaxic element.

Macros are defined using the keyword **`macro`**. They contains two
kind of elements, constructors and rules.

```ymir
import std::io;

macro Vec {
    pub self (x = __expr "," y = __expr z=foo) skips (" ") {
        #{z};
        println ("#{x}");
        println ("#{y}");
    }

    pub def foo (z=__expr rest=(__expr y="machin")) {
        println ("#{z}#{rest::y}");
    }
}


def main () {
    Vec#{1,2 9 9 machin};
}
```
