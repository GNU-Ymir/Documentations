# Copy data to make them mutable

Sometimes it is not possible to allow data to be borrowed by foreign
functions or variables. This can be due to the facts that data are
immutable for example. To solve this problem, **Ymir** provides two
keywords, **`copy`** and `dcopy`.

## Copy

The **`copy`** keyword makes a copy of the first level of a value,
whose type is aliasable. This copy transform an immutable type into a
mutable one, by increasing its mutability level by one. The following
table shows some examples of the types of copied values :

| Type | Type of copied value |
| --- | --- |
| [i32] | mut [mut i32] |
| mut [i32] | mut [mut i32] |
| mut [[i32]] | mut [mut [i32]] |

An example of what can be achieved by **`copy`** keyword is shown in
the following code. The representation of the memory is also shown in
the figure underneath. In this example, the variable **`x`** is copied
and the result value is placed in the variable **`y`**. In this
example, each variable are borrowing different data placed on the
heap, whose values are equivalent.

```ymir
import std::io
    
def main ()
    throws &AssertError, &OutOfArray
{
    let x = [1, 2, 3];
    let dmut y = copy x; // create a copy of x
    assert (x == y); // y and x have the same value, but at different location

    y [0] = 9; 
    assert (x == [1, 2, 3]); // modifying y does not affect x
    assert (y == [9, 2, 3]); // but still affects y
}
```

<br>

We can see from the figure below, that the variable **`y`** points to
data at a different location, from the data pointed by **`x`**. This
implies a new memory allocation, and a memory copy, that cost some cpu
time, and memory place. For that reason, copies are never hidden by
the language, and are made only when the keyword **`copy`** is placed
in the source code.

<img src="https://gnu-ymir.github.io/Documentations/en/advanced/memory_x_copy_main.png" alt="drawing" width="700"/>

**Exercise :** Modify `x` that is initialised with an imutable string literal : 

```ymir
import std::io

def main () 
	throws &OutOfArray 
{
	let x = "hello !";
	x [0] = 'H'; // Make this line work
	assert (x == "Hello !");
}
```

<div class="spoiler_head"> <strong>Correction</strong> (spoiler) : </div>
{%s%}
<pre class="language-" style="position: relative;" class="spoiler"><code class="lang-ymir">import std::io

def main () 
    throws &OutOfArray, &AssertError
{
	let dmut x = copy "hello !";
	x [0] = 'H'; // Well done
	assert (x == "Hello !");
}
</code></pre>
{%ends%}

## Deep copy

The deep copy will make a copy of the value and all internal values,
it must be used in special cases because it is much less efficient
than the simple copy, which copies only one level of the data. There
is nothing complex to understand in deep copy, it simply creates a
value, deeply mutable, which is an exact copy.

```ymir
import std::io

def main () {
    let x = [[1], [2, 3], [4]];
    let dmut y = dcopy x;
    let mut z : [mut [i32]] = copy x;
    println (x, " ", y, " ", z);
}
```
