param([string]$Notas = "Atualizacao de manutencao.")

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$versionFile = Join-Path $root "version.json"
$serviceWorker = Join-Path $root "sw.js"
$data = Get-Content -LiteralPath $versionFile -Raw | ConvertFrom-Json

if ([string]$data.version -notmatch '^(\d+)\.(\d+)\.(\d+)$') {
  throw "Versao invalida em version.json. Use o formato 1.1.0."
}

$next = "{0}.{1}.{2}" -f [int]$Matches[1], [int]$Matches[2], ([int]$Matches[3] + 1)
$updated = [ordered]@{
  version = $next
  deployedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:sszzz")
  notes = $Notas
}
$updated | ConvertTo-Json | Set-Content -LiteralPath $versionFile -Encoding UTF8

$sw = Get-Content -LiteralPath $serviceWorker -Raw
$sw = [regex]::Replace($sw, "const CACHE='dhplay-v[^']+';", "const CACHE='dhplay-v$next';")
Set-Content -LiteralPath $serviceWorker -Value $sw -Encoding UTF8
Write-Host "Versao atualizada para $next"
