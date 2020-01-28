# Example program

This chapter presents an example of a program that implements a linked
list using the class system. You will see that even if you can't set
an object instance to `null`, you can still implement the behavior,
without risk of the program crashing.

First of all, we have to define an element of the list, this element
can have a value, or be the end of the list.

```ymir
class @abstract Node {
	self () {}
		
	def append (self, i : i32)-> Node;
	
	impl Printable;
}
```

This class is the ancestor of all things that can be found in a linked
list.  The append method, while creating a copy of the list, returns a
new list with element i appended at the end of the list. There are two
types of nodes, a value or the end of the list. Let's start with the
simplest, the end of the list :

```ymir
class None over Node {
	self () {}

	over append (self, i : i32) -> Node {
		// We are at the end of the list
		// we just have to return a node that contains the value
		
		Some::new (i)
	}

	over print (self) {
		print ("END");
	}	
}
```

And the class Some, which contains a value: 

```ymir
class Some over Node {
	let _value : i32;
	let _next : Node;
	
	/**
	 * This constructor is used when this node is the last value of the list
	 * It is followed by a None value
	*/
	self (v : i32) with _value = v, _next = None::new () {}
	
	self (v : i32, x : Node) with _value = v, _next = x {}
	

	over append (self, i : i32) -> Node {
		Some::new (self._value, self._next.append (i))
	}		
	
	over print (self) {
		print (self._value, "::", self._next);		
	}	
}
```

There we are, the list is now usable:

```ymir
def main () {
	let x : Node = None::new ();
	let y = x.append (12).append (8).append (3).append (9);
	println (y);
}
```

You should get the following output.

```
12::8::3::9::END
```

**Exercise:** Without changing the main function, generate the
  following result. In other words, change the append function, to
  make sorted insertions.
  
```
3::8::9::12::END
```
