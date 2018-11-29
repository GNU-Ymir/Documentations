# Templates

Templates defined in **Ymir** allow, as in other languages such as C++, or Java, to define functions or objects that work for different types according to compilation constraints.
Templates are a central point of the **Ymir** language and allow many things like generating code, or executing functions at compile time.

```ymir
def add (T) (a : T, b : T) {
	return a + b;
}
```


The template parameter `T` is defined between two brackets before the declaration of the function parameters. This means that the `T` type is a template type and its definition is local to the function. When a call to the function is made the type of `T` will be defined and replaced. The operator `!` allows you to define the template parameters of a template element.


```ymir
let res = add!i32 (1, 2);
assert (res == 3);

let res2 = add!f32 (1.f, 2.f);
assert (res2 == 3.f);
```

Generally the compiler is able to know the type of template parameters, without the user having to give them explicitly. The template functions use two sets of arguments, the template arguments known at compile time, and the runtime arguments. When parameters are missing in the first set, the compiler will try to deduce them.

```ymir
def to (T, T2) (a : T2) {
	return cast!T (a);
}

let res = add (1, 2); // T is deduced to i32 
assert (res == 3); 

let b = to (10); // Error, T cannot be deduced
let c = to!i32 (10L); // Ok, T is deduced to i32, and T2 to i64
```

## Template properties

Templates are executed only at compile time, which generates highly optimized code when the function is actually called at run time.

Almost all structures that can be defined in **Ymir** can have template parameters. 

- Structs : 

```ymir
struct (T) 
| a : T
 -> MyTemplate;
 
let a = MyTemplate!i32 { 42 };
```

- Types : 

```ymir
type A (T) impl (T) {
	// ... 
}

let a = A!(i32)::init (42);
```

- Modules : 

```ymir
mod MyMod (T) {
	def foo (a : T) {
		println (a);
	}   	
}

MyMod!(i32)::foo (42);
```

## Template specialization


It is possible to add constraints on the template parameters, there are two different types of constraints: 
- type constraints
- value constraints (`cte`)
