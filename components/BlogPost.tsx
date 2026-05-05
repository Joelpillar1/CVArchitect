import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight, User, Calendar, Tag, Maximize2, Check, Copy, Sparkles, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostBySlug, blogPosts, BlogSection } from '../utils/blogData';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import ResumePreview from './ResumePreview';
import { TemplateType } from '../types';
import { SAMPLE_RESUME_DATA, STUDENT_RESUME_DATA } from '../utils/sampleResumeData';
import { JUNIOR_ACCOUNTANT_RESUME_DATA } from '../utils/juniorAccountantData';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function renderText(text: string) {
    if (!text) return null;
    
    // Patterns based on LandingPage.tsx for consistency
    const greenPattern = /\d+(?:,\d{3})*(?:\.\d+)?%|\d+(?:,\d{3})*(?:\.\d+)?\s*(?:leads|impressions|visitors|views|reduction|growth|increase|decrease)/gi;
    const darkPattern = /\$?\d+(?:,\d{3})*(?:\.\d+)?(?!\s%(?:leads|impressions|visitors|views))|\d+\+?\s*(?:tasks|engineers|features|articles|months|years|units|users|participants|requests|endpoints|modules)/gi;
    
    // Bold and Link patterns
    const boldPatternSource = '\\*\\*.*?\\*\\*';
    const linkPatternSource = '\\[.*?\\]\\(.*?\\)';

    // Combined split regex
    const combinedRegex = new RegExp(`(${boldPatternSource}|${linkPatternSource}|${greenPattern.source}|${darkPattern.source})`, 'gi');
    
    const parts = text.split(combinedRegex);
    
    return parts.map((part, i) => {
        if (!part) return null;

        // Bold
        if (part.startsWith('**') && part.endsWith('**')) {
            const inner = part.slice(2, -2);
            // Check if inner itself matches a metric pattern for nested-like behavior
            if (new RegExp(`^${greenPattern.source}$`, 'i').test(inner)) {
                return <strong key={i} className="text-brand-green font-extrabold">{inner}</strong>;
            }
            if (new RegExp(`^${darkPattern.source}$`, 'i').test(inner)) {
                return <strong key={i} className="text-brand-dark font-extrabold">{inner}</strong>;
            }
            return <strong key={i} className="font-bold text-brand-dark">{inner}</strong>;
        }

        // Link
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
            const [_, linkText, url] = linkMatch;
            const isExternal = url.startsWith('http');
            return (
                <a 
                    key={i} 
                    href={url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-brand-green font-semibold hover:underline decoration-2 underline-offset-4"
                >
                    {linkText}
                </a>
            );
        }

        // Standalone Metrics
        if (new RegExp(`^${greenPattern.source}$`, 'i').test(part)) {
            return <span key={i} className="text-brand-green font-extrabold">{part}</span>;
        }
        if (new RegExp(`^${darkPattern.source}$`, 'i').test(part)) {
            return <span key={i} className="text-brand-dark font-extrabold">{part}</span>;
        }

        return part;
    });
}

