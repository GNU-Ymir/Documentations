# Construction and Lifetime

This part will present the creation of an object, the course of its life, until its destruction.

## Constructor

An object is created from a class. It is possible to define the operations that will be applied when creating a new object, thanks to the notion of constructor. Builders are particular methods that will be called once and only once on an object, when it is created. The syntax of a constructor is as follows:

```ymir

type MyType impl (void) { // A type with no fields

	self () {
		println ("You are constructing me !!");
	}

	self (x : i32) {
		println ("You are constructing me, with a parameter : ", x, " !!");
	}

}

```

Once the constructors have been defined, it is possible to create a variable with the custom type we have just defined.

```ymir
let myVar = MyType::init (); // Constructor with no parameter
let mySecondVar = MyType::init (10); // Constructor with 1 parameter
```

As with primitive types, it is possible to build a type with `init` without using a parenthesis, if the type has a constructor without parameters.

```ymir
let myvar = MyType::init; // Ok
```

There is no default constructor in **Ymir**, if a class does not have a constructor, it will simply be impossible to instantiate an object of its type.


### Data field initialization 

It is not mandatory to initialize all attributes in the constructor. Attributes that are not initialized are assigned to their `init` value.

```ymir
type A impl (i32, p!void) {
	let ptr : self.1;
	let x : self.0;

	self () {} 	
}

let a = A::init ();
assert (a.ptr is null && a.x == 0);
```

## Life time 

Objects are special types, but they respect the conventions established by the primitive types.
The lifetime of an object variable does not differ from that of an primitive variable.
Objects are placed on the stack, as are all local variables (unallocated).

## Destructor

Destructors are methods called once and only once on objects when they are destroyed.
They can be defined in a class thanks to the keyword `~self`. A class can only have one destructor.

```ymir
type MyType impl (i32) {

    self (x : i32) {
        self.0 = x;
        println ("Construct ", self.0);
    }
    
    ~self () {
        println ("Destruct ", self.0);
    }

}
```

It is not possible to call a destructor, it is called automatically when an object variable reaches the end of its life.


```ymir
def main () {
    let a = MyType::init (1);
    {
        let b = MyType::init (2);
    }
}

```

The previous program will generate the following display: 
```ymir
Construct 1 // The local constant MyType::init (1)
Construct 2 // The local constant MyType::init (2)
Destruct 2 // The local constant MyType::init (2)
Destruct 2 // the variable b
Destruct 1 // The local constant MyType::init (1)
Destruct 1 // The variable a
```

## Constructor by copy 

As can be seen in the example above, the construction of an object type by copy is defined by default as a copy of all fields from one type to another, as for copies of a structure.

However, it is possible to overload the construction of a type by copying it with the definition of a specialized builder.


```ymir
type MyType impl (i32) {

	self (x : i32) { 
		self.0 = x;
		println ("Construct ", self.0);
	} 
	
	self (self other) { // Copy constructor, where other is the name of the variable that will be copied 
		// other is passed by const reference, and is then typed const (ref MyType)
		self.0 = -other.0;
		println ("Copy ", self.0);
	}
	
	
	~self () {
		println ("Destruct ", self.0);
	}
}
```

With this class declaration, the code defined above recalled below: 


```ymir
def main () {
    let a = MyType::init (1);
    {
        let b = MyType::init (2);
    }
}
```

Will generate the following display: 
```
Construct 1 // The local constant MyType::init (1)
Copy -1 // The variable a
Construct 2 // The local constant MyType::init (2)
Copy -2 // The variable b
Destruct 2 // The local constant MyType::init (2)
Destruct -2 // The variable b
Destruct 1 // The local constant MyType::init (1)
Destruct -1 // The variable a
```

### Caution

If the object is already built, it is not the copy constructor that is called during an assignment, but the assignment operator. This can be overloaded as we will see in the section on [Operator overloading](../../templates/operators.md). 
