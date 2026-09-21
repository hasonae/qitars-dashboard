# سكربت نشر كامل: إنشاء المستودع عبر GitHub API + الدفع + تفعيل Pages
$ErrorActionPreference = "Continue"
$owner = "hasonae"
$repoName = "qitars-dashboard"
$workDir = "c:\Users\TOSHIBA\Desktop\alwaitiu"
Set-Location $workDir
$out = @()

# ── 1) الحصول على بيانات الاعتماد المخزّنة من Git Credential Manager ──
$credInput = "protocol=https`nhost=github.com`n"
$credLines = $credInput | & git credential fill 2>$null
$username = ($credLines | Where-Object { $_ -like "username=*" }) -replace "^username=", ""
$token = ($credLines | Where-Object { $_ -like "password=*" }) -replace "^password=", ""

if (-not $username -or -not $token) {
    $out += "ERROR: no stored GitHub credential found"
    $out | Set-Content publish.log
    exit 1
}
$out += "credential OK for user: $username"

$authHeader = "Basic " + [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$username`:$token"))
$apiHeaders = @{
    "Authorization" = $authHeader
    "Accept" = "application/vnd.github+json"
    "User-Agent" = "qitars-publish"
}

# ── 2) إنشاء المستودع إذا لم يكن موجوداً ──
try {
    $existing = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repoName" -Headers $apiHeaders -Method Get -TimeoutSec 30
    $out += "repo already exists: $($existing.full_name) (default branch: $($existing.default_branch))"
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    if ($status -eq 404) {
        $body = @{ name = $repoName; private = $false; description = "Qitars Dashboard - Next.js + Tailwind + Recharts"; auto_init = $false } | ConvertTo-Json
        try {
            $created = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $apiHeaders -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30
            $out += "repo CREATED: $($created.full_name)"
        } catch {
            $out += "CREATE FAILED: $($_.Exception.Message)"
            if ($_.ErrorDetails.Message) { $out += $_.ErrorDetails.Message }
        }
    } else {
        $out += "repo check failed with status: $status"
    }
}

# ── 3) ربط الـ remote والدفع ──
$remoteUrl = "https://github.com/$owner/$repoName.git"
$hasRemote = git remote
if ($hasRemote -contains "origin") {
    git remote set-url origin $remoteUrl | Out-Null
    $out += "remote updated: $remoteUrl"
} else {
    git remote add origin $remoteUrl | Out-Null
    $out += "remote added: $remoteUrl"
}

git push -u origin main 2>&1 | ForEach-Object { $out += "push: $_" }
$pushOk = ($LASTEXITCODE -eq 0)
if (-not $pushOk) {
    $out += "normal push failed (repo may contain README) — retrying with --force (fresh repo)..."
    git push -u origin main --force 2>&1 | ForEach-Object { $out += "push-force: $_" }
    $pushOk = ($LASTEXITCODE -eq 0)
}
if ($pushOk) { $out += "PUSH SUCCESS" } else { $out += "PUSH FAILED" }

# ── 4) تفعيل GitHub Pages (Source: GitHub Actions) ──
try {
    $pagesBody = '{"source":{"branch":"main","path":"/"}}'
    Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repoName/pages" -Headers $apiHeaders -Method Post -Body $pagesBody -ContentType "application/json" -TimeoutSec 30 | Out-Null
    $out += "Pages ENABLED (source: GitHub Actions on main)"
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $out += "Pages enable skipped (status: $status) — إنهاء عبر الموقع: Settings → Pages → Source: GitHub Actions"
}

# ── 5) حالة Pages النهائية ──
try {
    $pg = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repoName/pages" -Headers $apiHeaders -Method Get -TimeoutSec 30
    $out += "Pages URL: $($pg.html_url)"
    $out += "Pages status: $($pg.status) | source: $($pg.source.branch) $($pg.source.path)"
} catch {
    $out += "Pages status: not enabled yet"
}

$out | Set-Content publish.log
$out | ForEach-Object { Write-Output $_ }