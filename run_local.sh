#rm -rf _book
gitbook install .
cp -r themes node_modules/
cp -r themes/style.css gitbook/
cp -r gitbook-plugin-spoiler node_modules/
cp -r gitbook-plugin-code node_modules/
cp -r prismjs node_modules/
cp -r prismjs/gitbook-plugin-prism/ node_modules/
cp -r gitbook-plugin-anchor-nav-x/ node_modules/
gitbook serve .

