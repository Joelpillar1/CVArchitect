/**
 * CVArchitect Job Tailor - Content script
 * Extracts job title, company, and description from job board pages.
 */

(function () {
  const SCRIPT_ID = 'cvarchitect-job-tailor-script';

  function getLinkedInJob() {
    // LinkedIn job details panel (new design)
    const titleEl = document.querySelector('.job-details-jobs-unified-top-card__job-title, .t-24.job-details-jobs-unified-top-card__job-title, [data-tracking-control-name="job-details_job-details-top-card_job-title"]');
    const companyEl = document.querySelector('.job-details-jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__primary-description-without-tagline a, [data-tracking-control-name="job-details_job-details-top-card_company-link"]');
    const descEl = document.querySelector('.jobs-description__content, .job-details-jobs-unified-description__content, .jobs-box__html-content');
    const title = titleEl?.textContent?.trim() || '';
    const company = companyEl?.textContent?.trim() || '';
    const description = descEl?.innerText?.trim() || descEl?.textContent?.trim() || '';
    return { title, company, description };
  }

  function getIndeedJob() {
    const titleEl = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"], .jobsearch-JobInfoHeader-title, h1.jobsearch-JobInfoHeader-title');
    const companyEl = document.querySelector('[data-testid="inlineHeader-companyName"], .jobsearch-InlineCompanyRating-companyHeader a, .jobsearch-JobInfoHeader-subtitle a');
    const descEl = document.querySelector('#job-description-container, .jobsearch-jobDescriptionText, [data-testid="job-description"], .jobDescription');
    const title = titleEl?.textContent?.trim() || '';
    const company = companyEl?.textContent?.trim() || '';
    const description = descEl?.innerText?.trim() || descEl?.textContent?.trim() || '';
    return { title, company, description };
  }

  function getLeverJob() {
    const titleEl = document.querySelector('.posting-headline h1, .posting-title');
    const companyEl = document.querySelector('.main-header-logo img[alt], .posting-custom-intro .posting-name, .main-header-logo');
    const descEl = document.querySelector('.content .section-wrapper, .posting-page .content');
    const title = titleEl?.textContent?.trim() || '';
    const company = companyEl?.alt || companyEl?.textContent?.trim() || document.querySelector('.main-header-logo')?.getAttribute('alt') || '';
    let description = '';
    if (descEl) {
      const parts = [];
      descEl.querySelectorAll('.section-wrapper, p, ul, h2').forEach(el => parts.push(el.textContent?.trim() || ''));
      description = parts.filter(Boolean).join('\n\n');
    }
    return { title, company, description };
  }

  function getGreenhouseJob() {
    const titleEl = document.querySelector('#content h1, .app-title');
    const companyEl = document.querySelector('#content h2, .company-name');
    const descEl = document.querySelector('#content .content, #content [id*="content"], .content-section');
    const title = titleEl?.textContent?.trim() || '';
    const company = companyEl?.textContent?.trim() || '';
    const description = descEl?.innerText?.trim() || descEl?.textContent?.trim() || '';
    return { title, company, description };
  }

  function getWorkableJob() {
    const titleEl = document.querySelector('h1.job-title, .job-headline h1, h1[class*="title"]');
    const companyEl = document.querySelector('.company-name, .job-company, [class*="company"]');
    const descEl = document.querySelector('.job-description, .job-content, [class*="description"]');
    const title = titleEl?.textContent?.trim() || '';
    const company = companyEl?.textContent?.trim() || '';
    const description = descEl?.innerText?.trim() || descEl?.textContent?.trim() || '';
    return { title, company, description };
  }

  function getGlassdoorJob() {
    const titleEl = document.querySelector('[data-test="job-title"], .JobDetails_jobTitle__MDpzo, h1');
    const companyEl = document.querySelector('[data-test="employer-name"], .JobDetails_employerName__Xwy2M, .EmployerProfile_employerName');
    const descEl = document.querySelector('.JobDetails_jobDescription__CBU6_, .jobDescription, [data-test="job-description"]');
    const title = titleEl?.textContent?.trim() || '';
    const company = companyEl?.textContent?.trim() || '';
    const description = descEl?.innerText?.trim() || descEl?.textContent?.trim() || '';
    return { title, company, description };
  }

  function getGenericJob() {
    const titleEl = document.querySelector('h1');
    const descSelectors = [
      '[class*="description"]',
      '[class*="Description"]',
      '[id*="description"]',
      'article',
      '.content',
      '.job-content',
      '.body',
      'main'
    ];
    let description = '';
    for (const sel of descSelectors) {
      const el = document.querySelector(sel);
      if (el && (el.innerText?.length || 0) > 100) {
        description = el.innerText?.trim() || el.textContent?.trim() || '';
        break;
      }
    }
    const title = titleEl?.textContent?.trim() || document.title?.replace(/\s*[-|]\s*(Indeed|LinkedIn|Glassdoor|Careers).*$/i, '').trim() || '';
    const company = document.querySelector('[class*="company"], [class*="employer"]')?.textContent?.trim() || '';
    return { title, company, description };
  }

  function extractJob() {
    const host = window.location.hostname.toLowerCase();
    const path = window.location.pathname.toLowerCase();

    if (host.includes('linkedin.com') && path.includes('/jobs/')) return getLinkedInJob();
    if (host.includes('indeed.com')) return getIndeedJob();
    if (host.includes('lever.co')) return getLeverJob();
    if (host.includes('greenhouse.io')) return getGreenhouseJob();
    if (host.includes('workable.com')) return getWorkableJob();
    if (host.includes('glassdoor.com')) return getGlassdoorJob();

    return getGenericJob();
  }

  function sendJobToPopup() {
    const job = extractJob();
    window.dispatchEvent(new CustomEvent('cvarchitect-job-data', { detail: job }));
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendJobToPopup);
  } else {
    sendJobToPopup();
  }

  // Re-run on SPA navigation (LinkedIn, Indeed often change content without full reload)
  const observer = new MutationObserver(() => {
    sendJobToPopup();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
