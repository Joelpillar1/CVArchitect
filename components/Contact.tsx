import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { Link } from 'react-router-dom';

interface ContactProps {
    onBack?: () => void;
}

export default function Contact({ onBack }: ContactProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong.');
            }

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Failed to send message. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Contact CV Architect — Customer Support & Help"
                description="Have questions about CV Architect? Contact our support team via email at support@cvarchitect.app or live chat. We typically respond within 24 hours."
                canonicalPath="/contact"
            />
            <PublicHeader />

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12 pt-32">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4" style={{ fontFamily: 'Graphik, sans-serif' }}>
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-500">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-dark mb-6">Contact Information</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0">
                                        <Mail className="text-brand-green" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-brand-dark mb-1">Email</h3>
                                        <p className="text-gray-600">support@cvarchitect.app</p>
                                        <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0">
                                        <MessageSquare className="text-brand-green" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-brand-dark mb-1">Live Chat</h3>
                                        <p className="text-gray-600">Available Monday - Friday</p>
                                        <p className="text-sm text-gray-500 mt-1">9:00 AM - 6:00 PM EST</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6">
                            <h3 className="font-bold text-brand-dark mb-3">Quick Links</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <Link to="/support" className="hover:text-brand-green transition-colors">Help Center &amp; FAQs</Link>
                                </li>
                                <li>
                                    <Link to="/pricing" className="hover:text-brand-green transition-colors">Pricing Plans</Link>
                                </li>
                                <li>
                                    <Link to="/blog/how-to-beat-ats-resume-2026" className="hover:text-brand-green transition-colors">ATS Optimization Guide</Link>
                                </li>
                                <li>
                                    <Link to="/refund-policy" className="hover:text-brand-green transition-colors">Refund Policy</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark mb-6">Send us a Message</h2>

                        {status === 'success' ? (
                            <div className="bg-brand-green/10 border border-brand-green rounded-xl p-8 text-center">
                                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-brand-dark" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-2">Message Sent!</h3>
                                <p className="text-gray-600 mb-4">
                                    Thank you for reaching out. We've sent a confirmation to your inbox and will reply within 24 hours.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-sm font-semibold text-brand-green hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {status === 'error' && (
                                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                        <p className="text-sm text-red-700">{errorMsg}</p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="bug">Report a Bug</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Tell us how we can help..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-brand-green hover:bg-green-600 text-brand-dark px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-slate-50 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-brand-dark mb-3">Need Immediate Help?</h3>
                    <p className="text-gray-600 mb-4">
                        Check out our comprehensive Help Center for instant answers to common questions about resume building, ATS optimization, and using CV Architect's features.
                    </p>
                    <Link
                        to="/support"
                        className="inline-block bg-brand-dark hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition-all"
                    >
                        Visit Help Center
                    </Link>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
