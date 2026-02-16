/**
 * Right-click "Tailor this job with CVArchitect" - capture and open in one click.
 */
const APP_BASE_URL = 'https://cvarchitect.app';
const STORAGE_APP_URL = 'cvarchitect_app_url';

function extractJobFromPage() {
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
  const description = descEl ? (descEl.innerText || descEl.textContent || '').trim().slice(0, 15000) : '';
  return {
    title: h1 || document.title.replace(/\s*[-|].*$/, '').trim(),
    company: text('[class*="company"], [class*="employer"]') || '',
    description
  };
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'tailor-job',
    title: 'Tailor this job with CVArchitect',
    contexts: ['page']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'tailor-job' || !tab?.id) return;
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractJobFromPage
    });
    const job = results?.[0]?.result;
    const description = (job?.description || '').trim();
    if (!description || description.length < 20) {
      const appUrl = (await chrome.storage.local.get([STORAGE_APP_URL]))[STORAGE_APP_URL] || APP_BASE_URL;
      chrome.tabs.create({ url: appUrl + '/dashboard/editor' });
      return;
    }
    const payload = { title: job.title || '', company: job.company || '', description };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const base = (await chrome.storage.local.get([STORAGE_APP_URL]))[STORAGE_APP_URL] || APP_BASE_URL;
    const url = `${base}/dashboard/editor?job=${encodeURIComponent(encoded)}`;
    chrome.tabs.create({ url });
  } catch (e) {
    const base = (await chrome.storage.local.get([STORAGE_APP_URL]))[STORAGE_APP_URL] || APP_BASE_URL;
    chrome.tabs.create({ url: base + '/dashboard/editor' });
  }
});
