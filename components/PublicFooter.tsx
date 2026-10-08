import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicFooter() {
    const currentYear = new Date().getFullYear();

    const askAiLinks = [
        {
            name: 'ChatGPT',
            url: 'https://chatgpt.com/?q=What+is+CVArchitect%3F',
            icon: (
                <svg className="w-4 h-4 text-[#10A37F]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.307 13.565l2.443-1.412 2.443 1.412v2.825l-2.443 1.412-2.443-1.412zm3.693-4.57a4.464 4.464 0 0 1 2.857 1.026l-.142.081-4.779 2.758a.795.795 0 0 0-.392.681v6.737l-2.02-1.168a.071.071 0 0 1-.038-.052v-5.583a4.504 4.504 0 0 1 4.494-4.494z"/>
                </svg>
            )
        },
        {
            name: 'Claude',
            url: 'https://claude.ai/new?q=What+is+CVArchitect%3F',
            icon: (
                <svg className="w-4 h-4 text-[#D97757]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.827 2.058c.414 0 .762.3.828.708l.94 5.766a.834.834 0 0 0 .69.692l5.766.94c.408.066.708.414.708.828 0 .414-.3.762-.708.828l-5.766.94a.834.834 0 0 0-.69.692l-.94 5.766c-.066.408-.414.708-.828.708-.414 0-.762-.3-.828-.708l-.94-5.766a.834.834 0 0 0-.692-.692l-5.766-.94c-.408-.066-.708-.414-.708-.828 0-.414.3-.762.708-.828l5.766-.94a.834.834 0 0 0 .692-.692l.94-5.766c.066-.408.414-.708.828-.708z"/>
                </svg>
            )
        },
        {
            name: 'Perplexity',
            url: 'https://www.perplexity.ai/search?q=What+is+CVArchitect%3F',
            icon: (
                <svg className="w-4 h-4 text-[#20808D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    <path d="M7 5l10 14M17 5L7 19" />
                </svg>
            )
        },
        {
            name: 'Grok',
            url: 'https://grok.com/?q=What+is+CVArchitect%3F',
            icon: (
                <svg className="w-4 h-4 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18.36 5.64A9 9 0 1 1 5.64 18.36" />
                    <path d="M6 6l12 12" />
                </svg>
            )
        },
    ];

    const agentDocs = [
        { label: 'llms.txt', href: '/llms.txt' },
        { label: 'llms-full.txt', href: '/llms-full.txt' },
        { label: 'ai.txt', href: '/ai.txt' },
        { label: 'ai-plugin.json', href: '/.well-known/ai-plugin.json' },
        { label: 'sitemap.xml', href: '/sitemap.xml' },
        { label: 'robots.txt', href: '/robots.txt' },
    ];

    const footerColumns = [
        {
            title: 'AI Resume',
            links: [
                { label: 'AI Resume Builder', href: '/signup' },
                { label: 'Resume Match Checker', href: '/resume-checker' },
                { label: 'ATS Resume Checker', href: '/blog/how-to-beat-ats-resume-2026' },
                { label: 'Action Words for Resume', href: '/action-words' },
                { label: 'Cover Letter Writer', href: '/blog/cover-letter-guide-2026' },
            ],
        },
        {
            title: 'Resume Guides',
            links: [
                { label: 'How to Write a Resume', href: '/blog/how-to-write-resume-step-by-step' },
                { label: 'Best Resume Format', href: '/blog/best-resume-format-2026' },
                { label: 'Resume Keywords Guide', href: '/blog/resume-keywords-that-get-you-hired' },
                { label: 'Action Verbs for Resume', href: '/action-words' },
                { label: 'Cover Letter Guide', href: '/blog/cover-letter-guide-2026' },
            ],
        },
        {
            title: 'Templates & Examples',
            links: [
                { label: 'Resume Templates', href: '/blog/best-resume-templates-2026' },
                { label: 'Resume Examples by Industry', href: '/blog/resume-examples-by-industry-2026' },
                { label: 'Student Resume Guide', href: '/blog/student-resume-no-experience-guide' },
                { label: 'Resume Builders', href: '/blog/ai-resume-builder-vs-traditional' },
                { label: 'AI vs Traditional Resume', href: '/blog/ai-resume-builder-vs-traditional' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { label: 'Pricing', href: '/pricing' },
                { label: 'Career Blog', href: '/blog' },
                { label: 'Support Center', href: '/support' },
                { label: 'Contact Support', href: '/contact' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Refund Policy', href: '/refund-policy' },
                { label: 'Contact Us', href: '/contact' },
            ],
        },
    ];

    return (
        <footer className="public-footer" role="contentinfo">
            {/* Ask AI & Agent Index Banner */}
            <div className="border-b border-brand-border bg-white">
                <div className="max-w-[1200px] mx-auto px-6 py-6 sm:py-7 space-y-4">
                    {/* Top Row: Ask AI */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-6">
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand-dark/75 shrink-0">
                            ASK AI ABOUT CVARCHITECT
                        </span>
                        <div className="flex flex-wrap items-center gap-2.5">
                            {askAiLinks.map((ai) => (
                                <a
                                    key={ai.name}
                                    href={ai.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-bg/60 px-4 py-1.5 text-xs font-semibold text-brand-dark shadow-2xs hover:bg-brand-secondary hover:border-brand-border hover:shadow-xs transition-all duration-150 cursor-pointer"
                                >
                                    {ai.icon}
                                    <span>{ai.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Hairline Divider */}
                    <div className="h-px w-full bg-brand-border" />

                    {/* Bottom Row: For Agents */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2.5 sm:gap-4 font-mono text-xs">
                        <span className="font-bold uppercase tracking-[0.16em] text-brand-dark/75 shrink-0">
                            FOR AGENTS
                        </span>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-brand-dark/65">
                            {agentDocs.map((doc, idx) => (
                                <React.Fragment key={doc.label}>
                                    <a
                                        href={doc.href}
                                        target={doc.href.startsWith('http') || doc.href.endsWith('.txt') || doc.href.endsWith('.json') ? '_blank' : undefined}
                                        rel="noopener noreferrer"
                                        className="text-brand-dark/65 hover:text-brand-dark hover:underline transition-colors"
                                    >
                                        {doc.label}
                                    </a>
                                    {idx < agentDocs.length - 1 && (
                                        <span className="text-brand-dark/25 select-none">·</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main footer content */}
            <div className="public-footer__inner">
                {/* Column grid */}
                <nav className="public-footer__columns" aria-label="Footer navigation">
                    {footerColumns.map((column) => (
                        <div key={column.title} className="public-footer__column">
                            <h3 className="public-footer__column-title">{column.title}</h3>
                            <ul className="public-footer__link-list">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.href} className="public-footer__link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Bottom bar */}
            <div className="public-footer__bottom">
                <div className="public-footer__bottom-inner">
                    <Link to="/" className="public-footer__brand" aria-label="CV Architect Home">
                        <img
                            src="/images/logo icon.png"
                            alt=""
                            className="public-footer__logo"
                            width="28"
                            height="28"
                        />
                        <span className="public-footer__brand-name">CV Architect</span>
                    </Link>
                    <p className="public-footer__copyright">
                        © {currentYear} CV Architect. All rights reserved.
                    </p>
                    <div className="public-footer__social" aria-label="Social media links">
                        {/* Twitter / X */}
                        <a
                            href="https://x.com/cvarchitectapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="public-footer__social-link"
                            aria-label="Follow us on X (Twitter)"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/company/cvarchitectapp/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="public-footer__social-link"
                            aria-label="Follow us on LinkedIn"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
