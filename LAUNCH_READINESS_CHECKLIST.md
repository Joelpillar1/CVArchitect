# 🚀 Launch Readiness Checklist

## ✅ **CRITICAL - Must Complete Before Launch**

### 1. **Environment Variables**

**Vercel (frontend):**
- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `APP_URL` - Production app URL (e.g. `https://cvarchitect.app`)
- [ ] `VITE_OPENAI_API_KEY` (if using OpenAI directly)

**Supabase Edge Function secrets** (Dashboard → Edge Functions → Secrets):
- [ ] `DODO_PAYMENTS_API_KEY`
- [ ] `DODO_PAYMENTS_ENVIRONMENT` (`test_mode` or `live_mode`)
- [ ] `DODO_PAYMENTS_WEBHOOK_KEY`
- [ ] `DODO_SPRINT_PRODUCT_ID` — Sprint weekly $2.99
- [ ] `DODO_BUILD_PRODUCT_ID` — Build monthly $9.99
- [ ] `DODO_BLUEPRINT_PRODUCT_ID` — Blueprint quarterly $29
- [ ] `APP_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (for local/Vercel fallback only; auto-injected in Edge Functions)

See `.env.example` and `DODO_PAYMENTS_SETUP.md` for full list and aliases.

**Action:** Verify secrets in Supabase; verify Vercel env vars for frontend.

---

### 2. **Database Setup (Supabase)**
- [ ] Run `supabase/schema.sql` in Supabase SQL Editor
- [ ] Verify all tables exist:
  - [ ] `profiles`
  - [ ] `subscriptions`
  - [ ] `resumes`
  - [ ] `usage_logs`
  - [ ] `cover_letters`
  - [ ] `resume_versions`
  - [ ] `billing_history`
- [ ] Verify RLS (Row Level Security) policies are enabled
- [ ] Verify triggers are created (`handle_new_user`)
- [ ] Test user signup creates profile and subscription automatically

**Action:** Run SQL schema and verify in Supabase Dashboard

---

### 3. **Dodo Payments Integration**
- [ ] Three subscription products created in Dodo (Sprint, Build, Blueprint)
- [ ] Edge Functions deployed: `create-checkout-session`, `dodo-webhook`
- [ ] Webhook URL: `https://<project-ref>.supabase.co/functions/v1/dodo-webhook`
- [ ] Webhook secret matches `DODO_PAYMENTS_WEBHOOK_KEY`
- [ ] Product IDs match `DODO_SPRINT_PRODUCT_ID`, `DODO_BUILD_PRODUCT_ID`, `DODO_BLUEPRINT_PRODUCT_ID`
- [ ] Test checkout flow end-to-end (test payment in `test_mode`)
- [ ] Return URL: `/dashboard?payment=success&plan={planId}`

**Action:** Follow `DODO_PAYMENTS_SETUP.md`

---

### 4. **Authentication & Security**
- [ ] Supabase Auth configured:
  - [ ] Email auth enabled
  - [ ] Google OAuth configured (if using)
  - [ ] Site URL set to production domain
  - [ ] Redirect URLs configured
- [ ] Email verification settings configured (enable/disable as needed)
- [ ] Password reset flow tested
- [ ] Account deletion flow tested
- [ ] RLS policies prevent unauthorized access

**Action:** Test signup, login, password reset, and account deletion

---

### 5. **Core Features Testing**
- [ ] **Resume Creation:**
  - [ ] Upload resume from file
  - [ ] Start from scratch
  - [ ] Save resume to database
  - [ ] Load saved resume
  - [ ] Delete resume

- [ ] **Resume Editing:**
  - [ ] Edit all sections (Experience, Education, Skills, etc.)
  - [ ] Switch templates
  - [ ] Rearrange sections
  - [ ] Export to PDF

- [ ] **AI Features:**
  - [ ] AI rewrite (requires credits)
  - [ ] AI bullet point generation
  - [ ] AI achievements generation
  - [ ] Job matching
  - [ ] Cover letter generation
  - [ ] Credit deduction working correctly

- [ ] **Subscription Management:**
  - [ ] Foundation: 1 tailored resume, base template
  - [ ] Sprint: Unlimited access, $2.99/week
  - [ ] Build: Unlimited access, $9.99/month
  - [ ] Blueprint: Unlimited access, $29/quarter
  - [ ] Subscription activation after Dodo webhook
  - [ ] Dashboard polls after `?payment=success`

**Action:** Test all features end-to-end with real user accounts

