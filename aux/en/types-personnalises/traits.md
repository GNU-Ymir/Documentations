# Traits

Traits are special types that have no value. They are used to test other types and verify that they share characteristics.

A `trait` has a set of methods and attributes.

```ymir
trait isCallable {

	let a : i32; 

	def foo (self)-> void;
	
}
```

It is then possible to test this feature on an object type defined in a module. This test is a template test, these are seen in detail in the section [Templates](../templates/main.md) 

```ymir
type MyType impl i32 {
	
	let a : self.0;

	self (a : i32) {
		self.a = a;
	}

	def foo (self) {
		println ("Foo ", self.a);
	}
		
}

def modifyAndCall (T trait isCallable) (ref obj : T, value : i32) {
	obj.a = value;
	obj.foo ();
}

def main () {
	let a = MyType::init (1);
	
	// The type MyType has the trait isCallable, as :
	// - it possess an attribute a of type i32
	// - and a function foo of type (self)-> void
	modifyAndCall (a, 23); 
}
```

The `trait` only allow to test public elements (from a context) of an object type, since their objective is to verify that the type is usable from this context.
