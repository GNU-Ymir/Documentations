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

let f = (fn (i32, i32)-> void) {null};
cte assert (is (a : (fn (T)-> void), T ...));
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

## Special tests

The expression `is` is used to test a type. It also allows you to test the kind of type, by accepting `struct`, `tuple`, `fn`, `dg` and `type` keywords.

```ymir
struct -> A;

type B impl void { /* ... */ }

cte assert (is (A : struct));
cte assert (is (B : type));
cte assert (is ((i32, f64) : tuple));

let f = (fn (i32, i32)-> void) {null};
cte assert (is (f : fn));

let x = 12;
let l = (a : i32) => a + x;
cte assert (is (l : dg));
```
