# AI Rewrite Buttons - Complete Setup Guide

## ✅ **Status: Ready to Use**

The AI rewrite buttons are now configured to work with Supabase Edge Functions for secure API key management.

---

## 🔑 **Prerequisites**

### **1. OpenAI API Key in Supabase**

You MUST add your OpenAI API key to Supabase:

1. Go to https://platform.openai.com/api-keys
2. Create a new API key (starts with `sk-...`)
3. Go to Supabase Dashboard → **Settings** → **Edge Functions** → **Secrets**
4. Add secret:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI key
5. Click **Save**

### **2. Deploy Edge Function**

The Edge Function code is at: `supabase/functions/ai-generate/index.ts`

**Deploy it:**
1. Go to Supabase Dashboard → **Edge Functions**
2. Click **"Create a new function"** or edit existing `ai-generate`
3. Copy the code from `supabase/functions/ai-generate/index.ts`
4. Paste and click **Deploy**

---

## 🎯 **How AI Rewrite Works**

### **User Flow:**
```
User clicks "Rewrite with AI" button
    ↓
Check if user has credits
    ↓
If yes → Call Edge Function
    ↓
Edge Function uses OpenAI API (secure!)
    ↓
Return AI-generated text
    ↓
Update the field
    ↓
Deduct credits
```

### **Technical Flow:**
```typescript
// 1. User clicks button
onRewrite() {
  // 2. Check credits
  if (credits < 3) {
    showPaywall();
    return;
  }

  // 3. Call AI service
  const result = await callAIText(prompt);

  // 4. Update field
  setFieldValue(result);

  // 5. Deduct credits
  deductCredits(3);
}
```

---

## 📝 **AI Generation Rules**

The AI follows these rules when rewriting:

### **Professional Summary:**
- 3-4 sentences
- Highlights key skills and experience
- Professional tone
- Action-oriented

### **Experience Descriptions:**
- 3-5 bullet points per role
- Starts with action verbs
- Quantifies achievements when possible
- ATS-friendly keywords
- Diverse and human-like (not repetitive)

### **Skills:**
- Comma-separated list
- Relevant to job title
- Mix of technical and soft skills

### **Key Achievements:**
- 4-6 bullet points
- Quantified results
- Impactful accomplishments

---

## 🧪 **Testing the AI Buttons**

### **Test Checklist:**

1. **✅ Edge Function Deployed**
   - Go to Supabase → Edge Functions
   - See `ai-generate` listed
   - Status: Active

2. **✅ OpenAI Key Added**
   - Go to Supabase → Settings → Edge Functions → Secrets
   - See `OPENAI_API_KEY` listed

3. **✅ Test in App**
   - Go to Editor
   - Click any "Rewrite with AI" button
   - Should see loading state
   - Should get AI-generated content
   - Should deduct credits

---

## 🔍 **Troubleshooting**

### **"OpenAI API key not configured"**
- ✅ Add `OPENAI_API_KEY` to Supabase Secrets
- ✅ Redeploy the Edge Function

### **"Failed to call AI function"**
- ✅ Check Edge Function logs in Supabase
- ✅ Verify OpenAI API key is valid
- ✅ Check you have credits in OpenAI account

### **CORS errors**
- ✅ Edge Function includes CORS headers
- ✅ Make sure you're calling from `http://localhost:5173`

### **No response / timeout**
- ✅ Check OpenAI API status
- ✅ Try with a shorter prompt
- ✅ Check Edge Function logs

---

## 📊 **Credit Costs**

| Action | Credits |
|--------|---------|
| Full Rewrite | 3 |
| CV Regeneration | 5 |
| Resume Upload | 5 |
| Cover Letter | 3 |
| Bullet Optimization | 1 |
| Keyword Enhancement | 1 |

---

## 🎨 **Where AI Buttons Appear**

1. **Summary Section** - "Rewrite with AI"
2. **Experience Section** - "Rewrite with AI" (per role)
3. **Skills Section** - "Generate with AI"
4. **Key Achievements** - "Generate with AI"
5. **Cover Letter** - Full AI generation

---

## ✅ **Final Checklist**

- [ ] OpenAI API key added to Supabase Secrets
- [ ] Edge Function deployed
- [ ] Tested AI rewrite button
- [ ] Credits are being deducted
- [ ] AI-generated content appears

---

**Once all steps are complete, the AI rewrite buttons will work perfectly!** 🚀
