import React, { useEffect } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

interface TermsOfServiceProps {
    onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <PublicHeader />

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12 pt-32">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4" style={{ fontFamily: 'Graphik, sans-serif' }}>
                    Terms of Service
                </h1>
                <p className="text-gray-500 mb-12">Last updated: December 2, 2025</p>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Agreement to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            By accessing and using CV Architect, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Service Description</h2>
                        <p className="text-gray-700 leading-relaxed">
                            CV Architect is an AI-powered resume building platform that helps users create ATS-optimized resumes. Our service includes:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                            <li>Professional resume templates designed for ATS compatibility</li>
                            <li>AI-powered content optimization and rewriting</li>
                            <li>Job description matching and keyword analysis</li>
                            <li>PDF export functionality</li>
                            <li>Resume storage and version management</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">User Accounts</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            To use CV Architect, you may need to create an account. You are responsible for:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized use</li>
                            <li>Providing accurate and complete information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Acceptable Use</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Use the service for any illegal or unauthorized purpose</li>
                            <li>Violate any laws in your jurisdiction</li>
                            <li>Infringe upon the rights of others</li>
                            <li>Transmit any malicious code or viruses</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Use the service to create false or misleading resumes</li>
                            <li>Resell or redistribute our service without permission</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed">
                            You retain all rights to the content you create using CV Architect. However, CV Architect and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Our resume templates are provided for your personal use. You may not redistribute, resell, or claim ownership of our template designs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">AI-Generated Content</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our AI features are designed to assist you in creating professional resume content. However:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                            <li>You are responsible for reviewing and verifying all AI-generated content</li>
                            <li>We do not guarantee the accuracy or suitability of AI suggestions</li>
                            <li>You should ensure all information in your resume is truthful and accurate</li>
                            <li>AI-generated content should be used as a starting point, not a final product</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Subscription and Payments</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            CV Architect offers various subscription plans:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Monthly subscriptions renew automatically unless canceled</li>
                            <li>Yearly subscriptions provide discounted rates</li>
                            <li>Lifetime access is a one-time payment</li>
                            <li>All payments are processed securely through our payment provider</li>
                            <li>Refunds may be available within 14 days of purchase (see Refund Policy)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Cancellation and Refunds</h2>
                        <p className="text-gray-700 leading-relaxed">
                            You may cancel your subscription at any time through your account settings. Upon cancellation, you will retain access until the end of your current billing period. We offer a 14-day money-back guarantee for first-time subscribers who are not satisfied with our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Service Availability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            While we strive to provide uninterrupted service, we do not guarantee that CV Architect will be available at all times. We may experience downtime for maintenance, updates, or unforeseen technical issues. We are not liable for any losses resulting from service interruptions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            CV Architect is provided "as is" without warranties of any kind. We are not responsible for:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                            <li>The outcome of your job applications</li>
                            <li>ATS systems' interpretation of your resume</li>
                            <li>Hiring decisions made by employers</li>
                            <li>Any indirect, incidental, or consequential damages</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Data and Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Your use of CV Architect is also governed by our Privacy Policy. We take data security seriously and implement industry-standard measures to protect your information. Please review our Privacy Policy to understand how we collect, use, and protect your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Termination</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to terminate or suspend your account and access to CV Architect immediately, without prior notice, for any reason, including but not limited to breach of these Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Changes to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service. Your continued use of CV Architect after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Governing Law</h2>
                        <p className="text-gray-700 leading-relaxed">
                            These Terms of Service are governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <p className="text-brand-green font-semibold mt-4">
                            legal@cvarchitect.com
                        </p>
                    </section>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
