cd en/
mdbook build
cp -r saves/* book/
scp -r book vps:.
ssh vps "sudo rm -rf /var/www/ymir-lang/en/* ; sudo mv book/* /var/www/ymir-lang/en"

cd ../eo/
mdbook build
cp -r saves/* book/
scp -r book vps:.
ssh vps "sudo rm -rf /var/www/ymir-lang/eo/* ; sudo mv book/* /var/www/ymir-lang/eo"
