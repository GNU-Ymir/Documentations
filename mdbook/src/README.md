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

There are two ways to install the **gyc** (Gnu Ymir Compiler), natively or by using a docker container.

### Native installation 

This compiler can be installed on linux debian system, by following those simple steps: 
- First, you need to downloads the packages : 
  - [libmidgard-9-dev](https://ymir-lang.org/release/gmidgard/9.3.0/libgmidgard_9.3.0_amd64.deb)
  - [GYC](https://ymir-lang.org/release/gymir/9.3.0/gyc-9_9.3.0_amd64.deb)

- And then, you need to install them using dpkg : 

```bash
$ sudo dpkg -i libgmidgard_9.3.0_amd64.deb
$ sudo dpkg -i gyc-9_9.3.0_amd64.deb
```
<br>

These packages depend on : 
- g++-9
- gcc-9-base
- libc6 >= 2.21
- libgmp10 >= 2:5.0.1~
- libmpc3
- libmpfr6 >= 3.1.3
- zlib1g >= 1:1.1.4
- libgcc1
- zlib1g-dev
- zlib1g >= 1:1.2.0
- libgc-dev >= 1:7.4.2

If one of them is not installed, you will get an error, that can be resolved by running the following command : 

```bash
$ sudo apt --fix-broken install
$ sudo dpkg -i libgmidgard_9.3.0_amd64.deb
$ sudo dpkg -i gyc-9_9.3.0_amd64.deb
```
<br>

And then reinstall the package that has previously failed (dpkg).
The compiler is now installed and is named `gyc`

```bash
$ gyc --version

gyc-9 (GCC) 9.3.0
Copyright (C) 2018 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
<br>

### Uninstallation of the native version

As for any debian package, the uninstall is done as follows : 

```bash
$ dpkg -r gyc-9
$ dpkg -r libgmidgard-9-dev
```
<br>

**Caution** The uninstallation can sometime remove your gcc
installation.  But you can still reinstall it easily if there is any
problem, by typing :

```bash
sudo apt install --reinstall gcc-9
```

## Docker installation

To start you have to install docker.
```bash
$ sudo apt install docker.io
```
<br>

Then retrieve the docker image from the repository :
```bash
$ docker pull gnuymir/9.3.0-amd64
```

The compiler is now accessible via the container.
```bash
$ docker run -t -v $(pwd):/tmp -w /tmp gnuymir/9.3.0-amd64 --version 
gyc-9 (GCC) 9.3.0
Copyright (C) 2018 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
<br>

To make it easier to use, you can add an alias in the `~/.local/bin` directory.
First open the file `~/.local/bin/gyc` and paste the following line :

```bash
docker run -t -v $(pwd):/tmp -w /tmp gnuymir/9.3.0-amd64 $*
```
<br>

Make sure, that your `PATH` contains the `~/.local/bin`directory, and
then open a new shell, and run the following commands :

```bash
$ chmod +x ~/.local/bin/gyc
$ gyc --version

gyc (GCC) 9.3.0
Copyright (C) 2019 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
