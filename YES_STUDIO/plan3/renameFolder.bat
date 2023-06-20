@echo off
setlocal enabledelayedexpansion

set "rootPath=C:\workspace\YES_STUDIO\plan3\images\G"

rem Rename folders
for /d /r "%rootPath%" %%G in (*) do (
  set "folder=%%~nxG"
  set "newFolder=!folder:A=G!"
  if not "!newFolder!"=="!folder!" (
    ren "%%G" "!newFolder!"
  )
)

echo Folder renaming completed.
pause
