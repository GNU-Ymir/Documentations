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

## Installation

The reference compiler of **Ymir** is based on the compiler **GCC**,
which offer strong static optimization, as well as a vast set of
supported target architectures.

There are two ways to install the **gyc**, natively **which is not very recommended, the compiler being in beta version**. Or by using a docker.

### Native installation 

This compiler can be installed on linux debian system, by following those simple steps: 
- First, you need to downloads the packages : 
  - [libmidgard-8-dev](https://www.dropbox.com/s/rrjg6vhnhhnoamf/libgmidgard_8.2.0_amd64.deb?dl=0)
  - [GYC](https://www.dropbox.com/s/bt9svmud6vyujsn/gyc-8_8.2.0_amd64.deb?dl=0)

- And then, you need to install them using dpkg : 

```bash
$ sudo dpkg -i libgmidgard_8.2.0_amd64.deb
$ sudo dpkg -i gyc-8_8.2.0_amd64.deb```

The compiler is now installed and is named `gyc-8`

```bash
$ gyc-8 --version

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

To make it easier to use, you can add an alias in the `~/.bashrc` file.

```bash
gyc-8 () {
	docker run -t -v $(pwd):/tmp -w /tmp gnuymir/8.2.0 $*
}
```

Once a new terminal is opened, the `gyc-8` command gives you access to the compiler.
