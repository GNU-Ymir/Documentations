# Is Expression

The expression `is` is a special expression (should not be confused with the operator `is`), which allows to test at compilation time the type of an element.

```ymir
let a = 12;
cte assert (is (a : i32)); 
```

The expression `is` is usable for a template resolution.

```ymir
let a = [1, 2, 3];
cte assert (is (a : [T], T));
```

Unlike the operator `of`, the expression `is` cannot be used to dynamically verify the type of a polymorphic object.

```ymir
type A impl (void) { /** ... */ }
type B over A { /** ... */ }

def foo () -> A {
	return B::init ();
}

let a = foo ();
cte assert (!is (a : B)); // Ok
cte assert (is (a : A)); // Ok

assert (a of B); // Ok
assert (a of A); // Ok
```