function renderSection(section: BlogSection, index: number) {
    switch (section.type) {
        case 'heading':
            return (
                <h2 key={index} className="text-2xl md:text-3xl font-bold text-brand-dark mt-10 mb-4 leading-tight">
                    {renderText(section.content || '')}
                </h2>
            );
        case 'subheading':
            return (
                <h3 key={index} className="text-xl font-semibold text-brand-dark mt-8 mb-3">
                    {renderText(section.content || '')}
                </h3>
            );
        case 'paragraph':
            return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4 text-[17px]">
                    {renderText(section.content || '')}
                </p>
            );
        case 'list':
            return (
                <ul key={index} className="space-y-2 mb-6 ml-1">
                    {section.items?.map((item, i) => (
                        <li key={i} className="flex gap-3 text-gray-700 leading-relaxed text-[17px]">
                            <span className="text-brand-green font-bold mt-1 shrink-0">•</span>
                            <span>{renderText(item)}</span>
                        </li>
                    ))}
                </ul>
            );
        case 'quote':
            return (
                <blockquote key={index} className="border-l-4 border-brand-green pl-6 py-4 my-8 bg-brand-green/5 rounded-r-xl">
                    <p className="text-gray-700 italic text-lg leading-relaxed">
                        {renderText(section.content || '')}
                    </p>
                </blockquote>
            );
        case 'tip':
            return (
                <div key={index} className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 border border-brand-green/20 rounded-xl p-6 my-8">
                    <div className="flex items-start gap-3">
                        <span className="bg-brand-green text-brand-dark text-xs font-bold px-2.5 py-1 rounded-full shrink-0 mt-0.5">
                            TIP
                        </span>
                        <p className="text-gray-700 leading-relaxed text-[17px]">
                            {renderText(section.content || '')}
                        </p>
                    </div>
                </div>
            );
        case 'image':
            return (
                <figure key={index} className="my-8">
                    <div className="relative inline-block w-full">
                        <img
                            src={section.src}
                            alt={section.alt || ''}
                            loading="lazy"
                            className={`w-full h-auto rounded-xl shadow-md object-cover ${section.crossedOut ? 'opacity-50 grayscale' : ''}`}
                        />
                        {section.crossedOut && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="absolute w-[90%] md:w-[70%] h-3 bg-red-500 rounded-full transform rotate-[25deg] shadow-lg"></div>
                                <div className="absolute w-[90%] md:w-[70%] h-3 bg-red-500 rounded-full transform -rotate-[25deg] shadow-lg"></div>
                            </div>
                        )}
                    </div>
                    {section.content && (
                        <figcaption className="text-center text-sm text-gray-400 mt-3 italic">
                            {renderText(section.content)}
                        </figcaption>
                    )}
                </figure>
            );
        case 'templatePreview':
            const isStudent = section.templateId === 'student';
            // Use Accountant data for most previews except student specific ones
            const resumeData = isStudent ? STUDENT_RESUME_DATA : JUNIOR_ACCOUNTANT_RESUME_DATA;

            return (
                <div key={index} className="my-16 flex flex-col items-center w-full">
                    <div className="relative w-full max-w-[850px] bg-white rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(112,224,152,0.25)] border-[3px] border-brand-green/40 group/preview transition-all hover:border-brand-green/70">
                        {/* Resume Preview Container */}
                        <div className="relative w-full bg-white overflow-hidden" style={{ height: '640px' }}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[210mm] origin-top transform scale-[0.68] pointer-events-none select-none mt-12 mb-20 shadow-2xl">
                                <ResumePreview data={resumeData} template={section.templateId as TemplateType} />
                            </div>
                            
                            {/* Fade effect at the bottom to transition into CTA */}
                            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/95 to-transparent z-10" />
                        </div>

                        {/* Call to Action Section Overlay/Bottom */}
                        <div className="relative z-20 -mt-32 pb-14 px-8 flex flex-col items-center text-center">
                            {section.content && (
                                <p className="text-gray-500 font-light italic text-xl mb-10 max-w-xl drop-shadow-sm">
                                    {renderText(section.content)}
                                </p>
                            )}
                            <a
                                href="/signup"
                                className="inline-flex items-center gap-2 bg-brand-green text-brand-dark px-12 py-4 rounded-xl font-semibold text-lg hover:bg-brand-greenHover hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(112,224,152,0.35)]"
                            >
                                Use This Template
                            </a>
                        </div>
                    </div>
                </div>
            );
        case 'bulletShowcase':
            return <BulletShowcase key={index} bullets={section.bullets || []} categories={section.categories || []} />;
        default:
            return null;
    }
}

