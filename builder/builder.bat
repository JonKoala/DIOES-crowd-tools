@echo off

rem put node and npm in the PATH
set "PATH=%APPDATA%\npm;%PATH%"

set /p opmode=%cd%^>Inform operation mode (default or simple): 

rem execute gulp command
cmd /k gulp %opmode%
