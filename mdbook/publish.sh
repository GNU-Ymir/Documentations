mdbook build
cp -r saves/* book/
scp -r book vps:.
ssh vps "sudo cp -r book/* /var/www/ymir-lang/"
ssh vps "rm -rf book"