const BulletShowcase = ({ bullets, categories }: { bullets: { category: string; text: string }[], categories: string[] }) => {
    const [activeCategory, setActiveCategory] = React.useState(categories[0] || 'All');
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredBullets = bullets.filter(b => 
        (activeCategory === 'All' || b.category === activeCategory) &&
        (b.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="my-12 bg-slate-50 rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10 mb-10">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="text-brand-green" size={24} />
                    <h3 className="text-2xl font-bold text-brand-dark">The Recruiter's Bullet Vault</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search by keyword (e.g. 'SQL', 'Management')..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
                        {['All', ...categories].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                                    activeCategory === cat 
                                    ? 'bg-brand-dark text-white shadow-lg shadow-brand-dark/20' 
                                    : 'bg-white text-gray-500 border border-slate-200 hover:border-brand-green'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {filteredBullets.map((bullet, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={`${bullet.category}-${idx}`}
                                className="group relative bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-green/30 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <p className="text-gray-700 text-sm leading-relaxed font-medium">
                                        {renderText(bullet.text)}
                                    </p>
                                    <button
                                        onClick={() => handleCopy(bullet.text, idx)}
                                        className={`shrink-0 p-2 rounded-lg transition-all ${
                                            copiedIndex === idx 
                                            ? 'bg-brand-green text-brand-dark' 
                                            : 'bg-slate-50 text-gray-400 hover:bg-brand-green/10 hover:text-brand-green'
                                        }`}
                                    >
                                        {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{bullet.category}</span>
                                    {copiedIndex === idx && (
                                        <span className="text-[10px] font-bold text-brand-green animate-pulse">COPIED!</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                {filteredBullets.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                        <p className="text-gray-400 font-medium">No bullet points found for "{searchQuery}"</p>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                        <Sparkles className="text-brand-green" size={20} />
                    </div>
                    <p className="text-sm text-gray-500 max-w-xs leading-tight">
                        <span className="font-bold text-brand-dark">Pro Tip:</span> Tap any card to copy the high-impact structure.
                    </p>
                </div>
                <a href="/signup" className="w-full md:w-auto bg-brand-dark text-white px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-brand-dark/20 text-center">
                    Optimize My Bullets Now
                </a>
            </div>
        </div>
    );
};

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const post = slug ? getPostBySlug(slug) : undefined;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) {
        return (
            <div className="min-h-screen bg-white font-sans">
                <PublicHeader />
                <div className="pt-32 pb-20 px-6 text-center">
                    <h1 className="text-4xl font-bold text-brand-dark mb-4">Article Not Found</h1>
                    <p className="text-gray-500 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
                    <button
                        onClick={() => navigate('/blog')}
                        className="bg-brand-green text-brand-dark px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
                    >
                        Back to Blog
                    </button>
                </div>
                <PublicFooter />
            </div>
        );
    }

    // Find related posts (same category, excluding current)
    const relatedPosts = blogPosts
        .filter(p => p.category === post.category && p.slug !== post.slug)
        .slice(0, 2);

    // Find next/prev posts
    const currentIndex = blogPosts.findIndex(p => p.slug === post.slug);
    const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

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
                title={post.metaTitle}
                description={post.metaDescription}
                canonicalPath={`/blog/${post.slug}`}
                ogImage={`https://cvarchitect.app${post.coverImage}`}
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": post.title,
                    "description": post.metaDescription,
                    "image": `https://cvarchitect.app${post.coverImage}`,
                    "datePublished": post.publishDate,
                    "dateModified": post.publishDate,
                    "author": {
                        "@type": "Organization",
                        "name": post.author,
                        "url": "https://cvarchitect.app"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "CV Architect",
                        "url": "https://cvarchitect.app",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://cvarchitect.app/images/logo icon.png"
                        }
                    },
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `https://cvarchitect.app/blog/${post.slug}`
                    },
                    "keywords": post.tags.join(', ')
                }}
            />
            <PublicHeader />

            {/* Article Header */}
            <motion.header
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="pt-28 pb-8 px-6"
            >
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <a href="/blog" className="hover:text-brand-dark transition-colors">Blog</a>
                        <span>/</span>
                        <span className="text-gray-600">{post.category}</span>
                    </nav>

                    {/* Category & Read Time */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-brand-dark text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={14} />
                            {post.readTime}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-dark leading-tight mb-6" style={{ fontFamily: 'Graphik, sans-serif' }}>
                        {post.title}
                    </h1>

                    {/* Author & Date */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-100">
                        <span className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-green/10 flex items-center justify-center">
                                {post.author === 'CV Architect Team' ? (
                                    <img 
                                        src="/images/logo icon.png" 
                                        alt="CV Architect Team" 
                                        className="w-5 h-5 object-contain"
                                    />
                                ) : (
                                    <User size={14} className="text-brand-dark" />
                                )}
                            </div>
                            {post.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar size={14} />
                            {formatDate(post.publishDate)}
                        </span>
                    </div>
                </div>
            </motion.header>

            {/* Cover Image */}
            <div className="px-6 pb-8">
                <div className="max-w-4xl mx-auto">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
                    />
                </div>
            </div>

            {/* Article Body */}
            <article className="px-6 pb-16">
                <div className="max-w-3xl mx-auto">
                    {post.content.map((section, index) => renderSection(section, index))}
                </div>
            </article>

            {/* Tags */}
            <section className="px-6 pb-12">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center flex-wrap gap-2 pt-6 border-t border-gray-100">
                        <Tag size={16} className="text-gray-400" />
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Post Navigation */}
            <section className="px-6 pb-12">
                <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4">
                    {prevPost ? (
                        <a
                            href={`/blog/${prevPost.slug}`}
                            className="group p-4 border border-gray-100 rounded-xl hover:border-brand-green/30 hover:shadow-md transition-all text-left"
                        >
                            <span className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                <ArrowLeft size={12} /> Previous
                            </span>
                            <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-green/80 transition-colors line-clamp-2">
                                {prevPost.title}
                            </span>
                        </a>
                    ) : <div />}
                    {nextPost ? (
                        <a
                            href={`/blog/${nextPost.slug}`}
                            className="group p-4 border border-gray-100 rounded-xl hover:border-brand-green/30 hover:shadow-md transition-all text-right"
                        >
                            <span className="text-xs text-gray-400 flex items-center justify-end gap-1 mb-1">
                                Next <ArrowRight size={12} />
                            </span>
                            <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-green/80 transition-colors line-clamp-2">
                                {nextPost.title}
                            </span>
                        </a>
                    ) : <div />}
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="px-6 py-12 bg-slate-50">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-brand-dark mb-8">Related Articles</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {relatedPosts.map((related) => (
                                <a
                                    key={related.slug}
                                    href={`/blog/${related.slug}`}
                                    className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                                >
                                    <img
                                        src={related.coverImage}
                                        alt={related.title}
                                        loading="lazy"
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="p-5">
                                        <span className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                            <Clock size={12} />
                                            {related.readTime}
                                        </span>
                                        <h3 className="font-bold text-brand-dark group-hover:text-brand-green/80 transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="px-6 py-16 bg-gradient-to-br from-brand-dark to-slate-800">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Put These Tips Into Action
                    </h2>
                    <p className="text-gray-300 text-lg mb-8">
                        Build your ATS-optimized resume in minutes, not hours. CV Architect's AI handles the hard part.
                    </p>
                    <a
                        href="/signup"
                        className="inline-block bg-brand-green text-brand-dark px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
                    >
                        Start Building Your Resume
                    </a>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
