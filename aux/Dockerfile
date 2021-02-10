FROM ubuntu:18.04

RUN apt-get -y update && \
	apt-get install -y npm && \
	npm install gitbook-cli -g 

RUN useradd -ms /bin/bash ymir && echo "ymir:ymir" | chpasswd && adduser ymir sudo

USER ymir

WORKDIR /home/ymir
RUN git clone --depth=1 git@github.com:GNU-Ymir/Documentations.git
WORKDIR /home/ymir/Documentations

RUN git checkout gh-pages
RUN git pull origin gh-pages --rebase

RUN cp -R _book/* .

# overwrite this with 'CMD []' in a dependent Dockerfile
CMD ["/bin/bash"]
