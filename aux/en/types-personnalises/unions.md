# Union 

The `union` types are equivalent to the `struct` type, except that the fields that make up a `union` share the same memory area. The keyword `union` allows you to declare a type `union`. 

```ymir 
union 
| i : i32
| d : f64
 -> MyUnion;

def main () {

	// Only one of the elements of the union is necessary to build it
	// The first compatible element is used 
	
	let a = MyUnion { 12 }, b = MyUnion { 1200.05 };
	let c = MyUnion {'r'}; // Error
	
	println (b.i, " ", b.d, " ", b::sizeof); // 858993459 1200.050000 8		
}
```
