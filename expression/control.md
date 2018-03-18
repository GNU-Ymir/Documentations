## Control structures 

To create a programm, you need to be able to make decision, iterate
over items, or repeat instruction multiple times.  This part will
present the available control structures in **Ymir** Language.

## Conditionals

The simplest control structure is the `if` `else` construct.

```ymir
if a < b 
	println (a);
else if a == b
	println (a, "==", b);
else 
	println (b);
```

In **Ymir** if condition must have `bool` expression, you can't use
intergers or pointers like in other C-like language. The content of an
`if` instruction is a sequence of instructions where the creation of a
block (`{}`) is optionnal, if you want to execute only one
instruction.

In **Ymir**, `if` statements are expressions. This means you can use
an `if` as an expression. 

```ymir
let x = true;
let a = 1 + if (x) 100 else 2; 
```

## Loops
### While

While loop is very similar to other language.

```ymir 
let i = 0;
while i < 100 {
	println (i);
	i ++;
}
```

#### Break

Sometimes, you want to stop a loop before its test forced it to end. The `break` keyword allows you to do that.
```ymir
let i = 0;
while i < 100 {
	println (i);
	if i == 5 break;
	i ++;
}
```

You can use the `break` keyword to stop a parent loop by using a tag.
```ymir

let i = 0;
let j = 0;
while: firstLoop (i < 100) {
   while j < 10 {
      if j == 2 break firstLoop;
	  j ++;
   }
   i++;
}
assert (j == 2 && i == 0);
```

### For

`for` construction is used to iterate over a collection of items, or over a range.
```ymir

for i in ["One", "Two", Three"] {
	print (i, ","); 
} // One, Two, Three,

let a = [5, 3, 1];
for i in 0 .. 3 {
	print (i, ","); }
} // 0, 1, 2,

for i in 0UL .. a.len {
	print (a [i], ","); 
} // 5, 3, 1, 

for i in 3 .. 0 {
	print (i, ",");
} // 3, 2, 1,

```

You can label a `for` loop to break it, as you can do it with `while` loops. 
