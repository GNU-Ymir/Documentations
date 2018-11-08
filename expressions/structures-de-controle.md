# Control structures

To create a valid program, you must be able to make decisions, iterate on sets, or repeat instructions several times. This section will present the control structures offered by the **Ymir** language.

## Condition

The simplest control structure is the `if` `else` construction.

```ymir
if a < b 
    println (a);
else if a == b
    println (a, "==", b);
else 
    println (b);
```

In **Ymir**, a condition must be of the `bool` type, it is impossible
to use other types as integers as one could do in other C-like
language. The content of an `if` instruction is an instruction block,
where creating a block containing several instructions with `{}`
tokens is optional, if you want to execute only one instruction.

The `if``else`` construct can be used as an expression, so you can retrieve the value of a conditional expression.

```ymir
let x = true;
let a = 1 + if (x) 100 else 2;
```

## Loops

The **Ymir** language offers several control structures to loop, or iter on sets.

### While

The `while' loop is very similar to that of other languages close to C.

```ymir
let i = 0;
while i < 100 {
    println (i);
    i ++;
}
```

#### Break

Sometimes it is convenient to be able to stop a loop before its condition forces it to stop. The keyword `break` allows you to do this.

```ymir
let i = 0;
while i < 100 {
    println (i);
    if i == 5 break;
    i ++;
}
```

You can use the keyword `break` to stop a parent loop using a tag.

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

The `for' loop allows you to iterate on a collection of elements such as an array, or a range.

```ymir
for i in ["One", "Two", "Three"] {
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

As with `while' loops, it is possible to tag a `for' loop so that it can be referred to in a `break' instruction.

```ymir
for:loop (i in [1, 2, 3]) {U
    break loop;
}
```

