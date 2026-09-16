@echo off
setlocal
start "" msedge.exe --app="https://jedsonpc3.github.io/dhplay/" --start-maximized --window-position=0,0
if errorlevel 1 start "" "https://jedsonpc3.github.io/dhplay/"
