import React from 'react';

interface RichTextProps {
  /** Raw text that may contain inline HTML formatting tags: <strong>, <em>, <u>, <a> */
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** Wrapper element type. Defaults to 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * RichText renders a string that may contain inline HTML formatting
 * (bold, italic, underline, links) produced by the resume editor's
 * inline-format toolbar.
 *
 * Uses dangerouslySetInnerHTML — only call with data from the resume
 * editor, never with user-supplied arbitrary HTML from the network.
 */
const RichText: React.FC<RichTextProps> = ({ text, className, style, as: Tag = 'span' }) => {
  if (text === null || text === undefined || text === '') {
    return <Tag className={className} style={style}>{'\u200B'}</Tag>;
  }

  // If the string contains no HTML tags, render as plain text to avoid
  // the dangerouslySetInnerHTML overhead on every cell.
  // <span> is included so legacy stored data (older write-backs wrapped skill
  // cells in <span> layers) renders as real markup instead of literal
  // "<span>Skill</span>" text; a bare <span> wrapper is inert HTML.
  const hasHtml = /<(?:strong|b|em|i|u|a|span)\b/i.test(text);
  if (!hasHtml) {
    return <Tag className={className} style={style}>{text}</Tag>;
  }

  return (
    <Tag
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default RichText;
