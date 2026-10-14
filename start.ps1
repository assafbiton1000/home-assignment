# Starts the catalog API, the orders API and the client, each in its own window.
# SQL Server (LocalDB) and MongoDB must already be running.

$root = $PSScriptRoot

foreach ($dir in 'orders-api', 'client') {
    if (-not (Test-Path "$root\$dir\node_modules")) {
        npm install --prefix "$root\$dir"
    }
}

Start-Process powershell -WorkingDirectory "$root\catalog-api" -ArgumentList '-NoExit', '-Command', 'dotnet run'
Start-Process powershell -WorkingDirectory "$root\orders-api" -ArgumentList '-NoExit', '-Command', 'npm start'
Start-Process powershell -WorkingDirectory "$root\client" -ArgumentList '-NoExit', '-Command', 'npm run dev'

# The page loads the catalog once, so open it only after the catalog API answers
Write-Host 'Waiting for the catalog API...'
for ($i = 0; $i -lt 60; $i++) {
    try {
        Invoke-WebRequest 'http://localhost:5222/api/categories' -UseBasicParsing | Out-Null
        Start-Process 'http://localhost:5173'
        exit
    } catch {
        Start-Sleep -Seconds 2
    }
}
Write-Host 'The catalog API did not start within two minutes. Check its window for errors.'
