export interface FAQItem {
  id: string;
  category: 'Products & Materials' | 'Custom Branding' | 'Bulk Orders & B2B' | 'Shipping & Export';
  question: string;
  answer: string;
}

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Products & Materials',
    question: 'Why do you choose Moso bamboo over standard wood or other bamboo species?',
    answer: 'Moso bamboo (Phyllostachys edulis) grows up to 1 meter per day without fertilizers or chemical pesticides, making it one of the most rapidly renewable resources on Earth. Furthermore, giant pandas do not consume Moso bamboo because its culms are too dense, ensuring zero disturbance to wildlife natural food chains.',
  },
  {
    id: 'faq-2',
    category: 'Products & Materials',
    question: 'How do you prevent the bamboo handles from developing mold or mildew in wet bathrooms?',
    answer: 'Every Earth Smile bamboo handle undergoes high-pressure thermal steam carbonization at 220°C. This caramelizes the natural sugars inside the bamboo fibers, creating a smooth moisture-repellent barrier that drastically minimizes water absorption. With normal upright cup drying between brushes, our handles remain clean and fresh throughout their 3-month lifespan.',
  },
  {
    id: 'faq-3',
    category: 'Products & Materials',
    question: 'What makes your Ayurvedic copper tongue cleaners superior to plastic or stainless steel?',
    answer: 'Pure elemental copper possesses proven oligodynamic properties — meaning metal ions naturally deactivate bacteria, microbes, and volatile sulfur compounds on contact. Our cleaners are forged from 99.9% virgin copper with smooth machine-buffed rounded edges that offer a comfortable, gag-free clean without wearing out or shedding microplastics into the water system.',
  },
  {
    id: 'faq-4',
    category: 'Custom Branding',
    question: 'How does custom branding work for our clinic, hotel, or retail brand?',
    answer: 'We utilize industrial CO2 laser engraving systems that etch your logo, font, room number, or slogan directly into the bamboo handle or copper grip with ±0.05mm precision. There are zero toxic chemical inks or peelable stickers involved. The branding is permanent, waterproof, and beautifully natural.',
  },
  {
    id: 'faq-5',
    category: 'Custom Branding',
    question: 'What is the minimum order quantity (MOQ) for custom logo branding?',
    answer: 'To make sustainable choices accessible to independent dental clinics, boutique homestays, and corporate gifting, our laser-engraving MOQ starts at just 100 units. For fully customized printed retail paper packaging or custom-colored handle dip coatings, MOQ begins at 500 units.',
  },
  {
    id: 'faq-6',
    category: 'Bulk Orders & B2B',
    question: 'Can we receive sample units before placing a volume commercial order?',
    answer: 'Yes! We ship pre-production sample kits (including standard and laser-engraved specimens) to verified businesses, clinics, and hospitality purchasers across India within 48 to 72 hours. Simply reach out via our enquiry form or WhatsApp at 6300136446.',
  },
  {
    id: 'faq-7',
    category: 'Bulk Orders & B2B',
    question: 'What volume discounts and payment terms are available for bulk orders?',
    answer: 'We provide structured tier pricing for quantities of 100, 500, 1,000, 5,000, and 10,000+ units. Payment terms for repeat B2B partners include standard milestone payments (50% advance upon artwork confirmation, 50% prior to dispatch), with GST invoice compliance.',
  },
  {
    id: 'faq-8',
    category: 'Shipping & Export',
    question: 'Do you deliver across India and do you support international export?',
    answer: 'Yes. We deliver pan-India via express surface and air cargo partners (Bluedart, Delhivery, DTDC) with end-to-end dispatch tracking. For international orders, we provide full export documentation including HS Code classification, Commercial Invoices, and Phytosanitary certification.',
  },
];
