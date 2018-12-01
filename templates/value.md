# Template value parameter

Template parameters can define not only types, but also values. The values defined by the template parameters must be `cte`. 
The values passed in template parameters can be used to specify an element, or to define constants in the scope of the generated template element.

```ymir
def cteFibo (n : i32) () -> i32 {
    cte if n < 2 
		return n; 
    else return cteFibo!(n - 1)() + cteFibo!(n - 2) ();
}

def main () {
    let cte x = cteFibo!(10) ();
	cte assert (x == 55);
}
```

Since template specialization only defines elements once, we can see recursive `cte` templates functions as memoizing functions. They are therefore relatively fast, for example: 

```ymir
cte assert (cteFibo!(45) () == 1134903170);
```

Template value specialization is used for operator overloading and will be discussed in more detail in the section [Operator overloading](../templates/operators.md). 
	
```ymir
struct 
| a : i32
 -> A;
 
def opBinary ("+") (x : A, y : A) {
	return A {x.a + y.a};
}
	
let x = A {10}, y = A {12};
assert ((x + y).a == 22);	
```

The size of the static arrays can also be deduced using a template parameter by value: 

```ymir
def foo (T of [U ; N], U, N : u64) (a : T) {
	println ("array of ", U::typeid, " of size ", N);
}

foo ([1, 2, 3]); // array of i32 of size 3
```

## Function value

Lambda functions are `cte', which means that we have the right to use them as template parameters.
This can be done either by directly deducting the type : 

```ymir 
def map(FUN : U, U) (a : [i32]) {
    let res = [i32; new a.len];
    for i in 0UL .. a.len
		res [i] = FUN (a [i]);
    return res;
}


println (([1, 2, 3]).map!((a) => a + 1)); // [2, 3, 4];
```


It can be noted that runtime parameter parentheses are optional in the case of a call by the `.` operator of a template function.

The deduction can also be made thanks to a specialization of function:

```ymir
def map (FUN : fn (i32)-> i32) (a : [i32]) {
	let res = [R; new a.len];
    for i in 0UL .. a.len
		res [i] = FUN (a [i]);
    return res;
}

println (([1, 2, 3]).map!((a) => a + 1));
```

A standard function can be used instead of the lambda function: 

```ymir
def plusOne (a : i32) return a + 1;

println (([1, 2, 3]).map!plusOne);
```

