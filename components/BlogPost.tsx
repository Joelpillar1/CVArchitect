import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight, User, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPostBySlug, blogPosts, BlogSection } from '../utils/blogData';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function renderSection(section: BlogSection, index: number) {
    switch (section.type) {
        case 'heading':
            return (
                <h2 key={index} className="text-2xl md:text-3xl font-bold text-brand-dark mt-10 mb-4 leading-tight">
                    {section.content}
                </h2>
            );
        case 'subheading':
            return (
                <h3 key={index} className="text-xl font-semibold text-brand-dark mt-8 mb-3">
                    {section.content}
                </h3>
            );
        case 'paragraph':
            return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4 text-[17px]">
                    {section.content}
                </p>
            );
        case 'list':
            return (
                <ul key={index} className="space-y-2 mb-6 ml-1">
                    {section.items?.map((item, i) => (
                        <li key={i} className="flex gap-3 text-gray-700 leading-relaxed text-[17px]">
                            <span className="text-brand-green font-bold mt-1 shrink-0">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            );
        case 'quote':
            return (
                <blockquote key={index} className="border-l-4 border-brand-green pl-6 py-4 my-8 bg-brand-green/5 rounded-r-xl">
                    <p className="text-gray-700 italic text-lg leading-relaxed">
                        {section.content}
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
                            {section.content}
                        </p>
                    </div>
                </div>
            );
        case 'image':
            return (
                <figure key={index} className="my-8">
                    <img
                        src={section.src}
                        alt={section.alt || ''}
                        loading="lazy"
                        className="w-full h-auto rounded-xl shadow-md object-cover"
                    />
                    {section.content && (
                        <figcaption className="text-center text-sm text-gray-400 mt-3 italic">
                            {section.content}
                        </figcaption>
                    )}
                </figure>
            );
        default:
            return null;
    }
}

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
                            <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                                <User size={14} className="text-brand-dark" />
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
                        Start Building Your Resume Free
                    </a>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
