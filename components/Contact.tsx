import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, MessageSquare, Send } from 'lucide-react';

interface ContactProps {
    onBack: () => void;
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
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send the form data to a backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-brand-dark hover:text-brand-green transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Home</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
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
                                        <p className="text-gray-600">support@cvarchitect.com</p>
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
                                    <a href="#" className="hover:text-brand-green transition-colors">Help Center & FAQs</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-brand-green transition-colors">Resume Templates</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-brand-green transition-colors">Pricing Plans</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-brand-green transition-colors">ATS Optimization Guide</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark mb-6">Send us a Message</h2>

                        {submitted ? (
                            <div className="bg-brand-green/10 border border-brand-green rounded-xl p-6 text-center">
                                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="text-brand-dark" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-2">Message Sent!</h3>
                                <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="w-full bg-brand-green hover:bg-green-600 text-brand-dark px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send size={20} />
                                    Send Message
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
                    <button className="bg-brand-dark hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition-all">
                        Visit Help Center
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-8 mt-16">
                <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
                    &copy; 2025 CV Architect. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
