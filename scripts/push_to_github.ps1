param(
    [string]$RemoteUrl = 'https://github.com/amrahulsaini/jecrcfoundation.git',
    [string]$Branch = 'main'
)

Write-Host "Preparing to push repository to: $RemoteUrl`n"

if (-not (Test-Path -Path .git)) {
    Write-Host "No git repository found — initializing..."
    git init
} else {
    Write-Host "Git repository found."
}

# Add all files and commit
git add -A

$status = git status --porcelain
if ($status) {
    $msg = Read-Host "Enter commit message (or press Enter for 'chore: update')"
    if (-not $msg) { $msg = 'chore: update' }
    git commit -m $msg
} else {
    Write-Host "No changes to commit."
}

# Configure remote
$existing = git remote get-url origin 2>$null
if ($existing) {
    Write-Host "Remote 'origin' exists: $existing"
    $confirm = Read-Host "Overwrite remote 'origin' with $RemoteUrl? (y/N)"
    if ($confirm -ne 'y') {
        Write-Host "Aborting remote update. If you want to keep existing remote, push manually."
        exit 0
    }
    git remote remove origin
}

git remote add origin $RemoteUrl

git branch -M $Branch

Write-Host "Pushing to origin/$Branch..."
try {
    git push -u origin $Branch
    Write-Host "Push completed."
} catch {
    Write-Host "Push failed. Common reasons: authentication or branch protection."
    Write-Host "Options: 1) Configure SSH remote (git@github.com:owner/repo.git), 2) Use a PAT with HTTPS, 3) Push from a machine with credentials."
    exit 1
}

Write-Host "Done. If you used HTTPS and require a PAT, follow GitHub instructions to create a personal access token and use it as your password when prompted."
