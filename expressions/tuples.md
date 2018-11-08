# Tuples

A tuple is a collection of values of different types. It is possible
to build a tuple using the parentheses `()`. It is possible to pass
a tuple as a parameter of a function, or as a function return value to
return several values.

```ymir
def reverse (pair : (i32, bool)) -> (bool, i32) {
    let (x, y) = pair;
    return (y, x);
}

def main () {
    let tuple = (1, true);
    let rev = reverse (tuple);    
}
```

The keyword `expand` allows you to deconstruct a tuple, and pass it on as function parameters, or when creating a larger tuple.

```ymir
def foo (a : i32, b : char) {
    println (a, " ", b);
}

def main () {
    let tuple = (1, 't');
    foo (tuple::expand);
    let tuple_2 = (1, tuple::expand);
}
```

It is possible to retrieve a value from a tuple by using the `.` operator.

```ymir
def main () {
    let tuple = (1, 2, 3);
    println (tuple.0, " ", tuple.1, " ", tuple.2);
}
```

Tuples are also very useful for creating variadic templates functions, but this part will be explained later when we discuss templates.

## Union tuples

Work in progress !!...
