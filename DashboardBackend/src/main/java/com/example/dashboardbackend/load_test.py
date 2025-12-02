# Test Kafka by multiple records
$merchants = @("Starbucks", "McDonalds", "Grab", "Shopee", "Netflix", "Joy Jungle", "MillionMinda", "BajuPrint", "Kotaku", "ABC", "XYZ")
$categories = @("RHB", "CIMB", "AiraPay", "Alipay+", "Boost", "DuitnowQR", "GrabPay", "MCash", "MobyPay", "Paydee", "Retailpay", "ShopeePay", "SPay", "SPayLater", "TnG", "UnionPay", "WannaPay", "WavPay", "Visa", "Mastercard", "FPX")
$statuses = @("success", "success", "success", "pending", "failed")
while ($true) {
    Write-Host "Sending batch of 100..." -ForegroundColor Green
    1..100 | % {
        $m = $merchants | Get-Random
        $c = $categories | Get-Random
        $s = $statuses | Get-Random
        $amt = Get-Random -Min 10 -Max 500
        $body = @{ merchant=$m; amount=$amt; category=$c; status=$s } | ConvertTo-Json -Compress
        Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/dashboard/ingest" -ContentType "application/json" -Body $body -ErrorAction SilentlyContinue
    }
    Write-Host "Batch complete. Waiting 1 second..."
    Start-Sleep -Seconds 1
}


# Test Kafka by 1 record
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/dashboard/ingest" -ContentType "application/json" -Body '{"merchant": "Starbucks123", "amount": 35.50, "category": "Tng", "status": "success"}'

# Check how many count
docker-compose exec db psql -U postgres -d axai_dashboard -c "SELECT COUNT(*) FROM transaction;"

# Remove container
docker-compose down -v

# Rebuild container
docker-compose up -d --build

# Using docker terminal to check db
docker exec -it dashboardbackend-db-1 psql -U postgres -d axai_dashboard
# to exit
\q