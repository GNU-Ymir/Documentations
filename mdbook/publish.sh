mdbook build
cp -r saves/* book/
scp -r book vps:.
ssh vps "sudo mv book/* /var/www/ymir-lang/"
