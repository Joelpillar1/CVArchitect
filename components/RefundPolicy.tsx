import React, { useEffect } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';

interface RefundPolicyProps {
    onBack: () => void;
}

export default function RefundPolicy({ onBack }: RefundPolicyProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Refund Policy — CV Architect | 14-Day Money-Back Guarantee"
                description="CV Architect offers a 14-day money-back guarantee for first-time subscribers. Learn about our refund process, eligibility, and how to request a refund."
                canonicalPath="/refund-policy"
            />
            <PublicHeader />

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12 pt-32">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4" style={{ fontFamily: 'Graphik, sans-serif' }}>
                    Refund Policy
                </h1>
                <p className="text-gray-500 mb-12">Last updated: December 13, 2025</p>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Our Commitment to You</h2>
                        <p className="text-gray-700 leading-relaxed">
                            At CV Architect, we're confident in the quality of our AI-powered resume building platform. We want you to be completely satisfied with your purchase. This Refund Policy outlines the terms and conditions for requesting a refund for our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">14-Day Money-Back Guarantee</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We offer a 14-day money-back guarantee for first-time subscribers who are not satisfied with CV Architect. This applies to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Week Pass subscriptions</li>
                            <li>Pro Quarterly subscriptions (first billing cycle only)</li>
                            <li>Lifetime access purchases</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            To qualify for a refund, you must request it within 14 days of your initial purchase date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Eligibility Criteria</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            To be eligible for a refund, the following conditions must be met:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>The refund request is made within 14 days of the original purchase</li>
                            <li>This is your first subscription to CV Architect (new customers only)</li>
                            <li>You have not previously received a refund from CV Architect</li>
                            <li>The account has not been used to violate our Terms of Service</li>
                            <li>You provide a valid reason for the refund request</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Non-Refundable Items</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            The following are not eligible for refunds:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Guest account usage (no payment made)</li>
                            <li>Subscription renewals after the first billing cycle</li>
                            <li>Partial refunds for unused portions of a subscription period</li>
                            <li>AI credits that have been consumed</li>
                            <li>Refund requests made after the 14-day window</li>
                            <li>Second or subsequent subscriptions from the same user</li>
                            <li>Accounts suspended or terminated for Terms of Service violations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">How to Request a Refund</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            To request a refund, please follow these steps:
                        </p>
                        <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
                            <li className="leading-relaxed">
                                <strong>Contact our support team</strong> at <span className="text-brand-green font-semibold">refunds@cvarchitect.app</span> within 14 days of your purchase
                            </li>
                            <li className="leading-relaxed">
                                <strong>Include the following information:</strong>
                                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                    <li>Your account email address</li>
                                    <li>Order/transaction ID or receipt</li>
                                    <li>Date of purchase</li>
                                    <li>Reason for refund request</li>
                                    <li>Brief description of any issues encountered</li>
                                </ul>
                            </li>
                            <li className="leading-relaxed">
                                <strong>Wait for confirmation</strong> - Our team will review your request within 2-3 business days
                            </li>
                            <li className="leading-relaxed">
                                <strong>Receive your refund</strong> - If approved, refunds are processed within 5-10 business days to your original payment method
                            </li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Refund Processing Time</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Once your refund request is approved:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Refunds are processed within 5-10 business days</li>
                            <li>The refund will be credited to your original payment method</li>
                            <li>Depending on your bank or card issuer, it may take an additional 3-5 business days for the funds to appear in your account</li>
                            <li>You will receive an email confirmation once the refund has been processed</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Subscription Cancellation vs. Refund</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            It's important to understand the difference:
                        </p>
                        <div className="bg-slate-50 rounded-lg p-6 mb-4">
                            <h3 className="text-lg font-bold text-brand-dark mb-2">Cancellation</h3>
                            <p className="text-gray-700 leading-relaxed">
                                You can cancel your subscription at any time through your account settings. Upon cancellation, you will retain access to CV Architect until the end of your current billing period. No refund is provided for the remaining time in your current billing cycle.
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-brand-dark mb-2">Refund</h3>
                            <p className="text-gray-700 leading-relaxed">
                                A refund returns your payment and immediately terminates your access to CV Architect's premium features. Refunds are only available within the 14-day money-back guarantee period for eligible purchases.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Special Circumstances</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We understand that exceptional situations may arise. If you have a unique circumstance not covered by this policy, please contact our support team. We will review your case individually and may offer:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Account credit for future use</li>
                            <li>Extended trial period</li>
                            <li>Plan downgrade or upgrade options</li>
                            <li>Technical support to resolve issues</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Technical Issues</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you're experiencing technical difficulties with CV Architect, we encourage you to contact our support team before requesting a refund. Many issues can be resolved quickly, and we're committed to ensuring you have a smooth experience. Technical issues that prevent you from using the service may qualify for refunds outside the standard policy at our discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Fraudulent or Abusive Refund Requests</h2>
                        <p className="text-gray-700 leading-relaxed">
                            CV Architect reserves the right to deny refund requests that appear fraudulent or abusive. This includes but is not limited to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                            <li>Multiple refund requests from the same user using different accounts</li>
                            <li>Excessive use of AI credits before requesting a refund</li>
                            <li>Downloading all resume templates and exports before requesting a refund</li>
                            <li>Providing false information in the refund request</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Accounts found to be abusing the refund policy may be permanently banned from using CV Architect.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Changes to This Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of CV Architect after changes are posted constitutes acceptance of the updated policy. Refund requests will be evaluated based on the policy in effect at the time of purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about our Refund Policy or need assistance with a refund request, please contact us:
                        </p>
                        <div className="bg-brand-green/10 rounded-lg p-6 mt-4">
                            <p className="text-gray-700 mb-2">
                                <strong>Email:</strong> <span className="text-brand-green font-semibold">refunds@cvarchitect.app</span>
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Support:</strong> <span className="text-brand-green font-semibold">support@cvarchitect.app</span>
                            </p>
                            <p className="text-gray-500 text-sm mt-4">
                                We typically respond to refund requests within 2-3 business days.
                            </p>
                        </div>
                    </section>

                    <section className="bg-slate-50 rounded-lg p-6 mt-8">
                        <h3 className="text-xl font-bold text-brand-dark mb-3">Need Help Instead?</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Before requesting a refund, consider reaching out to our support team. We're here to help with:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Technical troubleshooting and bug fixes</li>
                            <li>Guidance on using AI features effectively</li>
                            <li>Resume optimization tips and best practices</li>
                            <li>Template customization assistance</li>
                            <li>Account and billing questions</li>
                        </ul>
                    </section>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
