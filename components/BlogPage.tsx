import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, Tag, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { blogPosts, getAllCategories } from '../utils/blogData';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function BlogPage() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const categories = ['All', ...getAllCategories()];

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const featuredPost = blogPosts.find(post => post.featured);
    const regularPosts = filteredPosts.filter(post => post !== featuredPost || activeCategory !== 'All' || searchQuery !== '');

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <SEO
                title="CV Architect Blog — Resume Tips, ATS Guides & Career Advice"
                description="Expert resume writing tips, ATS optimization guides, and career advice to help you land more interviews. Resources from CV Architect's team of hiring experts."
                canonicalPath="/blog"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "Blog",
                    "name": "CV Architect Blog",
                    "description": "Expert resume writing tips, ATS optimization guides, and career advice.",
                    "url": "https://cvarchitect.app/blog",
                    "publisher": {
                        "@type": "Organization",
                        "name": "CV Architect",
                        "url": "https://cvarchitect.app"
                    }
                }}
            />
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        <span className="inline-block bg-brand-green/20 text-brand-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                            Career Resources
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark mb-4 leading-tight" style={{ fontFamily: 'Graphik, sans-serif' }}>
                            The CV Architect Blog
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Expert resume tips, ATS optimization strategies, and career advice to help you land your dream job faster.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none text-gray-700 bg-white shadow-sm"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Category Filters */}
            <section className="px-6 py-4 border-b border-gray-100 sticky top-20 bg-white/90 backdrop-blur-md z-40">
                <div className="max-w-5xl mx-auto flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
                                ? 'bg-brand-dark text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Post */}
            {activeCategory === 'All' && searchQuery === '' && featuredPost && (
                <section className="px-6 py-12">
                    <div className="max-w-5xl mx-auto">
                        <motion.article
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                            className="group cursor-pointer bg-gradient-to-br from-slate-50 to-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="grid md:grid-cols-2 gap-0">
                                <div className="relative overflow-hidden bg-brand-dark/5">
                                    <img
                                        src={featuredPost.coverImage}
                                        alt={featuredPost.title}
                                        className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-brand-green text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                            Featured
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 md:p-10 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                        <span className="bg-brand-dark/5 px-3 py-1 rounded-full font-medium">
                                            {featuredPost.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {featuredPost.readTime}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 group-hover:text-brand-green/80 transition-colors leading-tight">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">
                                            {formatDate(featuredPost.publishDate)}
                                        </span>
                                        <span className="flex items-center gap-2 text-brand-dark font-semibold group-hover:gap-3 transition-all">
                                            Read Article <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    </div>
                </section>
            )}

            {/* Blog Post Grid */}
            <section className="px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">No articles found matching your search.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                className="mt-4 text-brand-green font-semibold hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {(activeCategory === 'All' && searchQuery === ''
                                ? regularPosts
                                : filteredPosts
                            ).map((post) => (
                                <motion.article
                                    key={post.slug}
                                    variants={fadeUp}
                                    onClick={() => navigate(`/blog/${post.slug}`)}
                                    className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            loading="lazy"
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                            <span className="bg-brand-dark/5 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                {post.category}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs">
                                                <Clock size={12} />
                                                {post.readTime}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-brand-dark mb-2 group-hover:text-brand-green/80 transition-colors leading-snug line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <span className="text-xs text-gray-400">
                                                {formatDate(post.publishDate)}
                                            </span>
                                            <span className="flex items-center gap-1 text-sm text-brand-dark font-medium group-hover:gap-2 transition-all">
                                                Read <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-16 bg-gradient-to-br from-brand-dark to-slate-800">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Build Your ATS-Proof Resume?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8">
                        Stop reading about it. Start doing it. Create your optimized resume in under 15 minutes.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-brand-green text-brand-dark px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
                    >
                        Build Your Resume
                    </button>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
