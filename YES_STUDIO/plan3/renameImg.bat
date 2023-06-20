@echo off
setlocal enabledelayedexpansion

set "folder=C:\workspace\YES_STUDIO\plan3\images\G"

for /r "%folder%" %%F in (*.jpg) do (
    set "filename=%%~nxF"
    set "newname=!filename:A=G!"
    if not "!filename!"=="!newname!" (
    :: echo Renaming "%%F" to "!newname!"
    ren "%%F" "!newname!"
    )
)

echo Image renaming completed.