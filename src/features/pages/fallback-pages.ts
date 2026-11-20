import type { PlainPageInput } from './content';
import { legalPages } from './legal-pages';

const contact = { label: 'Contact us', href: '/contact/' };

// Copied from the current talasey.co.uk pages so they keep their addresses. A page published in
// /content with the same address replaces its copy here.
export const fallbackPages: PlainPageInput[] = [
  ...legalPages,
  {
    slug: 'responsible-trading',
    title: 'Responsible trading',
    intro:
      'At Talasey, we believe responsible trading means doing business in a way that considers our customers, suppliers, people and the wider environment.',
    body: `## Our commitment to responsible trading

Responsible trading is at the heart of how we operate. We work closely with our suppliers and partners to promote high standards across our supply chain, while ensuring that the products and services we provide meet the expectations of our customers.

We continually look for ways to improve how we source, manufacture and supply our products, taking into consideration quality, sustainability, ethical practices and environmental impact.

## Responsible sourcing

We work with trusted suppliers and partners to support responsible sourcing and maintain high standards throughout our supply chain.

## Ethical business practices

We are committed to conducting our business fairly, responsibly and transparently, while maintaining strong relationships with our customers, suppliers and partners.

## Continuous improvement

We continually review our processes and practices to identify opportunities to improve our environmental and social impact while delivering quality products.`,
    actions: [{ label: 'Modern slavery statement', href: '/modern-slavery-statement/' }, contact],
    seo: {
      title: 'Responsible trading | Talasey Ltd',
      description:
        'How Talasey trades responsibly: responsible sourcing, ethical business practices and continuous improvement across our supply chain.',
    },
  },
  {
    slug: 'brochure-terms-and-conditions',
    title: 'Brochure terms and conditions',
    intro: 'The terms that apply to the information in our brochures, guides and website.',
    body: `## About us

Talasey Ltd is one of the UK’s leading suppliers of high-quality, ethically sourced landscaping products. We supply a large range of branded landscaping products including Natural Paving, Vitripiazza, Baksteen, Pavetuf, Luxigraze and Piranha to businesses and their consumers. We have a team of highly experienced sales and technical staff who are available to provide advice and guidance on our products. For further information, please contact our Customer Engagement Team on [0330 333 8030](tel:03303338030).

## Understanding our products

We have Understanding and Installation Guides for all our ranges that we recommend you read prior to purchase. They are designed to help you with your choice, what to expect upon delivery, some basic installation advice and how to look after your investment.

## Purchasing our products

If you would like to purchase any product/s from our range, please contact us directly through our Customer Engagement Team. We can assist you by providing contact details for our network of stockists, designers and/or installers. All sales will be subject to applicable Terms and Conditions, which are available directly upon request.

## Samples

Samples are available by enquiry through our Customer Engagement Team, our webpage or through your local merchant.

## Distribution

Talasey Ltd’s products are available to our stockists for collection or delivery from our distribution centres at Tilbury, Doncaster and Grangemouth.

## Upon delivery

All products must be checked on arrival, and in the unlikely event of products reaching you in a less than satisfactory condition, please refer to your stockist immediately, allowing time for the affected product to be replaced. Do not install any affected product as we will be unable to consider changing it nor will we accept any installation costs. We recommend if you are going to be away from home whilst the product is laid by a contractor, check you’re happy with it before you go.

## Dimensions

All sizes and coverages stated throughout our brochure are estimates and will be subject to minor variations, subject to tolerances. Tolerances will vary from product to product, and specific guidance should be sought from our Customer Engagement Team before placing an order.

## Wastage

Allow for cuts and positioning during install, allow for individual units with characteristics that may not be to the user’s personal liking, and, in addition, consider that due to the nature of some of our products and the journeys that they endure to get to your door some breakages may be incurred. Therefore, we recommend that you order an additional 10% for wastage.

## Specifications

We reserve the right to change or discontinue any of our product specifications or designs without notice. We cannot accept any liability for products used for purposes that they were not intended for. We recommend taking expert advice on the suitability of products for your specific needs. Product Specification and Design Guidance documents are available on request, via your local merchant or stockist.

## Installation

We have Planning and Laying Guides and/or technical advice available on our webpage (as above), to assist your installation. If in doubt, always speak to a local expert and/or carry out research from reputable independent sources.

## Colours

The images in our portfolio are only indicative of the shades and their proportions that may be represented in any given production batch. The colours shown are as accurate as reprographic processes allow. Mixing packs is recommended even if the entire delivery has been batch matched. Always try and order enough product to complete the project to minimise the batch variation and try not to mix sources of supply without checking compatibility, prior to installation. It is strongly recommended that you check that all the products supplied are from the same production batch before commencing installation.

## Colour stabilisation

All our Piranha products contain UV stabilisers; however, due to their high natural content, all composite landscaping products will go through an initial colour stabilisation. Talasey Ltd cannot accept responsibility for any potential weathering characteristics or the effects of potentially deleterious materials.

## Maintenance and cleaning

For full advice, refer to our Understanding and Installing Guides in our [Knowledge Hub](/knowledge-hub/). We have a wide range of Pavetuf maintenance and cleaning products to either help protect your products or make cleaning easier. Refer to our webpage.

## Health and safety

For full advice, refer to our Understanding and Installing Guides in our [Knowledge Hub](/knowledge-hub/) and always follow the product labels. Material Safety Data Sheets are available on request. It is your responsibility to ensure that you comply with all applicable health and safety legislation and guidelines.

## Talasey Partner Programme

Please note that our programme is designed to provide a list of members who are independent contractors, installers and designers, to assist you in choosing a landscaping professional. Talasey Ltd cannot accept credit or responsibility for their actions and work.

## Legal notice

The information in our brochure, on our website, in a guide or any document referred to herein (the “Materials”) is for guidance purposes and intended to assist you in your purchase and enjoyment of the product. Talasey Ltd will have no responsibility or liability, howsoever arising, for reliance on the information provided in the Materials. Talasey Ltd’s sole liability in respect of any products shall be as outlined in the terms and conditions of purchase or in any express guarantee relating to the product purchased. Any product guarantee referenced in the Materials is subject to terms and conditions. Whilst we work closely with our partners, any arrangement you make or advice you take from them will be subject to your contract with them. Talasey Ltd has no liability in respect of any act or omission of any third party.

Every effort has been taken to ensure that the information contained in the Materials is accurate, specifications and tolerances will be as contained in your order for the products, and may differ from those stated in the Materials, particularly with respect to natural materials, where colours may differ from those illustrated. Guidance provided by Talasey Ltd is generic, and advice should be sought in respect of local environmental and building regulations as applicable.`,
    actions: [{ label: 'View our brochures', href: '/brochures/' }, contact],
    seo: {
      title: 'Brochure terms and conditions | Talasey Ltd',
      description:
        'The terms that apply to Talasey brochures and guides: samples, delivery, dimensions, wastage, colours, installation and our legal notice.',
    },
  },
  {
    slug: 'about-talasey',
    title: 'About Talasey',
    intro:
      'Through our people, we strive to enrich the lives of others by providing landscaping products and solutions via a network of dedicated service providers.',
    body: `## Built on heritage. Driven by innovation.

Founded in 2004 as Natural Paving Products (UK) Ltd, Talasey introduced premium Indian natural stone to the UK market — a fresh alternative to traditional concrete paving.

Through strong international partnerships and uncompromising quality standards, we have grown into one of the UK’s leading independent suppliers of premium landscaping products.

## Two decades of growth

- **2004 — The Beginning.** Founded as Natural Paving Products (UK) Ltd, introducing premium Indian natural stone to the UK market.
- **2012 — Doncaster HQ.** A purpose-built headquarters opens, allowing the team to scale and expand product categories.
- **2017 — Becoming Talasey.** Rebranded as Talasey Ltd, reflecting a broader vision spanning porcelain, composite, grass and accessories.
- **2021 — Scunthorpe HQ.** A modern headquarters opens, designed to support collaboration, innovation and future growth.
- **2024 — Distribution Centre.** A new warehouse strengthens nationwide logistics and our long-term UK commitment.
- **The next chapter.** Continuing to invest in innovation, people and partnerships — shaping the future of outdoor living.

## Why Talasey

Six principles that shape every product, partnership and project we touch.

- **Premium quality.** Carefully selected products designed to perform beautifully for years.
- **Ethically sourced.** Responsibly produced materials backed by transparent supply chains.
- **Nationwide network.** A trusted distribution network reaching every corner of the UK.
- **Trusted expertise.** Two decades of guidance for homeowners, designers and landscapers.
- **Industry innovation.** Pioneering products that redefine the modern outdoor space.
- **Customer support.** Dedicated specialists guiding every step of your project.

## Building better outdoor spaces together

Quality isn’t simply about the products we supply. It’s about the relationships we build.

Every partnership, every project and every product reflects our commitment to helping create outdoor spaces built to perform beautifully for years to come.

Whether supporting independent landscapers, national builders’ merchants, architects or homeowners — Talasey remains committed to delivering premium products backed by exceptional service.

## Meet our senior leadership team

Behind Talasey’s continued success is a passionate team committed to innovation, exceptional quality and lasting partnerships across the landscaping industry.

- **Mark Wall**, Founder & CEO
- **Lisa Young**, Managing Director
- **Duncan Weighill**, Finance Director
- **Lavinia Dowson**, Product & Training Director
- **Aaron Frogley**, Business Development Director

“We have very fond memories of the site in Doncaster — that's where our business, which started as Natural Paving Products and evolved into Talasey Group, became established as a leading UK supplier of quality, ethically sourced natural stone landscaping products.” — Chief Executive Officer`,
    actions: [{ label: 'Explore our products', href: '/paving/' }, contact],
    seo: {
      title: 'About Talasey: landscaping products since 2004',
      description:
        'Founded in 2004 as Natural Paving Products, Talasey is one of the UK’s leading independent suppliers of premium landscaping products.',
    },
  },
  {
    slug: 'careers-at-talasey',
    title: 'Careers at Talasey',
    intro:
      'Join a team shaping the future of landscaping. We’re more than a leading solutions provider — we’re passionate people committed to quality, innovation, and supporting one another.',
    body: `Our teams cover sales, logistics, marketing, operations, warehousing and customer service.

## More than a job — a place to grow

At Talasey, we believe our success is driven by the people behind our business. That’s why we invest in creating a collaborative, supportive, and rewarding working environment where every team member has the opportunity to develop professionally and personally.

Whether you work in sales, customer service, logistics, marketing, warehousing, or operations, you’ll become part of a passionate team dedicated to delivering exceptional landscaping solutions across the UK.

- **Career growth.** Develop new skills through continuous learning and real career progression.
- **Supportive culture.** Join a welcoming team where collaboration, respect, and teamwork come first.
- **Industry leadership.** Work with one of the UK’s leading suppliers of landscaping products.
- **Making a difference.** Help create beautiful outdoor spaces while supporting customers nationwide.

## Experience life at Talasey

Hear directly from the people who make Talasey what it is. Our culture is built on collaboration, innovation, and a shared passion for delivering excellence. Discover why so many people build long-term careers with us.

## Always on the lookout for talented people

We’re always interested in hearing from talented and passionate individuals who want to be part of our growing team. If there are no vacancies listed today, we’d still love to hear from you — send your CV and cover letter to [HR@talasey.co.uk](mailto:HR@talasey.co.uk) and we’ll keep your details on file.

## Building Materials Careers

Proudly supporting the Building Materials Careers initiative — helping attract and develop the next generation of professionals within UK construction and landscaping.

Talasey is a significant part of the vast and vibrant Building Materials Sector, responsible for the building and construction materials in the UK. Explore what the sector has to offer for career-oriented individuals on the Building Materials Careers website. Talasey is here to help you make a difference!`,
    actions: [{ label: 'Email our HR team', href: 'mailto:HR@talasey.co.uk' }],
    seo: {
      title: 'Careers at Talasey: join our team',
      description:
        'Build your career at Talasey, one of the UK’s leading suppliers of landscaping products, in sales, logistics, marketing, operations and more.',
    },
  },
  {
    slug: 'custom-made',
    title: 'Talasey Custom Fabrication',
    intro:
      'Imagination, made in Britain. Customise and tailor make your own sculptures, screens, planters, steel edgings and drainage grates to suit the exact needs of your project.',
    body: `## What we make

- **Sculptures.** Statement forms, cut and welded to your concept.
- **Screens.** Patterned privacy panels, logos and custom perforation.
- **Planters.** Any dimension, any colour, any configuration.
- **Steel edgings.** Sculptural, curved or straight — set out to your plan.
- **Drainage grates.** Precision grates detailed to your paving module.
- **Porcelain fabrication.** Custom cut and detailed for one-off installations.

## Built once, built exactly right

- Powder-coated in any colour of your choice
- Saves time on site with fewer adjustments
- Enhances visual and structural impact
- Allows for client branding, logos or pattern customisation
- Compatible across residential, commercial and public realm projects
- Manufactured using high-quality, weather-resistant materials

## Your finish, your way

All bespoke products can be supplied in your chosen finish:

- Corten steel for a natural, weathered patina
- Powder-coated steel in a range of RAL colours
- A wider range of matt colours
- Satin, gloss or other colour effects
- Stainless steel also available for sculptures and edgings

Whether it’s sculptural edgings, custom porcelain fabrication, or unique detailing, our on site team ensures each piece is created with precision, care, and character. Commissioning a bespoke product is simple: share your ideas with us, and our expert team will guide you through design, materials, and finishes to create something that is unmistakably yours. From concept to completion, we transform imagination into enduring craftsmanship — delivering one-of-a-kind solutions that elevate your outdoor spaces beyond the ordinary.`,
    actions: [{ label: 'Share your idea', href: '/contact/' }],
    seo: {
      title: 'Custom made steel and porcelain | Talasey',
      description:
        'Bespoke sculptures, screens, planters, steel edgings, drainage grates and porcelain, made in Britain to your design and finish.',
    },
  },
  {
    slug: 'talasey-partner-programme',
    title: 'Talasey Partner Programme',
    intro:
      'Become a Talasey Designer & Installer Partner. Join an exclusive network of landscaping professionals.',
    body: `## The network advantage

Everything a modern landscape professional needs to grow, delivered from one trusted partner.

- **Priority support.** Dedicated account managers and rapid technical response.
- **Exclusive pricing.** Partner-only trade pricing across every Talasey brand.
- **Marketing assets.** Premium imagery, brochures and co-branded materials.
- **Training Academy.** Product masterclasses and certified installation training.
- **Lead referrals.** Qualified project leads routed to accredited partners.
- **Business growth.** Tools, insights and strategies to grow your practice.

## The partner journey

- **Apply.** Submit a short application telling us about your practice.
- **Review.** Our partner team reviews your credentials and portfolio.
- **Approval.** Approved partners receive their welcome pack and accreditation.

## Everything you need to craft the extraordinary

- **Training.** Certified academy sessions across every product range.
- **Technical support.** Direct line to our specification and product experts.
- **Marketing materials.** Photography, samples and co-branded assets.
- **Exclusive events.** Launches, factory tours and industry evenings.
- **Priority service.** Fast-tracked delivery and dedicated logistics.`,
    actions: [{ label: 'Join the waitlist', href: '/contact/' }],
    seo: {
      title: 'Talasey Partner Programme for installers',
      description:
        'Join the Talasey Designer & Installer Partner network for priority support, partner pricing, training, marketing assets and lead referrals.',
    },
  },
  {
    slug: 'talasey-training-academy',
    title: 'Talasey Training Academy',
    intro:
      'At Talasey, we offer a wide range of training courses to meet the diverse needs of landscaping suppliers, garden designers, and landscape installers. Whether you choose to visit our purpose-built facility or have us come to you, the Talasey Training Academy has something for every merchant, landscaper, and garden designer.',
    body: `- **Expert trainers.** Learn from industry professionals with years of hands-on experience.
- **Industry recognised.** Our qualifications are recognised and respected across the industry.
- **Practical learning.** Hands-on training in our state-of-the-art training facilities.
- **Career focused.** Gain the skills and confidence to build a successful and rewarding career.

## Product Awareness Courses

Our brand-specific Product Awareness Courses combine theory with interactive learning, making them ideal for those who sell Talasey products like natural stone paving slabs, composite decking, and porcelain paving.

These informative sessions give you the knowledge needed to understand our extensive range of landscaping materials, helping you maximise sales opportunities and provide the best service to your customers. Held at our purpose-built facilities, which include a product showroom, classroom, and dedicated training areas, these courses are designed to empower your team with valuable insights. [Product Awareness Courses](/product-awareness-courses/)

## Talasey on Tour

If you can’t travel to us, don’t worry! We’re bringing our Product Awareness Courses to you with our mobile showroom, offering on-site training tailored to your needs. [Talasey On Tour](/talasey-on-tour/)

## Product Installation Courses

Our Product Installation Courses provide a blend of theory and hands-on practical learning. Perfect for those already working with landscaping products or newcomers to the industry, these courses focus on installing natural stone and porcelain patio paving slabs, composite decking, and more.

Delivered at Talasey’s bespoke training facility by industry experts, these sessions address real-world challenges in the landscaping sector. You’ll learn everything from proper installation techniques for stone paving slabs and porcelain cladding to tips for creating stunning block paving driveways and durable composite cladding. [Product Installation Courses](/product-installation-courses/)

## Where to stay

Please find a selection of local accommodations to choose from below if you are attending our training venue for consecutive days:

- Premier Inn Scunthorpe, Gadwall Way, Lakeside Parkway, Lakeside Retail Park, DN16 3UA
- Travel Lodge Scunthorpe, Doncaster Road, Gunness, DN15 8TE
- DoubleTree by Hilton Forest Pines Spa and Golf Resort, Broughton, Ermine Street, DN20 0AQ`,
    actions: [{ label: 'Enquire now', href: '/contact/' }],
    seo: {
      title: 'Talasey Training Academy: landscaping courses',
      description:
        'Product awareness and installation courses for merchants, landscapers and garden designers, at our Scunthorpe facility or on tour.',
    },
  },
  {
    slug: 'product-awareness-courses',
    title: 'Product Awareness Courses',
    intro:
      'Build your product knowledge with expert-led training designed for landscapers, merchants, contractors, and industry professionals.',
    body: `Our product awareness courses are designed to provide you with the knowledge to understand our landscaping products.

Each day course comprises 4 sessions covering natural stone (including Pavetuf installation and jointing solutions), porcelain (including Pavetuf installation and jointing solutions) and composite decking, fencing and cladding solutions (1 ½ hours each), which will include:

- Product specific features & benefits
- Key brand information
- How to increase your sales potential
- How the products are installed with visual and practical sessions
- Our brand service offers
- Point of sale
- How the product is sold

Our experienced training team have a combined experience of over 100 years in the landscaping industry and offers a wealth of knowledge, support and guidance to ensure you get the most out of your sessions.

For maximum impact, we recommend no more than 8 people per session, with a minimum number of 4. Lunch can be provided upon request. If not all courses are required from the above list, then this can be accommodated.

For customers who would like to take advantage of our conference facilities for their own meetings and wish to include any Product Awareness Courses, this can be combined with a training slot.

All courses will be held at our Head Office at St Vincent House in Scunthorpe. Contact us today to secure your place: [training@talasey.co.uk](mailto:training@talasey.co.uk)`,
    actions: [{ label: 'Book your place', href: '/contact/' }],
    seo: {
      title: 'Product Awareness Courses | Talasey',
      description:
        'Day courses on natural stone, porcelain and composite products for landscapers, merchants and contractors, held at our Scunthorpe head office.',
    },
  },
  {
    slug: 'product-installation-courses',
    title: 'Product Installation Courses',
    intro:
      'Learn to install it properly. Hands-on, industry-led installation courses for landscaping contractors, designers, apprentices and DIYers — taught by a team with over 100 years of combined experience.',
    body: `## Course essentials

- **Format:** Classroom + Practical
- **Suitable for:** Contractors, apprentices, DIYers
- **Location:** St Vincent House, Scunthorpe
- **Starting price:** £150 per course

## Classroom theory and practical installation

All courses offer a blend of classroom and practical learning, giving delegates the knowledge and confidence to install landscaping products correctly in a domestic setting.

Whether you’re a seasoned professional adding to your portfolio or a complete novice just setting out, the sessions are built around real installation work — not just slides.

Our delivery team is passionate about passing on their vast knowledge and hands-on tips, helping delegates genuinely develop their skills in landscaping.

Sessions are held at our bespoke Talasey Training Academy facility at St Vincent House in Scunthorpe, following industry standards and guidelines throughout.

## Four courses. One training ground.

- **Installation of Stone Paving Materials for Domestic Applications.** Correct laying technique, jointing and finishing for natural stone paving in residential projects.
- **Installation of Porcelain Paving Materials for Domestic Applications.** Handling, bedding and jointing porcelain paving to manufacturer specification for lasting results.
- **Basic Site Setting Out and Preparation for Domestic Landscaping Projects.** Groundwork fundamentals: levels, falls, sub-base and setting out before a single slab goes down.
- **Installation of Composite Decking & Cladding Materials for Domestic Applications.** Substructure, fixing methods and finishing detail for composite decking and cladding systems.

For course pricing and dates, contact us at [training@talasey.co.uk](mailto:training@talasey.co.uk).`,
    actions: [{ label: 'Book your place', href: '/contact/' }],
    seo: {
      title: 'Product Installation Courses | Talasey',
      description:
        'Hands-on paving, porcelain, setting out and composite decking installation courses at the Talasey Training Academy in Scunthorpe.',
    },
  },
  {
    slug: 'talasey-on-tour',
    title: 'Talasey On Tour',
    intro:
      'A showroom built to travel. Our mobile showroom brings natural stone, porcelain, composite decking and artificial grass directly to builders’ merchants and landscaping events across the UK.',
    body: `## See it, touch it, sell it with confidence

The Talasey on Tour mobile showroom brings our comprehensive range of landscaping supplies, garden landscape supplies and outdoor products to a location most convenient for you. Whether you’re interested in natural stone patio slabs, composite decking, or artificial grass accessories, this innovative tool allows you to experience our offerings up close.

Our mini Product Awareness courses and demonstrations provide hands-on opportunities to touch, feel, and see our products firsthand. If your premises lack sufficient space, contact us and we’ll help organise suitable parking arrangements.

## Choose your session

- **Natural stone.** Including composite solution pairings — patio slabs, setts and walling up close.
- **Porcelain.** Including composite solution pairings — flagstones, cladding and cobbles.
- **Artificial grass.** Compare pile heights and finishes side by side, hands-on.
- **Composite solutions.** Decking, fencing and cladding, examined together.

## Book the mobile showroom

Email [ontour@talasey.co.uk](mailto:ontour@talasey.co.uk) to arrange your visit — we’ll help with parking if space runs tight.`,
    actions: [{ label: 'Book the mobile showroom', href: 'mailto:ontour@talasey.co.uk' }],
    seo: {
      title: 'Talasey On Tour: our mobile showroom',
      description:
        'Our mobile showroom brings natural stone, porcelain, composite decking and artificial grass to builders’ merchants and events across the UK.',
    },
  },
  {
    slug: 'health-safety',
    title: 'Health & Safety Guidelines',
    intro:
      'It is your responsibility to ensure that you comply with all applicable health and safety legislation and guidelines when working with landscaping materials.',
    body: `## Safe handling & installation

A number of items within our Natural Paving product range are heavy or awkward in shape to lift. We recommend that when moving pieces over 25kg, more than one person helps in completing the lift. With the larger plan sizes in some of our ranges, its simply not possible for installation to be carried out by one person and in addition, we would recommend you look into hiring or purchasing appropriate vacuum lifting equipment.

Furthermore, we would also recommend that gloves, safety boots with steel toe caps and oil-resistant soles, ear defenders and protective clothing should be worn. When cutting our products, suitable eye and ear protection must be also worn. Always ensure that suitable respiratory protection is worn to avoid the inhalation of dust particles produced by high-speed cutting devices. Training may be needed to operate certain equipment; it is your responsibility to ensure this takes place where necessary.

We recommend you read the technical guide and safety data sheet before working with any of our products. These are found on the individual product pages and within our Knowledge Hub.

With all Pavetuf products, follow the guidance on the label and wear the appropriate eye and respiratory protection when working with chemicals.

## Personal protective equipment

- Face protection
- Protective gloves
- Eye protection
- Hearing protection

## Questions on site safety

**At what weight should I get help lifting a slab?** For anything over 25kg, we recommend more than one person completes the lift. Some of our larger plan sizes aren’t suitable for one-person installation at all, and vacuum lifting equipment is worth hiring or buying for these.

**What protective equipment should I wear as standard?** Gloves, steel toe-cap safety boots with oil-resistant soles, ear defenders and protective clothing are recommended for general handling and installation work.

**Do I need different protection when cutting products?** Yes — suitable eye and ear protection is essential when cutting, along with respiratory protection to avoid inhaling dust from high-speed cutting devices.

**Where can I find the technical guide or safety data sheet for a product?** Both are available on the individual product pages, as well as in our Knowledge Hub.`,
    actions: [],
    seo: {
      title: 'Health and safety when laying paving | Talasey',
      description:
        'Safe lifting, cutting and protective equipment guidance for working with natural stone, porcelain and Pavetuf landscaping products.',
    },
  },
  {
    slug: 'know-before-you-buy',
    title: 'Know before you buy',
    intro:
      'Natural stone, porcelain and composite products carry the fingerprints of where they came from. Read this before you place your order — it’s the difference between a flawless finish and an avoidable surprise.',
    body: `“Every batch of stone is quarried, every porcelain slab is fired, and every roll of grass is produced in runs. That means natural variation is part of the product, not a defect in it. This guide covers the three things worth understanding before your order leaves our warehouse — colour, wastage and dimensions.”

## Colour guidance

The images on our website are indicative only and may not precisely represent the shades or proportions of any given production batch — especially across natural stone ranges. Colour appearance can also shift depending on your screen settings.

To keep a consistent blend across the whole installation, mix slabs or packs as you lay them — particularly for natural stone, porcelain, and Pavetuf jointing products.

This single habit prevents colour banding, even when the full delivery has been batch-matched at source.

When planning your project, order enough to complete the job in one go, and avoid mixing products from different suppliers unless compatibility has been confirmed beforehand.

Please note: for natural products and those containing aggregates, shade can vary as quarries are worked through over time — so imagery from a previous purchase may not exactly match current supply. For porcelain, artificial grass and composite materials, verify that everything comes from the same production batch before installing.

## Wastage guidance

Allow for cuts and positioning during installation. Allow, too, for individual units with characteristics that may not be to your personal liking — and consider that given the nature of some products, and the journeys they endure to reach your door, some breakages can occur.

We recommend ordering an additional 5–10% on top of the volume you’ve calculated.

It’s a small buffer against a much bigger headache: running short mid-project and waiting on a batch that may no longer match.

## Dimensions guidance

All sizes and coverage figures stated on our website are approximate and subject to minor variation within standard tolerances — tolerances that can differ from product to product.

For precise, product-specific guidance, call our Customer Experience Team on [0330 333 8030](tel:03303338030) before you place your order.

It’s a five-minute call that can save a re-measure, a re-order, or an installer standing on site short of material.

## Still unsure about a colour, quantity or size?

Talk to us before you order.`,
    actions: [{ label: 'Get in touch', href: '/contact/' }],
    seo: {
      title: 'Know before you buy paving and decking',
      description:
        'What to know about colour variation, wastage and sizes before ordering natural stone, porcelain, artificial grass and composite products.',
    },
  },
  {
    slug: 'product-warranty-guarantee',
    title: 'Product warranty and guarantee',
    intro:
      'Protect your purchase by registering your Talasey product warranty, and enjoy added peace of mind.',
    body: `## Our warranties

The following product ranges come with a warranty to offer peace of mind with your investment. Please note that each warranty will vary depending on the product.

## Composite cladding warranty

- Traditional Cladding – 25 Years Domestic
- Shadow Gap Cladding – 25 Years Domestic

## Composite decking warranty

- Hunter Decking – 10 Years Domestic
- Hunter Decking – 5 Years Commercial
- Terrafuzion Decking – 25 Years Domestic
- Terrafuzion Decking – 10 Years Commercial
- Pioneer Decking – 30 Years Domestic

## Composite fencing warranty

- Traditional Fencing – 25 Years Domestic
- Slatted Fencing – 25 Years Domestic

## Warranty registration

To activate your warranty, we recommend that you complete and submit the warranty activation form when you have completed your landscape installation.`,
    actions: [{ label: 'Register your warranty', href: '/contact/' }],
    seo: {
      title: 'Product warranties and registration | Talasey',
      description:
        'Warranty periods for Talasey composite decking, cladding and fencing, and how to register your warranty once your installation is complete.',
    },
  },
];
