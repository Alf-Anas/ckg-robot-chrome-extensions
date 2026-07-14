$repo = "Alf-Anas/ckg-robot-chrome-extensions"
$assetName = "ckg-robot-chrome-extensions.zip"

# Use current script directory (BEST for exe/updater)
$installPath = [System.IO.Path]::GetDirectoryName([System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName)

$tempZip = "$env:TEMP\extension.zip"
$tempExtract = "$env:TEMP\extension_extract"

Write-Host "Checking latest release..."

# 1. Get latest release
$release = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases/latest"

# 2. Find asset
$asset = $release.assets | Where-Object { $_.name -eq $assetName }

if (-not $asset) {
    Write-Host "Asset not found: $assetName"
    exit 1
}

$downloadUrl = $asset.browser_download_url
$version = $release.tag_name

Write-Host "Latest version: $version"
Write-Host "Downloading..."

# 3. Download zip
Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip
Write-Host "1"

# 6. Extract new version
Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force
Write-Host "2"

# 7. Move extracted files into current dir
New-Item -ItemType Directory -Force -Path $installPath | Out-Null
Copy-Item "$tempExtract\*" $installPath -Recurse -Force

Write-Host "3"

# 8. Cleanup
Remove-Item $tempZip -Force
Remove-Item $tempExtract -Recurse -Force

Write-Host "Update completed: $version"

# 9. Open Chrome extension page
Start-Process -FilePath "chrome.exe" -ArgumentList "--new-tab", "chrome://extensions/", "https://trakteer.id/alf-anas"