# Introduction

*Ymir* is a high-level, statically typed programming language
  designed to help developers to save time by providing strong and
  safe semantic. The semantic of this language is oriented towards
  safety, concurrency and speed of execution. These objectives are
  achieved thanks to its high expressiveness and its direct
  compilation into an efficient native machine language.

This documentation explores the main concepts of *Ymir*, providing a
set of examples that demonstrate the strengths of this new
language. It also presents an introduction to the standard library.

# Important

Before starting to discuss the language, please keep in mind that it
is still under development and that sometimes things may not work as
expected. If you encounter errors that you do not understand or think
are incorrect, please contact us at: <gnu.ymir@mail.com>. We look
forward to receiving your mails!

Even more, all contributions are very welcome, whether to improve the
documentation, to propose improvements to the language or std, to the
runtime, or even to the automatic release generation procedure. All
code repositories are available on
[github](https://github.com/GNU-Ymir). In this documentation, known
limitations of the language are sometimes highlighted, and calls for
contribution.

## Installation

The reference compiler of *Ymir* is based on the compiler **GCC**,
which offer strong static optimization, as well as a vast set of
supported target architectures.

This compiler can be installed on linux debian system, by following those simple steps: 
- First, you need to download the package :
  - [gyc-11](https://ymir-lang.org/release/gyc/11.3.0/gyc_11.3.0_amd64.deb)

Other gyc versions using other gcc backend versions are available at
[release](https://ymir-lang.org/release/).

- And then, you need to install it using dpkg : 

```bash
$ sudo dpkg -i gyc-11_11.3.0_amd64.deb
```
<br>

This package depends on : 
- g++-11
- gcc-11
- libgc-dev

If one of them is not installed, you will get an error, that can be resolved by running the following command : 

```bash
sudo apt --fix-broken install
```
<br>

And then reinstall the package that has previously failed (dpkg).
The compiler is now installed and is named `gyc`

```bash
$ gyc --version

gyc (GCC) 11.3.0
Copyright (C) 2021 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
<br>

### Uninstallation 

As for any debian package, the uninstall is done as follows : 

```bash
$ dpkg -r gyc
```