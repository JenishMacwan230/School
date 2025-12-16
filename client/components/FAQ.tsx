import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const questions = [
  {
    q: "What curriculum does the school follow?",
    a: "Our school follows a well-structured curriculum aligned with board guidelines, focusing on academic excellence, practical learning, and overall student development.",
  },
 {
  q: "What are the school timings?",
  a: "The school operates from 10:30 AM to 4:40 PM on weekdays. On Saturdays, school hours are from 8:00 AM to 11:20 AM. Any changes are communicated by the school administration in advance.",
},
  {
    q: "How can parents track student progress?",
    a: "Parents can track academic performance through regular assessments, report cards, parent-teacher meetings, and school communication platforms.",
  },
 
  {
    q: "How can parents contact the school?",
    a: "Parents can contact the school through the school office, official email, phone number, or by visiting the campus during working hours.",
  },
];


export function FAQs() {
    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-12 sm:py-16">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                    Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">Find answers to common questions below</p>
            </div>

            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                {questions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`}>
                        <AccordionTrigger className="text-left hover:no-underline text-md">
                            <span className="font-medium">{item.q}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
