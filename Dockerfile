# Heroku uses Ubuntu, so building in Alpine will not work
FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install -y wget cmake make build-essential python3 git p7zip

WORKDIR /
RUN git clone https://github.com/emscripten-core/emsdk.git
WORKDIR /emsdk
RUN git checkout 4.0.10
RUN ./emsdk install latest
RUN ./emsdk activate latest

WORKDIR /7z-src
RUN wget https://www.7-zip.org/a/7z2409-src.7z
RUN p7zip -d 7z2409-src.7z

WORKDIR /app
