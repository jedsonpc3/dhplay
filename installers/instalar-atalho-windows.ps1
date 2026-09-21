$ErrorActionPreference = "Stop"

$packageRoot = Split-Path -Parent $PSScriptRoot
$appUrl = "https://jedsonpc3.github.io/dhplay/"
$iconFile = Join-Path $packageRoot "dhgplay.ico"
$desktop = [Environment]::GetFolderPath("Desktop")
$programs = [Environment]::GetFolderPath("Programs")
$startMenuDir = Join-Path $programs "DHGPlay"
$shortcutName = "DHGPlay.lnk"
$legacyDesktopShortcut = Join-Path $desktop "DHPlay.lnk"
$legacyStartMenuDir = Join-Path $programs "DHPlay"

$browserCandidates = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$browser = $browserCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $browser) { throw "Microsoft Edge ou Google Chrome nao foi encontrado." }

New-Item -ItemType Directory -Force -Path $startMenuDir | Out-Null
if (Test-Path -LiteralPath $legacyDesktopShortcut) { Remove-Item -LiteralPath $legacyDesktopShortcut -Force }
if (Test-Path -LiteralPath $legacyStartMenuDir) { Remove-Item -LiteralPath $legacyStartMenuDir -Recurse -Force }
$shell = New-Object -ComObject WScript.Shell
foreach ($shortcutPath in @((Join-Path $desktop $shortcutName), (Join-Path $startMenuDir $shortcutName))) {
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = $browser
  $shortcut.Arguments = "--app=`"$appUrl`" --start-maximized --window-position=0,0"
  $shortcut.WorkingDirectory = $packageRoot
  $shortcut.WindowStyle = 3
  $shortcut.Description = "Abrir DHGPlay maximizado, sem barras do navegador"
  if (Test-Path -LiteralPath $iconFile) { $shortcut.IconLocation = "$iconFile,0" }
  $shortcut.Save()
}

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show(
  "Instalacao concluida.`n`nO atalho DHGPlay foi criado na Area de Trabalho e no Menu Iniciar.",
  "DHGPlay"
) | Out-Null
