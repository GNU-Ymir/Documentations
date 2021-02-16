# install the plugins and build the static site
gitbook install

# install local modifications
cp -r gitbook-plugin-spoiler node_modules/
cp -r prismjs node_modules/
cp -r themes node_modules/themes

# build the static site
gitbook build

# checkout to the gh-pages branch
if git checkout gh-pages ; then 

    # pull the latest updates
    if git pull origin gh-pages --rebase ; then 

	# copy the static site files into the current directory.
	cp -R _book/* .	

	# remove 'node_modules' and '_book' directory
	git clean -fx node_modules
	git clean -fx _book

	# add all files
	git add .

	# commit
	git commit -a -m "Update docs"

	# push to the origin
	git push origin gh-pages
    else
	echo "Failed rebase";
    fi
else
    echo "Failed checkout";
fi

# checkout to the master branch
git checkout master
