import React from 'react';

export type CoverLetterBlock =
    | {
          type: 'paragraph';
          text: string;
      }
    | {
          type: 'signoff';
          greeting: string;
          name: string;
      };

const SIGNOFF_PATTERN =
    /\b(Sincerely(?:\s+yours)?|Best regards|Warm regards|Kind regards|Regards|With regards|Yours sincerely|Yours faithfully|Respectfully|Yours truly)\b/i;

const STRICT_SIGNOFF_START =
    /^(Sincerely(?:\s+yours)?|Best regards|Warm regards|Kind regards|Regards|With regards|Yours sincerely|Yours faithfully|Respectfully|Yours truly)[,.:]?\s*([\s\S]*)$/i;

const ONLY_SIGNOFF =
    /^(Sincerely(?:\s+yours)?|Best regards|Warm regards|Kind regards|Regards|With regards|Yours sincerely|Yours faithfully|Respectfully|Yours truly)[,.:]?$/i;

/**
 * Parses raw cover letter text into structured blocks, isolating sign-off greetings
 * and candidate names so they are guaranteed to render on separate lines.
 */
export function parseCoverLetterBlocks(
    rawText: string,
    defaultName: string = ''
): CoverLetterBlock[] {
    if (!rawText || !rawText.trim()) return [];

    // Split on 2 or more newlines into distinct paragraph blocks
    const rawParagraphs = rawText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

    const blocks: CoverLetterBlock[] = [];

    for (let i = 0; i < rawParagraphs.length; i++) {
        const current = rawParagraphs[i];

        // Case 1: The current block is ONLY a sign-off word (e.g. "Sincerely," or "Best regards")
        if (ONLY_SIGNOFF.test(current)) {
            const greeting = current.replace(/[,.:]?$/, ',');
            const next = rawParagraphs[i + 1]?.trim();

            // If the next block looks like a signer name (not another sign-off, short, no sentence punctuation)
            if (next && !SIGNOFF_PATTERN.test(next) && next.length < 80 && !/[.!?]$/.test(next)) {
                blocks.push({
                    type: 'signoff',
                    greeting,
                    name: next
                });
                i++; // Skip next block since it's consumed as the name
            } else {
                blocks.push({
                    type: 'signoff',
                    greeting,
                    name: defaultName || ''
                });
            }
            continue;
        }

        // Case 2: The current block starts with a sign-off (e.g. "Sincerely, Alex Morgan" or "Sincerely,\nAlex Morgan")
        const startMatch = current.match(STRICT_SIGNOFF_START);
        if (startMatch) {
            const greeting = startMatch[1].replace(/[,.:]?$/, ',');
            const signer = startMatch[2]?.trim() || defaultName;

            blocks.push({
                type: 'signoff',
                greeting,
                name: signer
            });
            continue;
        }

        // Case 3: Embedded sign-off inside a larger paragraph (e.g. "Thank you. Sincerely, Alex Morgan")
        const embeddedMatch = current.match(
            /([\s\S]+?)\n*\s*\b(Sincerely(?:\s+yours)?|Best regards|Warm regards|Kind regards|Regards|With regards|Yours sincerely|Yours faithfully|Respectfully|Yours truly)[,.:]?\s*([\s\S]*)$/i
        );

        if (embeddedMatch) {
            const bodyPart = embeddedMatch[1]?.trim();
            const greeting = embeddedMatch[2].replace(/[,.:]?$/, ',');
            const signer = embeddedMatch[3]?.trim() || defaultName;

            if (bodyPart) {
                blocks.push({
                    type: 'paragraph',
                    text: bodyPart
                });
            }

            blocks.push({
                type: 'signoff',
                greeting,
                name: signer
            });
            continue;
        }

        // Case 4: Standard paragraph
        blocks.push({
            type: 'paragraph',
            text: current
        });
    }

    return blocks;
}

export interface RenderCoverLetterContentProps {
    blocks: CoverLetterBlock[];
    lineSpacing?: number;
    isStreaming?: boolean;
    serifName?: boolean;
}

/**
 * Renders parsed blocks into JSX, strictly keeping "Sincerely," and candidate name on separate lines.
 */
export function RenderCoverLetterBlocks({
    blocks,
    lineSpacing,
    isStreaming = false,
    serifName = true
}: RenderCoverLetterContentProps) {
    return (
        <>
            {blocks.map((block, idx) => {
                const isLast = idx === blocks.length - 1;

                if (block.type === 'signoff') {
                    // Split signer name by newlines in case it includes a title or multiple lines
                    const signerLines = block.name
                        ? block.name.split('\n').map((l) => l.trim()).filter(Boolean)
                        : [];

                    return (
                        <div key={`signoff-${idx}`} className="pt-3 space-y-5">
                            <p className="leading-tight text-gray-900">{block.greeting}</p>
                            {signerLines.length > 0 ? (
                                <div className="space-y-1">
                                    {signerLines.map((line, lineIdx) => {
                                        const isLastLine = isLast && lineIdx === signerLines.length - 1;
                                        return (
                                            <p
                                                key={lineIdx}
                                                className={`leading-tight font-medium ${
                                                    serifName ? 'font-serif' : ''
                                                } ${lineIdx === 0 ? 'text-gray-950 font-semibold' : 'text-gray-700 text-xs'}`}
                                            >
                                                {line}
                                                {isStreaming && isLastLine && (
                                                    <span className="inline-block w-1.5 h-4 ml-1.5 bg-emerald-600 animate-pulse align-middle" />
                                                )}
                                            </p>
                                        );
                                    })}
                                </div>
                            ) : (
                                isStreaming && isLast && (
                                    <span className="inline-block w-1.5 h-4 ml-1.5 bg-emerald-600 animate-pulse align-middle" />
                                )
                            )}
                        </div>
                    );
                }

                return (
                    <p
                        key={`p-${idx}`}
                        className="leading-[1.75] whitespace-pre-line"
                        style={{
                            lineHeight: lineSpacing ? `${lineSpacing}` : undefined
                        }}
                    >
                        {block.text}
                        {isStreaming && isLast && (
                            <span className="inline-block w-1.5 h-4 ml-1.5 bg-emerald-600 animate-pulse align-middle" />
                        )}
                    </p>
                );
            })}
        </>
    );
}
