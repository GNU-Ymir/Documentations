# Introduction

**Ymir** is a high level programming language, with static typing,
  aiming to help developpers to gain time by proposing type safety,
  and strong and safe semantic. The semantic of this language is
  oriented on safety, concurrency and execution speed. Those
  objectives are achieved thanks to its high expressivity and its
  direct compilation to a efficient native machine language.


This documentation explores the main concept of **Ymir**, by proposing
a collection of examples that demonstrates the assets of this new
language. This travel, will presents some part of the standard library
as well.

# Important

Before we start the explanations of the language, please keep in mind
that it is under development and that sometimes things might just
**not work as expected**. If you encounter errors that you can't
understand, or that appears false to you, please concact us at <gnu.ymir@mail.com>. We would be happy to receive mail from you !

## Installation

The reference compiler of **Ymir** is based on the compiler **GCC**,
which offer strong static optimization, as well as a vast set of
supported target architectures.

There are two ways to install the **gyc** (Gnu Ymir Compiler), natively. Or by using a docker.

### Native installation 

This compiler can be installed on linux debian system, by following those simple steps: 
- First, you need to downloads the packages : 
  - [libmidgard-8-dev](https://www.dropbox.com/s/mak3hjk3p6pm9kw/libgmidgard_8.2.0_amd64.deb?dl=0)
  - [GYC](https://www.dropbox.com/s/futjf3uphgl0myt/gyc-8_8.2.0_amd64.deb?dl=0)
	
- And then, you need to install them using dpkg : 

```bash
$ sudo dpkg -i libgmidgard_8.2.0_amd64.deb
$ sudo dpkg -i gyc-8_8.2.0_amd64.deb```

These packages depend on : 
- g++-8
- gcc-8-base
- libc6 >= 2.14
- libgmp10 >= 2:5.0.1~
- libisl19 >= 0.15
- libmpc3
- libmpfr6 >= 3.1.3
- zlib1g >= 1:1.1.4
- libgcc1
- zlib1g-dev
- zlib1g >= 1:1.2.0
- libgc-dev >= 1:7.4.2

If one of them is not installed, you will get an error, that can be resolved by launching the command : 
```bash
sudo apt --fix-broken install
```

And then reinstall the package that has previously failed (dpkg).
The compiler is now installed and is named `gyc`

```bash
$ gyc --version

gyc-8 (GCC) 8.2.0
Copyright (C) 2018 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.```

### Uninstallation of the native version

As for any debian package, the uninstall is done as follows : 

```bash
$ dpkg -r gyc-8
$ dpkg -r libgmidgard-8-dev
```
**Caution** The uninstallation can remove your gcc installation.
But you can still reinstall it easily if there is problem, by typing : 
```ymir
sudo apt install --reinstall gcc-8 
```

## Docker installation

To start you have to install docker.
```bash
$ sudo apt install docker.io
```

Then retrieve the docker image from the repository :
```bash
$ docker pull gnuymir/8.2.0
```

The compiler is now accessible via the container.
```bash
$ docker run -t -v $(pwd):/tmp -w /tmp gnuymir/8.2.0 --version 
gyc-8 (GCC) 8.2.0
Copyright (C) 2018 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.```

To make it easier to use, you can add an alias in the `~/.local/bin` directory.

```bash
$ echo "docker run -t -v $(pwd):/tmp -w /tmp gnuymir/8.2.0 $*" > ~/.local/bin/gyc-8
$ chmod +x ~/.local/bin/gyc-8
$ gyc-8 --version

gyc-8 (GCC) 8.2.0
Copyright (C) 2018 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
