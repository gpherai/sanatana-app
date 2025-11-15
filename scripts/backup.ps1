# Sanatana Kalender Backup Script
# Maakt een ZIP backup zonder node_modules en build artifacts

$projectName = "sanatana-kalender"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$backupName = "${projectName}_backup_${timestamp}.zip"
$backupPath = "..\${backupName}"
$tempFolder = "..\temp_backup_$timestamp"

Write-Host "Creating backup: $backupName" -ForegroundColor Cyan
Write-Host ""

# Definieer uit te sluiten mappen en bestanden
$excludeDirs = @("node_modules", ".next", ".cache", "dist", "build", "coverage", ".turbo")
$excludeFiles = @("*.log", ".env", "dev.db", "dev.db-journal")

try {
    # Maak tijdelijke folder
    New-Item -ItemType Directory -Path $tempFolder -Force | Out-Null
    
    Write-Host "Copying project files (excluding node_modules, build artifacts)..." -ForegroundColor Yellow
    
    # Copy alles behalve excluded items
    # Gebruik -join om arrays om te zetten naar ruimte-gescheiden strings voor robocopy
    $excludeDirsString = $excludeDirs -join ' '
    $excludeFilesString = $excludeFiles -join ' '
    
    robocopy . $tempFolder /E /XD $excludeDirs /XF $excludeFiles /NFL /NDL /NJH /NJS /nc /ns /np
    
    Write-Host "Files copied to temp folder" -ForegroundColor Green
    Write-Host ""
    
    # Maak ZIP
    Write-Host "Creating ZIP archive..." -ForegroundColor Yellow
    Compress-Archive -Path "$tempFolder\*" -DestinationPath $backupPath -Force
    
    Write-Host ""
    Write-Host "Backup created successfully!" -ForegroundColor Green
    Write-Host "Location: $backupPath" -ForegroundColor Cyan
    
    $sizeInMB = (Get-Item $backupPath).Length / 1MB
    $sizeFormatted = [math]::Round($sizeInMB, 2)
    Write-Host "Size: $sizeFormatted MB" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Backup saved in parent directory" -ForegroundColor Gray
}
catch {
    Write-Host ""
    Write-Host "ERROR: Backup failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}
finally {
    # Cleanup tijdelijke folder (gebeurt altijd, zelfs bij errors)
    if (Test-Path $tempFolder) {
        Write-Host "Cleaning up temporary folder..." -ForegroundColor Gray
        Remove-Item -Recurse -Force $tempFolder
    }
}
