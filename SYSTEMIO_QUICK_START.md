# System.io Integration - Quick Start

## 🎯 Two Ways to Integrate

### Option A: Database Trigger (Recommended) ✅
**Automatic, works for all signup methods**

1. Deploy Edge Function: `supabase/functions/systemio-subscribe/index.ts`
2. Set secrets in Supabase: `SYSTEMIO_API_KEY` and `SYSTEMIO_LIST_ID`
3. Run SQL: `supabase/systemio_integration.sql`
4. Done! All new signups automatically added to System.io

**✅ Pros:** Automatic, works for email + Google OAuth, no code changes needed

---

### Option B: Frontend Integration (Simpler) 🚀
**Manual, requires code changes**

1. Deploy Edge Function: `supabase/functions/systemio-subscribe/index.ts`
2. Set secrets in Supabase: `SYSTEMIO_API_KEY` and `SYSTEMIO_LIST_ID`
3. Import service: `import { addNewSignupToSystemIo } from '../services/systemioService'`
4. Call after signup: `await addNewSignupToSystemIo(email, name, userId)`

**✅ Pros:** Simpler setup, easier to test
**⚠️ Cons:** Need to update code in multiple places

---

## 📋 Setup Checklist

### Both Options Require:
- [ ] System.io account
- [ ] System.io API key
- [ ] System.io List/Sequence ID
- [ ] Edge Function deployed
- [ ] Environment variables set

### Option A Also Requires:
- [ ] SQL script run
- [ ] Trigger verified

### Option B Also Requires:
- [ ] Service imported
- [ ] SignUp component updated
- [ ] AuthContext updated (for Google OAuth)

---

## 🔗 Files Created

1. **`supabase/functions/systemio-subscribe/index.ts`** - Edge Function
2. **`supabase/systemio_integration.sql`** - Database trigger update
3. **`services/systemioService.ts`** - Frontend service (for Option B)
4. **`SYSTEMIO_SETUP_GUIDE.md`** - Complete setup guide

---

## 📚 Next Steps

1. Read **`SYSTEMIO_SETUP_GUIDE.md`** for detailed instructions
2. Choose Option A (trigger) or Option B (frontend)
3. Follow the setup steps
4. Test with a new signup
5. Verify subscriber appears in System.io

---

## 🆘 Need Help?

See **`SYSTEMIO_SETUP_GUIDE.md`** for:
- Detailed step-by-step instructions
- Troubleshooting guide
- System.io API documentation links