---

### 6. **Error Handling & Edge Cases**
- [ ] Network errors handled gracefully
- [ ] Invalid form inputs show clear errors
- [ ] Duplicate email signup shows friendly message
- [ ] AbortError handled (component unmounting)
- [ ] Missing data doesn't crash app
- [ ] Payment failures handled
- [ ] Webhook failures logged

**Action:** Test error scenarios and verify user-friendly messages

---

### 7. **Performance & Optimization**
- [ ] Build size optimized (currently ~2MB - consider code splitting)
- [ ] Images optimized
- [ ] Lazy loading for templates
- [ ] Database queries optimized
- [ ] No memory leaks (check useEffect cleanup)

**Action:** Run production build and check bundle size

---

### 8. **Legal & Compliance**
- [ ] Terms of Service page accessible and linked
- [ ] Privacy Policy page accessible and linked
- [ ] Refund Policy (if applicable)
- [ ] Cookie consent (if required in your region)
- [ ] GDPR compliance (if serving EU users)

**Action:** Verify all legal pages are accessible and up-to-date

---

### 9. **Production Configuration**
- [ ] Vercel deployment successful
- [ ] Custom domain configured (cvarchitect.app)
- [ ] SSL certificate active
- [ ] Redirects configured (vercel.json)
- [ ] Environment variables set for production
- [ ] Build passes without errors

**Action:** Deploy to Vercel and verify production URL works

---

### 10. **Monitoring & Analytics**
- [ ] Error tracking set up (e.g., Sentry, LogRocket)
- [ ] Analytics configured (if using)
- [ ] Webhook logs monitored
- [ ] Database monitoring enabled
- [ ] Uptime monitoring (e.g., UptimeRobot)

**Action:** Set up monitoring tools for production

---

## ⚠️ **IMPORTANT - Should Complete Soon**

### 11. **Documentation**
- [ ] README.md updated with setup instructions
- [ ] API documentation (if applicable)
- [ ] Deployment guide updated
- [ ] Environment variables documented
- [ ] Troubleshooting guide

---

### 12. **User Experience**
- [ ] Loading states for all async operations
- [ ] Success/error toast notifications
- [ ] Mobile responsiveness tested
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility basics (keyboard navigation, screen readers)

---

### 13. **Testing**
- [ ] Manual testing of all user flows
- [ ] Test with different user roles (free, paid)
- [ ] Test payment flow with real/test cards
- [ ] Test webhook with real events
- [ ] Cross-browser testing

---

## 📋 **Pre-Launch Final Checks**

### **24 Hours Before Launch:**
1. [ ] Run full test suite
2. [ ] Check all environment variables
3. [ ] Verify database backups enabled
4. [ ] Test payment flow with real card (small amount)
5. [ ] Monitor error logs
6. [ ] Check webhook is receiving events
7. [ ] Verify email delivery (if using email features)

### **Launch Day:**
1. [ ] Final smoke test of critical paths
2. [ ] Monitor error rates
3. [ ] Watch webhook logs
4. [ ] Be ready to rollback if needed
5. [ ] Have support channels ready

---

## 🎯 **Current Status Assessment**

### ✅ **Ready:**
- Core resume editing functionality
- Template system
- AI features integration
- Payment integration (Dodo Payments + Supabase Edge Functions)
- Authentication system
- Database schema
- Error handling improvements

### ⚠️ **Needs Verification:**
- Webhook event processing (test with real payments)
- Environment variables in production
- Database triggers and RLS policies
- Email delivery (if using)
- Performance under load

### 📝 **Recommended Before Launch:**
- Set up error monitoring (Sentry, LogRocket)
- Add analytics (Google Analytics, Mixpanel)
- Create backup strategy
- Document runbook for common issues
- Set up staging environment for testing

---

## 🚨 **Critical Issues to Resolve:**

1. **Webhook Testing:** Test with real Dodo payment to ensure subscription activation works
2. **Environment Variables:** Verify all are set in Vercel
3. **Database:** Run schema.sql and verify all tables/policies exist
4. **Payment Flow:** End-to-end test of checkout → payment → webhook → subscription activation

---

## ✅ **Launch Decision:**

**Status:** 🟡 **ALMOST READY** - Need to verify critical items above

**Recommendation:** 
1. Complete all items in "CRITICAL" section
2. Test payment flow end-to-end
3. Verify webhook is working
4. Then you're ready to launch! 🚀

---

**Last Updated:** January 21, 2026
