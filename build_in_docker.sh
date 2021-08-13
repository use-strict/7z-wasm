#!/bin/bash -e

cd /7z-src

git apply --ignore-whitespace /app/7zz-emcc.patch
cd CPP/7zip/Bundles/Alone2

source /emsdk/emsdk_env.sh
emmake make -j -f makefile.emcc
cp _o/7zz.* /app
