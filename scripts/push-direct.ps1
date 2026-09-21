# دفع مباشر باستخدام بيانات الاعتماد المخزّنة — بدون نوافذ انتظار
$ErrorActionPreference = "Continue"
$owner = "hasonae"
$repoName = "qitars-dashboard"
$workDir = "c:\Users\TOSHIBA\Desktop\alwaitiu"
Set-Location $workDir
$out = @()

# إيقاف أي عملية git معلّقة
Get-Process git -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
$out += "killed stale git processes (if any)"

# استخراج بيانات الاعتماد المخزّنة
$credInput = "protocol=https`nhost=github.com`n"
$credLines = $credInput | & git credential fill 2>$null
$username = ($credLines | Where-Object { $_ -like "username=*" }) -replace "^username=", ""
$token = ($credLines | Where-Object { $_ -like "password=*" }) -replace "^password=", ""

if (-not $username -or -not $token) {
    $out += "ERROR: no stored credential"
    $out | Set-Content push.log
    exit 1
}
$out += "credential OK for: $username"

# الدفع عبر URL مؤقت يحمل الرمز (لا يُكتب في الإعدادات)
$pushUrl = "https://$username`:$token@github.com/$owner/$repoName.git"
$env:GIT_TERMINAL_PROMPT = "0"
& git -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=60 push --progress $pushUrl main:main 2>&1 | ForEach-Object { $out += "push: $_" }
if ($LASTEXITCODE -eq 0) { $out += "PUSH SUCCESS" } else { $out += "PUSH FAILED (exit $LASTEXITCODE)" }

$out | Set-Content push.log
$out | ForEach-Object { Write-Output $_ }