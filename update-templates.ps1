$templates = @(
    "WonsultingTemplate.tsx",
    "SmartTemplate.tsx",
    "SimpleProTemplate.tsx",
    "PrimeProfile.tsx",
    "MinimalistTemplate.tsx",
    "ImpactTemplate.tsx",
    "EliteTemplate.tsx",
    "ElevateResume.tsx",
    "ElegantTemplate.tsx",
    "DevTemplate.tsx",
    "ClassicTemplate.tsx",
    "ApexTemplate.tsx"
)

$basePath = "l:\CVArchitect\components\templates"

foreach ($template in $templates) {
    $filePath = Join-Path $basePath $template
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Check if already has the import
        if ($content -notmatch "parseDescriptionBullets") {
            # Add import after the ResumeData import
            $content = $content -replace "(import \{ ResumeData \} from '../../types';)", "`$1`r`nimport { parseDescriptionBullets } from '../../utils/templateUtils';"
            
            # Replace all occurrences of exp.description.split('\n')
            $content = $content -replace "exp\.description\.split\('\\\\n'\)", "parseDescriptionBullets(exp.description)"
            
            # Save the file
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "Updated: $template" -ForegroundColor Green
        } else {
            Write-Host "Skipped (already updated): $template" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Not found: $template" -ForegroundColor Red
    }
}

Write-Host "`nAll templates updated!" -ForegroundColor Cyan
