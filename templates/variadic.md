# Variadics templates


The templates said variadics are templates parameters of arbitrary size. They can be used to identify a set of types or sets of values.
They are very commonly used in the **Ymir** language, indeed even the `print` function is a variadic template function.

## Variadic types 

The token `...` defines a variadic parameter. It is necessarily placed as the last template parameter. 

```ymir
def foo (A, B...) (a : A, b : B) {
	println (b::typeid);
	println (a::typeid);
}

foo (1, 2, 3); // i32 (i32, i32)
foo (1, "test"); // i32 [const(char)]
foo (1, "test", 4.0f); // i32 ([const(char)], f32)
```

If a runtime parameter is typed with the template variadic parameter, its type will be either :
- a tuple, if several types have been resolved in this parameter 
- the type that has been resolved if it is unique

Template parameters can also be used in other elements, such as structures or objects.

```ymir
struct (T...) 
| func : fn (T) -> void // once solved func is fn (i32, i32)-> void;
 -> MyPtr;
 
def foo (a : i32, b : i32) {
	println (a + b);
}

let ptr = MyPtr!(i32, i32) {foo};
```

### Varidic function pointer

Function pointers cannot be variadic, they must define the types of parameters they take as inputs. Nevertheless, it is possible to retrieve a pointer to a variadic function, by specifying the parameters of the function in question.

```ymir
def foo (X, T...) (a : X, b : T) {
	// ...
}

let my_ptr = foo!(i32, f64, f32); // Ok
println (my_ptr::paramTuple::typeid); // (i32, (f64, f32))

let my_second_ptr = (fn(i32, (string, i32, u64))-> void) {foo}; // Ok
let my_third_ptr = (fn (i32, i64)-> void) {foo};
```

As said earlier for the runtime parameters, the variadic template parameters are associated with a tuple type.

## Variadics values

As for types, the `...` token allows you to define that a template parameter is variadic. It is always mandatory that this parameter is set last.
It is not possible to mix variadic types and variadic values in an element.

```ymir
def foo (values : ...) () {
	println (values.0); 
}

foo!(1, 2, 3) (); // Ok, 1
foo!("string", 87.0f) (); // Ok, string
```


