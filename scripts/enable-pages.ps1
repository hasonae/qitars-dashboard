# تفعيل GitHub Pages (Source: GitHub Actions) والتحقق من سير العمل
$ErrorActionPreference = "Continue"
$owner = "hasonae"
$repoName = "qitars-dashboard"
$workDir = "c:\Users\TOSHIBA\Desktop\alwaitiu"
Set-Location $workDir
$out = @()

$credInput = "protocol=https`nhost=github.com`n"
$credLines = $credInput | & git credential fill 2>$null
$username = ($credLines | Where-Object { $_ -like "username=*" }) -replace "^username=", ""
$token = ($credLines | Where-Object { $_ -like "password=*" }) -replace "^password=", ""
$apiHeaders = @{
    "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$username`:$token"))
    "Accept" = "application/vnd.github+json"
    "User-Agent" = "qitars-publish"
}

# تفعيل Pages بمصدر GitHub Actions
try {
    $body = '{"build_type":"workflow"}'
    Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repoName/pages" -Headers $apiHeaders -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30 | Out-Null
    $out += "Pages ENABLED with build_type=workflow"
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $out += "Pages enable attempt (status: $status) — قد يكون مفعّلاً مسبقاً أو يحتاج تفعيلاً يدوياً"
    if ($_.ErrorDetails.Message) { $out += $_.ErrorDetails.Message }
}

# حالة Pages
try {
    $pg = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repoName/pages" -Headers $apiHeaders -Method Get -TimeoutSec 30
    $out += "Pages URL: $($pg.html_url)"
    $out += "Pages status: $($pg.status) | build_type: $($pg.build_type)"
} catch {
    $out += "Pages GET: not enabled yet"
}

# آخر تشغيلات Actions
try {
    $runs = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repoName/actions/runs?per_page=3" -Headers $apiHeaders -Method Get -TimeoutSec 30
    $out += "workflow runs: $($runs.total_count)"
    foreach ($r in $runs.workflow_runs) {
        $out += "run: $($r.name) | $($r.status) | $($r.conclusion) | $($r.html_url)"
    }
} catch {
    $out += "runs check failed: $($_.Exception.Message)"
}

$out | Set-Content pages.log
$out | ForEach-Object { Write-Output $_ }