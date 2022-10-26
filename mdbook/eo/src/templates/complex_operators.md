# Set operators

In this chapter are presented the operators related to set object. The
operators are : *access*, *contains* and *iteration* operators.

## Access operator

The operator of index `[]` is overloadable by the method
`opIndex`. This method is called with the parameters passed inside of
the brackets of the index operator. For example, the following
operation `a [b, c, d]` is rewritten into `a.opIndex (b, c, d)`.

```ymir 
import std::io

class A {
    let dmut i : [i32];
    
    pub self (a : [i32]) with i = copy a {}
    
    pub def opIndex (self, x : i32) -> i32 
		throws &OutOfArray
	{
		self.i [x]
	}

    impl Streamable;
    
}

def main () 
    throws &OutOfArray, &AssertError
{
    let i = A::new ([1, 2, 3]);
    assert (i [2] == 3);
}
```

<br> 

One can note from the above example, that the object stored in **`i`**
is immutable, and that the **`opIndex`** is always a right operand. It
is possible to modify the values inside the **`i`** object (if it is
mutable) using the **`opIndexAssign`** method. This method rewritte
the assignement operation where the left operand is an access
operation. The following example presents an example of usage of this
method.

```ymir
import std::io

class A {
    let dmut i : [i32];
    
    pub self (a : [i32]) with i = copy a {}
    
    pub def opIndex (self, x : i32) -> i32 
		throws &OutOfArray
    {
		self.i [x]
    }

    pub def opIndexAssign (mut self, x : i32, z : i32)
        throws &OutOfArray
    {
        self.i [x] = z;
    }

    impl Streamable;
    
}

def main () 
    throws &OutOfArray, &AssertError
{
    let dmut i = A::new ([1, 2, 3]);

    (alias i) [2] = 9; // alias is important, otherwise the method is not callable
    println (i);
    
    assert (i [2] == 9);
}
```

<br>
Results: 

```
main::A([1, 2, 9])
```

## Contains operator

The contain operator is a binary operator used to check if an element
is inside another one. This operator is defined using the keyword
`in`. Unlike other operator, the rewritte for the overloading is made
only once on the right operand, and call the method `opContains`, for
example the expression **`a in b`** is rewritten into **`b.opContains
(a)`**. The expression `a !in b` will be rewritten into `!(a in b)`.

```ymir
class A {
    
    let _a : [i32];
    
    pub self (a : [i32]) with _a = a {}
    
    pub def opContains (self, i : i32)-> bool {
	for j in self._a {
	    if (i == j) return true;
	}
	false
    }	
}

def main () 
    throws &AssertError
{
    let i = A::new ([1, 2, 3]);
    assert (2 in i);
    assert (9 !in i);
}
```

## Iteration operator

Object can be iterated using a *for loop*. As for any operators, the
*for loop* used on object is rewritten at compilation time. There are
multiple methods to write when writting an iterable class. The
following source code present an example of a *for loop*, and the
source code underneath it present its rewritten equivalent.

```ymir
let a = A::new ();
for i, j in a {
	println (i, " ", j);
}
```

<br>
```ymir
let a = A::new ();
{
	let dmut iter = a.begin ();
	while !iter.opEquals (a.end ()) {
		let i = iter.get!{0} ();
		let j = iter.get!{1} ();
		{
			println (i, " ", j);
		}
		iter:.next ();
	}
}
```

<br>

In this example, two elements can be highlighted: 1) the **`iter`**
variable, that stores an iterator object, 2) the **`begin`** and
**`end`** method of the class **`A`**. Indeed, an iterable object is
an object that contains two methods **`begin`** and **`end`**, that
returns an mutable iterator pointing respectivelly to the beginning
and to the end of the iterable set.

The iterator type is a type defined by the user, and that contains the
**`opEquals`** method, a method **`next`** on a mutable instance, and
the method **`get`**, template method thats returns value pointed by
the current iteration.

The following example presents the implementation of a **`Range`**
that has the same behavior as a **`r!i32`** with a step **`1`** and a
not including the end value.

```ymir
import std::io;

class Range {
    let _fst : i32;
    let _lst : i32;
    
    pub self (fst : i32, lst : i32) with _fst = fst, _lst = lst {}
    
    pub def begin (self)-> dmut &Iterator { // must return a dmut value
		Iterator::new (self._fst)
    }
    
    pub def end (self)-> &Iterator {
		Iterator::new (self._lst)
    }
    
    impl Streamable;
}

class Iterator {
    let mut _curr : i32;
    
    pub self (curr : i32) with _curr = curr {}
    
    pub def get {0} (self) -> i32 {
		self._curr
    }
    
    pub def opEquals (self, o : &Iterator) -> bool {
		self._curr == o._curr
    }

    pub def next (mut self) {
        self._curr += 1;
    }
}


def main () {
    let mut r = Range::new (0, 10);
    for i in r {
		println (i);
    }
}
```

<br>

To be more efficient and avoid a new allocation at each iteration, the
**`end`** method should return a value that is computed once.

**Contribution** Enhance this section, which is completely
unclear. And add information about error handling maybe.
