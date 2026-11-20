$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$destination = Join-Path $root 'target/sportscenter-release'

New-Item -ItemType Directory -Force -Path $destination | Out-Null
Copy-Item -LiteralPath (Join-Path $root 'target/sportscenter-0.0.1-SNAPSHOT.jar') -Destination (Join-Path $destination 'sportscenter.jar')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'compose.yaml'), (Join-Path $PSScriptRoot 'Caddyfile') -Destination $destination
$archive = Join-Path $root 'target/sportscenter-release.tar.gz'
tar -czf $archive -C $destination sportscenter.jar compose.yaml Caddyfile -C (Join-Path $root 'client') dist
if ($LASTEXITCODE -ne 0) { throw 'Could not create release archive' }
Get-FileHash -Algorithm SHA256 -LiteralPath $archive | Format-List
