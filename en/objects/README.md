# Objects

**Ymir** is a object oriented language, with polymorph types. In this
chapter, we assume that you are familiar with object oriented
programming paradigm (if not, you will benefit from reading
information on that paradigm first *cf.*  [object oriented
programming](https://en.wikipedia.org/wiki/Object-oriented_programming).).

In *Ymir*, object instances are dynamically allocated on the
heap. Indeed, because object types are polymorph, their size cannot be
known at compile time, and consequently cannot be placed in the
stack. To illustrate this point, the following figure presents the UML
definition of a class **`A`**, and an heir class **`B`**. The class
**`A`** contains a field **`x`**, of type **`i32`**, thus of size
**4** bytes. The class **`B`**, contains another field **`y`** of size
**4**, leading to a class **`B`** of size **8**.

<img src="https://gnu-ymir.github.io/Documentations/en/objects/UML.png" alt="drawing" height="500" style="display: block; margin-left: auto;  margin-right: auto;">


Because we want to following source code to be accepted (basic
principle of polymorphism), the size of **A**, cannot be statically
set to **4** bytes, (nor to **8**, the class **`B`** can come from a
totally different part of the source code - from a library for example
-, and unknown when using the type **`A`**, without talking of the
huge loss of memory if only **`A`** values are used).

```ymir
def foo (a : &(A)) // ...	

def main () {
	let b : &B = // ...
	foo (b); // calling foo with a B, heir of A
}
```

For that reason, object instances are aliasable types, and only
contains a pointer to the values of the class. You may have notice the
syntax **`&(A)`**, in the above example. If this syntax is similar to
pointer, this is because objects are basically pointers. However,
unlike basic pointers, these cannot be used in pointer arithmetics,
cannot be **`null`**, and does not need to be dereferenced to access
the value. In other words, these are reference, more than pointers.
Yes, unlike other object oriented language such as `java` or `D`,
**object instances cannot be `null`**. This is a really important part
of the object system in *Ymir* guaranteeing that every objects are
pointing to a valid value, and that value is correctly initialized
(constructor was called).


We will see in the coming chapters, that removing the possibility of
**`null`** objects does not remove any capacity on the language, while
adding strong safety, the number one error of **`java`** programs
being **NullPointerException** (*cf.* [Which Java exceptions are the
most
frequent?](https://blog.samebug.io/which-java-exceptions-are-the-most-frequent-f830b113c37f),
[The Top 10 Exception Types in Production Java Applications – Based on
1B
Events](https://www.overops.com/blog/the-top-10-exceptions-types-in-production-java-applications-based-on-1b-events/)).
