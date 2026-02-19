import React, { useEffect } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
<meta name="google-site-verification" content="tM8NcOMoT43REWAXI4sUDCX6usdXgja0epq5QCK1Ygc" />
interface PrivacyPolicyProps {
    onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <PublicHeader />

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12 pt-32">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4" style={{ fontFamily: 'Graphik, sans-serif' }}>
                    Privacy Policy
                </h1>
                <p className="text-gray-500 mb-12">Last updated: December 2, 2025</p>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            At CV Architect, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our resume building platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Information We Collect</h2>
                        <h3 className="text-xl font-semibold text-brand-dark mb-3">Personal Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you create a resume using CV Architect, we collect information you provide, including:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Name, email address, and contact information</li>
                            <li>Professional experience, education, and skills</li>
                            <li>Job descriptions you paste for AI optimization</li>
                            <li>Resume templates and customization preferences</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-brand-dark mb-3 mt-6">Usage Data</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We automatically collect certain information when you use our service, including your IP address, browser type, pages visited, and time spent on our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">How We Use Your Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Generate and optimize your resume using AI technology</li>
                            <li>Provide ATS compatibility analysis and keyword matching</li>
                            <li>Save your resume templates and allow you to export PDFs</li>
                            <li>Improve our service and develop new features</li>
                            <li>Send you important updates about your account and our service</li>
                            <li>Respond to your inquiries and provide customer support</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Data Storage and Security</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Your resume data is stored securely using industry-standard encryption. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">AI Processing</h2>
                        <p className="text-gray-700 leading-relaxed">
                            When you use our AI rewriting features, your resume content and job descriptions are processed by our AI service provider (Google Generative AI). This data is used solely to generate optimized content for your resume and is not used to train AI models or shared with third parties for marketing purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Your Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Access, update, or delete your personal information</li>
                            <li>Export your resume data at any time</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Request a copy of the data we hold about you</li>
                            <li>Withdraw consent for data processing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Data Retention</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We retain your resume data for as long as your account is active or as needed to provide you services. You can delete your resumes and account at any time through your account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Third-Party Services</h2>
                        <p className="text-gray-700 leading-relaxed">
                            CV Architect uses third-party services for AI processing and analytics. These services have their own privacy policies and we encourage you to review them. We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Cookies</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and remember your preferences. You can control cookie settings through your browser.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Changes to This Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about this Privacy Policy or our data practices, please contact us at:
                        </p>
                        <p className="text-brand-green font-semibold mt-4">
                            privacy@cvarchitect.app
                        </p>
                    </section>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
