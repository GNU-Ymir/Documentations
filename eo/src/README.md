# Antaŭparolo

*Ymir* estas altnivela programlingvo kies tipoj estas statikaj, kaj
kiu estas formita tiel ke ĝi helpu programistojn savi tempon donante
fortan kaj sekuran semantikon. La semantiko de tiu programlingvo estas
direktita al sekureco, kunrulado kaj rapideco. Tiuj celoj estas
plenumitaj danke al ĝia granda esprimpleneco, kaj ĝia direkta traduko
al efika denaska maŝinlingvo.

Tiu dokumento esploras la ĉefajn konceptojn de *Ymir*, provizante aron
da ekzemploj kiuj demonstras la fortojn de tiu nova programlingvo. Ĝi
ankaŭ prezentas kelkajn elementojn de la norma biblioteko.

# Gravaĵo

Antaŭ ol oni komencu paroli pri la programlingvo, bonvolu ne forgesi
ke ĝi estas laboro kiu ankoraŭ povas progresi, kaj ke kelkfoje aĵoj
povas ne funkcii laŭvole. Se vi renkontas aĵon kiun vi ne komprenas aŭ
kiu estas eraro laŭ vi, bonvolu kontakti nin je retmesaĝo
<gnu.ymir@mail.com>. Ni jam ĝojos pri legi viajn mesaĝojn!

Aldone, ĉiuj kontribuaĵoj estas varme bonvenaj, ĉu temas pri plibonigi
la dokumentaron, proponi plibonigon de la programlingvo mem aŭ de la
norma biblioteko, de la kerno aŭ eĉ de la aŭtomata procedo de kreado
de nova versio. La fonto estas dispona je
[github](https://github.com/GNU-Ymir). En tiu ĉi dokumento, konataj
limoj de la programlingvo estas kelkfoje emfazitaj, kaj vokas
kontribuaĵojn.

## Instalo

La referenca tradukilo de *Ymir* estas bazita je la tradukilo **GCC**
kiu oferas fortan statikan optimumigon, kaj vastan aron da subtenitaj
celaj arĥitekturoj.

Estas du manieroj por instali la **gyc** (GNU Ymir Compiler), denaske
aŭ per uzi Docker'a kontenero.

### Denaska instalo

Tiu tradukilo povas esti instalita je linux sistemo per sekvi tiujn simplajn etapojn:
- Unue, vi bezonos elŝuti tiujn pakaĵojn : 
  - [libmidgard-11-dev](https://ymir-lang.org/release/gmidgard/11.3.0/libgmidgard_11.3.0_amd64.deb)
  - [GYC](https://ymir-lang.org/release/gymir/11.3.0/gyc-11_11.3.0_amd64.deb)

- Kaj poste, vi povas instali ilin uzante `dpkg` aŭ `apt-get`: 

```bash
$ sudo apt-get install ./libgmidgard_11.3.0_amd64.deb
$ sudo apt-get install ./gyc-11_11.3.0_amd64.deb
```
<br>

Tiuj pakaĵoj dependas de : 
- g++-11
- gcc-11-base
- libc6 >= 2.21
- libgmp10 >= 2:5.0.1~
- libmpc3
- libmpfr6 >= 3.1.3
- zlib1g >= 1:1.1.4
- libgcc1
- zlib1g-dev
- zlib1g >= 1:1.2.0
- libgc-dev >= 1:7.4.2

Se almenaŭ unu el tiuj ne estas instalita, vi akiros eraron, kiu povas esti solvita per lanĉi la sekvan ordonon:

```bash
sudo apt --fix-broken install
```
<br>

Kaj poste reinstali la pakaĵon kiu malsukcesis (uzante `dpkg` aŭ `apt-get`)
La tradukilo estas nun instalita je la nomo `gyc`.

```bash
$ gyc --version

gyc (GCC) 11.3.0
Copyright (C) 2021 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
<br>

### Malinstali denaskan version

Kiel por iu ajn debian'a pakaĵo, la malinstalo estas farita kiel sekve : 

```bash
$ dpkg -r gyc-11
$ dpkg -r libgmidgard-11-dev
```
<br>

## Docker'a instalo

Por komenci, vi bezonas instali docker'n:
```bash
$ sudo apt install docker.io
```
<br>

Tiam elŝuti la docker'an bildon de la deponejo: 
```bash
$ docker pull gnuymir/11.3.0-amd64
```

La tradukilo estas nun atingebla tra la kontenero:
```bash
$ docker run -t -v $(pwd):/tmp -w /tmp gnuymir/11.3.0-amd64 --version

gyc (GCC) 11.3.0
Copyright (C) 2021 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```
<br>

Por ke ĝi estu pli facila por uzi, vi povas aldoni la sekvan alnomon je la `~/.local/bin` dosierujo.
Unue malfermu la tekstan dosieron `~/.local/bin/gyc` kaj kopiu la sekvan linion : 
```bash
docker run -t -v $(pwd):/tmp -w /tmp gnuymir/11.3.0-amd64 $*
```
<br>

Certigu ke vian `PATH` enhavas la dosierujon `~/.local/bin`, kaj malfermu novan ŝelon, kaj lanĉi la sekvan ordonon :

```bash
$ chmod +x ~/.local/bin/gyc
$ gyc --version

gyc (GCC) 11.3.0
Copyright (C) 2021 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```