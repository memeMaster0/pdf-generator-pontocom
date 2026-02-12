# PyInstaller spec: gera fill_and_export_pdf.exe (sem precisar instalar Python no PC do usuário)
# Uso: pyinstaller fill_and_export_pdf.spec
# Requer: pip install pyinstaller xlwings

a = Analysis(
    ['fill_and_export_pdf.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=['xlwings', 'xlwings._xlwindows'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='fill_and_export_pdf',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
