@echo off
npx nodemon --watch . --ext js,html,css --exec "npx http-server . -o -p 9999"

