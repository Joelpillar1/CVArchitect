# PowerShell script to update all templates with casing support

$templates = @(
    "ApexTemplate.tsx",
    "ClassicTemplate.tsx", 
    "DevTemplate.tsx",
    "EliteTemplate.tsx",
    "ImpactTemplate.tsx",
    "SimpleProTemplate.tsx"
)

$templatesPath = "c:\Users\dhonl\Downloads\cv-architect\components\templates"

foreach ($template in $templates) {
    $filePath = Join-Path $templatesPath $template
    
    if (Test-Path $filePath) {
        Write-Host "Processing $template..."
        
        # Read content
        $content = Get-Content $filePath -Raw
        
        # Replace section header uppercase
        $content = $content -replace 'className=\{`font-bold uppercase (.*?)\$\{getSectionHeaderAlignment\(\)\}`\}', 'className={`font-bold $1${getSectionHeaderAlignment()} ${data.sectionHeaderCase || ''uppercase''}`}'
        
        # Replace main header uppercase  
        $content = $content -replace 'className="font-bold uppercase', 'className={`font-bold ${data.headerCase || ''uppercase''}`'
        $content = $content -replace 'className=\{`font-bold uppercase', 'className={`font-bold ${data.headerCase || ''uppercase''}`'
        
        # Write back
        Set-Content -Path $filePath -Value $content -NoNewline
        
        Write-Host "✓ Updated $template"
    }
}

Write-Host "`nAll templates updated!"
