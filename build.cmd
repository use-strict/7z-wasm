docker build --force-rm -t 7z-build . &&^
docker run --rm -it -v "%CD%":/app -w /app --env-file build-umd.env 7z-build bash -e build_in_docker.sh &&^
del 7zz.umd.js &&^
rename 7zz.js 7zz.umd.js &&^
docker run --rm -it -v "%CD%":/app -w /app --env-file build-es6.env 7z-build bash -e build_in_docker.sh &&^
del 7zz.es6.js &&^
rename 7zz.js 7zz.es6.js
