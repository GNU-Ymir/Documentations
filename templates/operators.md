# Operator overloading

The operator overload is done by rewriting the operations applied on operands of type structures or objects. No new syntax is used for operator overloading.

## Unary operator


The overloading of binary operators is done by defining the `opUnary` function.
It is rewritten as follows: 

| expression | rewrite |
| --- | --- |
| -e | e.opUnary!("-") |
| &e | e.opUnary!("&") |
| e++ | e.opUnary!("++") |
| *e | e.opUnary!("*") |
| e-- | e.opUnary!("--") |
| !e | e.opUnary!("!") |

```ymir
type A impl (i32) {
	self (a : i32) { self.0 = a;}
	
	def opUnary ("-") (self) {
		return A::init (-self.0);
	}
	
	def opUnary (op : string) (self) {
		cte if (op == "++") self.0 ++;
		else {
			cte assert (false, "undefined operator '" ~ op ~ "' for type " ~ self::typeid);
		}
	}
	
	def get (self) { return self.0; }
}

let a = A::init (7);
println ((-a).get ()); // -7
a ++;
println (a.get ()); // 8
a --; // Assert failure : undefined op '--' for type main.A
```

## Binary operator 


The overloading of binary operators is done by defining the `opBinary` function.
The following operators are overloadable: 

- `+`	`-`	`*`	`/`	`%`	`^^`	`&`
- `|`	`^`	`<<`	`>>`	`~`	`in`


The overloading of the binary operators is done in two phases:
- First we rewrite the expression using the `opBinary` function

```ymir
struct -> A;

def opBinary ("+") (a : A, b : i32) {
	return b + 1;
}

let a = A {} + 9; // opBinary!("+") (A{}, 9);
```

- If no overload satisfies rewriting, rewrite using the `opBinaryRight` function

```ymir
struct -> A;

def opBinaryRight ("+") (a : i32, b : A) {
	return a + 1;
}

let a = 9 + A {}; // opBinaryRight!("+") (9, A{});
```

## Test operator

There are two types of test operators, equality tests and order tests.

### Equality

The equality operator can be overloaded with the `opEquals` function. There is no inverse function, the `opEquals` function returns a boolean, we take its negation to test the inequality.

```ymir
struct 
| a : i32
 -> A;
 
def opEquals (x : A, y : i32) {
	return x.a == y;
}

let a = A {10};
assert (a == 10); // a.opEquals (10);
assert (a != 8); // !a.opEquals (8);
```

### Order

Order operations work in the same way as
binary operators, but with the `opTest` function. The only one
difference is that we know the negation of the operators (ie, for
`<` => `>=`, ...), so it is not necessary to have a function
`opTestRight`.

```ymir
def opTest (op : string) (a : A, b : i32) {
	if (op == "<")
		return a.a < b;
	else if (op == ">=") 
		return a.a >= b;
	else assert (false);
}

let a = A {10};
assert (a < 11); // a.opTest!("<")(11);
assert (9 < a); // a.opTest!(">=") (9);
```

The tests can return either an integer or a Boolean. 
When returning an integer, the operator compares the returned value with `0` using the operator of the expression.

```ymir
def opTest (op : string) (a : A, b : i32) {
	return a.a - b;
}

let a = A {10};
assert (a < 11); // a.opTest!("<") (11) < 0
assert (9 < a); // a.opTest!(">=") (9) >= 0
```

## Assignment

