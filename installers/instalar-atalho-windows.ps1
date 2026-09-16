$ErrorActionPreference = "Stop"

$packageRoot = Split-Path -Parent $PSScriptRoot
$appUrl = "https://jedsonpc3.github.io/dhplay/"
$iconFile = Join-Path $packageRoot "dhplay.ico"
$desktop = [Environment]::GetFolderPath("Desktop")
$programs = [Environment]::GetFolderPath("Programs")
$startMenuDir = Join-Path $programs "DHPlay"
$shortcutName = "DHPlay.lnk"

$browserCandidates = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$browser = $browserCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $browser) { throw "Microsoft Edge ou Google Chrome nao foi encontrado." }

New-Item -ItemType Directory -Force -Path $startMenuDir | Out-Null
$shell = New-Object -ComObject WScript.Shell
foreach ($shortcutPath in @((Join-Path $desktop $shortcutName), (Join-Path $startMenuDir $shortcutName))) {
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = $browser
  $shortcut.Arguments = "--app=`"$appUrl`" --start-maximized --window-position=0,0"
  $shortcut.WorkingDirectory = $packageRoot
  $shortcut.WindowStyle = 3
  $shortcut.Description = "Abrir DHPlay maximizado, sem barras do navegador"
  if (Test-Path -LiteralPath $iconFile) { $shortcut.IconLocation = "$iconFile,0" }
  $shortcut.Save()
}

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show(
  "Instalacao concluida.`n`nO atalho DHPlay foi criado na Area de Trabalho e no Menu Iniciar.",
  "DHPlay"
) | Out-Null
