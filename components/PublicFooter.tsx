import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicFooter() {
    const currentYear = new Date().getFullYear();

    const footerColumns = [
        {
            title: 'AI Resume',
            links: [
                { label: 'AI Resume Builder', href: '/signup' },
                { label: 'ATS Resume Checker', href: '/blog/how-to-beat-ats-resume-2026' },
                { label: 'Resume Keyword Scanner', href: '/blog/resume-keywords-that-get-you-hired' },
                { label: 'Resume Summary Generator', href: '/signup' },
                { label: 'Cover Letter Writer', href: '/blog/cover-letter-guide-2026' },
            ],
        },
        {
            title: 'Resume Guides',
            links: [
                { label: 'How to Write a Resume', href: '/blog/how-to-write-resume-step-by-step' },
                { label: 'Best Resume Format', href: '/blog/best-resume-format-2026' },
                { label: 'Resume Keywords Guide', href: '/blog/resume-keywords-that-get-you-hired' },
                { label: 'Resume Mistakes to Avoid', href: '/blog/resume-mistakes-to-avoid' },
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