The assignment operator can be overloaded like any other operator. It applies to the variable already built. For variables of unconstructed object types, the copy constructor is called (see [Constructs](../customized types/objects/constrs.md#constructor-by-copy)).

On the other hand, there is no alternative to the copy constructor for structure variables, so it is the assignment operator that is called.

The function overloaded is `opAssign`, it takes as a template parameter the assignment operator.

The assignment operators that can be overloaded are the following: 
- `=`, `/=`, `&=`, `|=`, `-=`
- `+=`, `<<=`, `>>=`, `*=`, 
- `%=`, `^=`, `^^=`, `~=`

```ymir
struct 
| a : i32
 -> A;

def opAssign ("=") (ref a : A, x : A) {
	a.a = x.a + 1;
}

def opAssign ("+=") (ref a : A, i : i32) {
	a.a += i;
}

let a = A {0}; 
println (a.a); // 1
a += 8;
println (a.a); // 9
```
		
As explained above, the assignment operator cannot replace the copy constructor for object type variables.

```ymir
type A impl (i32) {
	self (a : i32) {self.0 = a;}

	def opAssign ("=") (self, other : A) {
		self.0 = other.0 + 1;
	}
	
	def show (self) {
		println (self.0);
	}
}

let a = A::init (12); 
a.show (); // 12

a = A::init (12);
a.show (); // 13
```

It is possible to apply the same treatment for the constructor and the assignment operator:

```ymir
type A impl (i32) {

    self (a : i32) {
        self.0 = a;
    }

    self (self other) self = other;
    
	/**
	*  Warning: the copy must imperatively take a reference in input, 
	*   otherwise the constructor by copy of the type will be called, and the recursion will be infinite. 
	*/
    def opAssign ("=") (self, ref other : A) {
        self.0 = other.0 + 1;
    }

    def show (self) {
        println (self.0);
    }    
}

let a = A::init (10);
a.show (); // 11
a = A::init (8);
a.show (); // 9
```

## Access operator

The access operator allows you to use `[` `]` on a custom type element. The `opIndex` function must be overloaded, it does not take templates parameters, but takes an arbitrary number of arguments.


```ymir
struct 
| a : [i32]
 -> A;
 
def opIndex (ref a : A, begin : i32, end : i32) {
	return a.a [begin .. end];
}

let a = A {[1, 2, 3].dup ()};
let b = a [1, 2];
```

## Call operator 

The call operator allows you to define the processing for the use of `(` `)` on a custom type. Overloading the `opCall` function works exactly the same way as `opIndex`.

```ymir
struct 
| a : [i32]
 -> A;
 
def opCall (ref a : A, begin : i32, end : i32) {
	return a.a [begin .. end];
}

let a = A {[1, 2, 3].dup ()};
let b = a (1, 2);
```

## Iter operator


The iteration operator is a special operator. It is defined by several functions, and allows you to apply a `for` loop on a custom type element.
The function to overload is `opIter`, which takes as a template parameter the number of variables in the `for` loop. 

This function returns an iterator, on which 3 different functions must be able to be executed: 
- `get`, a templates function that first takes as template parameter the index of the variable to recover
- `next`, which informs the iterator that the following iteration is entered
- `isEnd`, which returns `true` if the iterator does not have any remaining element.

```ymir
struct 
| index : i32
| data : [i32]
 -> Iterator;


type Set impl ([i32]) {

    self (len : i32) {
        self.0 = [i32 ; new cast!u32 (len)];
	for i in 0 .. len {
	    self.0 [i] = i;
	}
    }
    
    def opIter (1) (self) {
	return Iterator {0, self.0};
    }
}

def get (0) (ref it : Iterator) {
    return it.data [it.index];
}

def next (ref it : Iterator) {
    it.index ++;
}

def isEnd (ref it : Iterator) {
    return it.index >= it.data.len;
}

	
let my_set = Set::init (13);

for it in my_set {
	println (it);
}
```

In the previous example the `for` loop will be rewritten as : 

```ymir
let iterator = my_set.opIter!(1) ();
while (!iterator.isEnd ()) {
	let it = iterator.get!(0) ();
	println (it);
	iterator.next ();
}
```

As with all `for` loops, it is possible to set several variables in iterators.

```ymir
for i, j in my_set {
	// ...
}
```

Is thus rewritten in :

```ymir
let iterator = my_set.opIter!(2) ();
while (!iterator.isEnd ()) {
	let i = iterator.get!(0) ();
	let j = iterator.get!(1) (); 
	// ...
	iterator.next ();
}
```
