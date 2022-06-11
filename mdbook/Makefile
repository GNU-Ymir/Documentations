SRC=$(wildcard src/*.md)
SCP = scp -r book vps:.

all: $(SRC)
	mdbook build
	cp -r saves/* book/

install: all
	$(SCP)
	ssh vps "sudo rm -rf /var/www/ymir-lang"
	ssh vps "sudo mv book /var/www/ymir-lang"
