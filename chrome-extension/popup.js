/**
 * CVArchitect Job Tailor - Popup (auto-capture on open, one main action)
 */

const APP_BASE_URL = 'https://cvarchitect.app';
const STORAGE_APP_URL = 'cvarchitect_app_url';

const el = (id) => document.getElementById(id);
const show = (id) => { el(id).hidden = false; };
const hide = (id) => { el(id).hidden = true; };

function showState(name) {
  ['state-loading', 'state-empty', 'state-success'].forEach((s) => hide(s));
  show('state-' + name);
}

function getStoredAppUrl() {
  return new Promise((resolve) => {
    chrome.storage?.local?.get?.([STORAGE_APP_URL], (data) => resolve(data?.[STORAGE_APP_URL] || APP_BASE_URL));
  });
}

async function buildTailorUrl(job) {
  const base = await getStoredAppUrl();
  const payload = {
    title: job.title || '',
    company: job.company || '',
    description: (job.description || '').trim()
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  return `${base}/dashboard/editor?job=${encodeURIComponent(encoded)}`;
}

function captureJobFromTab() {
  return new Promise(async (resolve) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        resolve(null);
        return;
      }
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const host = window.location.hostname.toLowerCase();
          const path = window.location.pathname.toLowerCase();
          function text(sel) {
            const e = document.querySelector(sel);
            return e ? e.textContent.trim() : '';
          }
          function desc(sel) {
            const e = document.querySelector(sel);
            return e ? (e.innerText || e.textContent || '').trim() : '';
          }
          if (host.includes('linkedin.com') && path.includes('/jobs/')) {
            return {
              title: text('.job-details-jobs-unified-top-card__job-title') || text('.t-24') || text('h1'),
              company: text('.job-details-jobs-unified-top-card__company-name') || text('.job-details-jobs-unified-top-card__primary-description-without-tagline a'),
              description: desc('.jobs-description__content') || desc('.job-details-jobs-unified-description__content') || desc('.jobs-box__html-content')
            };
          }
          if (host.includes('indeed.com')) {
            return {
              title: text('[data-testid="jobsearch-JobInfoHeader-title"]') || text('.jobsearch-JobInfoHeader-title') || text('h1'),
              company: text('[data-testid="inlineHeader-companyName"]') || text('.jobsearch-InlineCompanyRating-companyHeader a'),
              description: desc('#job-description-container') || desc('.jobsearch-jobDescriptionText') || desc('[data-testid="job-description"]')
            };
          }
          if (host.includes('lever.co')) {
            const title = text('.posting-headline h1') || text('.posting-title');
            const company = document.querySelector('.main-header-logo img')?.alt || text('.posting-custom-intro .posting-name') || '';
            const content = document.querySelector('.content');
            let description = '';
            if (content) content.querySelectorAll('.section-wrapper, p, ul').forEach((n) => { description += (n.textContent || '').trim() + '\n\n'; });
            return { title, company, description: description.trim() };
          }
          if (host.includes('greenhouse.io')) {
            const title = text('#content h1') || text('.app-title');
            const company = text('#content h2') || text('.company-name');
            const content = document.querySelector('#content .content, #content [id*="content"]');
            return { title, company, description: content ? (content.innerText || content.textContent || '').trim() : '' };
          }
          if (host.includes('workable.com')) {
            return {
              title: text('h1.job-title') || text('.job-headline h1') || text('h1'),
              company: text('.company-name') || text('.job-company') || '',
              description: desc('.job-description') || desc('.job-content') || ''
            };
          }
          if (host.includes('glassdoor.com')) {
            return {
              title: text('[data-test="job-title"]') || text('h1'),
              company: text('[data-test="employer-name"]') || '',
              description: desc('.JobDetails_jobDescription__CBU6_') || desc('.jobDescription') || desc('[data-test="job-description"]') || ''
            };
          }
          const h1 = text('h1');
          const descEl = document.querySelector('[class*="description"], [id*="description"], article, .content, main');
          const description = descEl ? (descEl.innerText || descEl.textContent || '').trim() : '';
          return {
            title: h1 || document.title.replace(/\s*[-|].*$/, '').trim(),
            company: text('[class*="company"], [class*="employer"]') || '',
            description: description.slice(0, 15000)
          };
        }
      });
      const job = results?.[0]?.result || null;
      if (job && ((job.description || '').trim().length > 20 || job.title)) {
        job.description = (job.description || '').trim();
        resolve(job);
      } else {
        resolve(null);
      }
    } catch (e) {
      resolve(null);
    }
  });
}

function renderSuccess(job) {
  el('job-title').textContent = job.title || 'Untitled role';
  el('job-company').textContent = job.company ? `at ${job.company}` : '';

  el('btn-open-app').onclick = async () => {
    const tailorUrl = await buildTailorUrl(job);
    window.open(tailorUrl, '_blank');
    window.close();
  };
  el('btn-copy').onclick = (e) => {
    e.preventDefault();
    const full = [job.title, job.company, job.description].filter(Boolean).join('\n\n');
    navigator.clipboard.writeText(full).then(() => {
      el('btn-copy').textContent = 'Copied!';
      setTimeout(() => { el('btn-copy').textContent = 'Copy description'; }, 2000);
    });
  };
  el('btn-retry').onclick = () => {
    showState('loading');
    runAutoCapture();
  };
}

async function runAutoCapture() {
  showState('loading');
  const job = await captureJobFromTab();
  if (job) {
    renderSuccess(job);
    showState('success');
  } else {
    showState('empty');
  }
}

async function init() {
  el('btn-use-paste').addEventListener('click', () => {
    const description = (el('paste-area').value || '').trim();
    const title = (el('manual-title').value || '').trim();
    const company = (el('manual-company').value || '').trim();
    if (description.length < 20) return;
    const job = { title, company, description };
    renderSuccess(job);
    showState('success');
  });

  runAutoCapture();
}

init();
