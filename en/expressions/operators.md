# Operators

The operators as in any language refers to the symbols used to perform operation between values.
The precedence of the operators is defined in the table below.

```ymir
let a = 1 + 3 * 4;
assert (a == 13);
```

## Type promotion

Operations on primitive types are allowed by the **Ymir** language
only if they do not generate a loss of accuracy. This is called type
promotion, and is defined by: A type _x_ can be transformed into type
_y_ if and only if the size of the type _x_ is smaller than the size
of _y_ and _x_ and _y_ are of the same nature. That is, _x_ and _y_
are both unsigned, or both signed, or both are floating.

```ymir
let a = 12; // i32
let b = 12B; // i8
b = a; // Illegal
a = b; // Ok

let c = 34UB; // u8
b = c; // Illegal
a = c; // Illegal
```

## Special type promotion


It is possible to override promotions of types that can be
sometimes annoying to do some calculations. For this purpose, there are
two ways. The first one is quite classic, it is the cast of the type
. An example is shown below, but the cast is explained more in
detail in this section [Type cast](expressions/cast.md).

```ymir
let a = 12; // i32
let b = 12B; // i8
b = cast!i8 (a); // Ok

let c = 34UB;
b = cast!i8 (c); // Ok
a = cast!i32 (c); // Ok
```

The cast can sometimes be a little too verbose, which is why **Ymir**
also offers an automatic cast system for types from a typed
operation. To do this, it is possible to type an operator in order to
define which type of operation you want to perform.

```ymir
let a = 12;
let b = 12B;

let c = a + b; // Illegal
let d = a +:i32 b; // Okay, an i32 operation will be applied

// This operation will be rewritten by the compiler into
// let d = cast!i32 (a) + cast!i32 (b); 
```

## Operator precedence<a id="sec-1-3" name="sec-1-3"></a>

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="right" />

<col  class="left" />

<col  class="left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="right">priority</th>
<th scope="col" class="left">description</th>
<th scope="col" class="left">operators</th>
</tr>
</thead>

<tbody>
<tr>
<td class="right">1</td>
<td class="left">Assignement operators</td>
<td class="left"><code>/=</code> <code>&=</code> <code>&vert;=</code> <code>-=</code> <code>+=</code> <code><a id="" name=""></a>=</code> <code>=</code> <code>\*=</code> <code>%=</code> <code>^=</code> <code>^^=</code> <code>~=</code></td>
</tr>


<tr>
<td class="right">2</td>
<td class="left">Logical or</td>
<td class="left"><code>&vert;&vert;</code></td>
</tr>


<tr>
<td class="right">3</td>
<td class="left">Logical and</td>
<td class="left"><code>&&</code></td>
</tr>


<tr>
<td class="right">4</td>
<td class="left">Test operators</td>
<td class="left"><code>&#60;</code> <code>&#62;</code> <code>&#60;=</code> <code>&#62;=</code> <code>!=</code> <code>!&#60;</code> <code>!&#60;=</code> <code>!&#62;</code> <code>!&#62;=</code> <code>==</code> <code>is</code> <code>!is</code> <code>of</code> <code>!of</code></td>
</tr>


<tr>
<td class="right">5</td>
<td class="left">Range operators</td>
<td class="left"><code>..</code> <code>...</code></td>
</tr>


<tr>
<td class="right">5</td>
<td class="left">bit shift operators</td>
<td class="left"><code>&#60;&#60;</code> <code>&#62;&#62;</code></td>
</tr>


<tr>
<td class="right">6</td>
<td class="left">bitwise operation</td>
<td class="left"><code>&vert;</code> <code>^</code> <code>&</code></td>
</tr>


<tr>
<td class="right">6</td>
<td class="left">Additive operators</td>
<td class="left"><code>+</code> <code>~</code> <code>-</code></td>
</tr>


<tr>
<td class="right">7</td>
<td class="left">Multiplicatives operators</td>
<td class="left"><code>*</code> <code>/</code> <code>%</code></td>
</tr>


<tr>
<td class="right">8</td>
<td class="left">Unary operators</td>
<td class="left"><code>++</code> <code>--</code> <code>!</code> <code>-</code> <code>&</code> <code>*</code></td>
</tr>


<tr>
<td class="right">9</td>
<td class="left">Postfix operators</td>
<td class="left"><code>(</code> <code>.</code> <code>[</code></td>
</tr>
</tbody>
</table>
