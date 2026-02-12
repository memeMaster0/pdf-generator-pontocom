@echo off
REM Gera fill_and_export_pdf.exe para que o app funcione sem Python instalado.
REM Execute na pasta pdf_export: build_exe.bat
REM Requer: Python instalado (só para este build), pip install pyinstaller xlwings

set "SAVED_DIR=%CD%"
cd /d "%~dp0"
if not exist "fill_and_export_pdf.py" ( echo fill_and_export_pdf.py nao encontrado. & exit /b 1 )

pip install pyinstaller xlwings --quiet
pyinstaller --noconfirm fill_and_export_pdf.spec

if exist "dist\fill_and_export_pdf.exe" (
  echo.
  echo build concluido: dist\fill_and_export_pdf.exe
  cd /d "%SAVED_DIR%"
) else (
  echo build falhou.
  cd /d "%SAVED_DIR%"
  exit /b 1
)
