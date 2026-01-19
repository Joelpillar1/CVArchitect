# Script to update all templates to use parseDescriptionBullets
# This is a documentation file showing which templates need updating

Templates that need updating (use parseDescriptionBullets instead of .split('\n')):

1. WonsultingTemplate.tsx - Lines 105, 250
2. SmartTemplate.tsx - Lines 97, 141  
3. SimpleProTemplate.tsx - Line 105
4. PrimeProfile.tsx - Line 90
5. MinimalistTemplate.tsx - Lines 87, 91, 142
6. ImpactTemplate.tsx - Line 139
7. EliteTemplate.tsx - Line 162
8. ElevateResume.tsx - Line 132
9. ElegantTemplate.tsx - Lines 95, 144
10. DevTemplate.tsx - Line 162
11. ClassicTemplate.tsx - Line 107
12. ApexTemplate.tsx - Line 150

Already updated:
✅ FreeTemplate.tsx
✅ StyledTemplate.tsx
✅ VanguardTemplate.tsx (uses parseDescriptionBullets)
✅ ModernTemplate.tsx (uses parseDescriptionBullets)
✅ ExecutiveTemplate.tsx (uses parseDescriptionBullets)

For each template, need to:
1. Add import: import { parseDescriptionBullets } from '../../utils/templateUtils';
2. Replace: exp.description.split('\n')
   With: parseDescriptionBullets(exp.description)
