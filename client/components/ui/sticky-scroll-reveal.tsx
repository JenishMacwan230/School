'use client';
import React, { useRef } from 'react';
import { useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from '@/lib/utils';

export const StickyScroll = ({
    content,
    contentClassName,
}: {
    content: {
        title: string;
        description: string;
        content?: React.ReactNode;
    }[];
    contentClassName?: string;
}) => {
    const [activeCard, setActiveCard] = React.useState(0);
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ['start start', 'end start'],
    });
    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
            const distance = Math.abs(latest - breakpoint);
            if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                return index;
            }
            return acc;
        }, 0);
        setActiveCard(closestBreakpointIndex);
    });

    return (
        <div
            className="relative flex h-[30rem] justify-center scrollbar-hide space-x-10 overflow-y-auto rounded-md p-10"
            ref={ref}
        >
            <div className="div relative flex items-start px-4">
                <div className="max-w-2xl">
                    {content.map((item, index) => (
                        <div key={item.title + index} className="my-20">
                            <h2 className="text-2xl font-bold">{item.title}</h2>
                            <p className="text-kg mt-10 max-w-sm">{item.description}</p>
                        </div>
                    ))}
                    <div className="h-40" />
                </div>
            </div>
            <div
                className={cn(
                    'sticky top-10 hidden h-60 w-80 overflow-hidden rounded-md lg:block',
                    contentClassName,
                )}
            >
                {content[activeCard].content ?? null}
            </div>
        </div>
    );
};
