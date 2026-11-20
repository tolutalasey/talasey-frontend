import type { Faq } from './schemas';

// The questions and answers on the current talasey.co.uk FAQs page, by help topic, until they are
// published in /content. Two answers there were template text and are left out until written.
export const currentSiteFaqs: Record<string, Faq[]> = {
  'Natural stone': [
    {
      question: 'Where can I buy Natural Paving from?',
      answer:
        'Our range of Natural Paving products is available to purchase through our extensive network of distributors and stockists. To find your nearest stockist, please contact us directly or use our [find a stockist](/find-a-stockist/) service.',
    },
    {
      question: 'What are the main benefits of natural stone?',
      answer: `As the stone is natural, no two pieces are the same, allowing designers and homeowners to create stunning bespoke and individual designs which will outshine the likes of concrete and other man-made building materials. Some of the benefits natural stone has to offer include:

- Natural stone is generally easy to clean.
- Using natural stone materials may add greater value to your property.
- Natural stone is uniquely formed, each piece of stone has its own characteristics, colour variations, veining, markings and occasional charming imperfections.

The diversity of the product allows it to be used in several applications. Each piece of natural stone has a unique blend of colours and tones. All of our Natural Stone makes a durable frost-resistant paving and walling.`,
    },
    {
      question: 'What does ethically sourced stone mean?',
      answer: `Talasey recognises that, in some parts of the world, natural stone mining can involve unacceptable and unethical practices. Because of this, we are dedicated to showing our industry that natural stone can—and should—be sourced responsibly. As part of this commitment, we are proud members of the Ethical Stone Register.

By choosing ethically sourced stone, you help ensure that:

- Child labour is never used, allowing children to receive an education, while their parents gain fair employment within the quarries.
- Working hours are reasonable and not excessive.
- Mining conditions are safe and hygienic, protecting the wellbeing of all workers.
- Fair wages are paid to those involved in the quarrying process.
- All workers are treated with dignity, respect, and humanity.

Ethical sourcing plays a crucial role in improving global standards. By supporting and working alongside the Ethical Stone Register, we can work together to eliminate child labour and remove unsafe, inhumane working conditions across the stone industry.`,
    },
    {
      question: 'How do you lay natural stone paving?',
      answer:
        'For information on installation methods for our Natural Paving products see our Guide to Planning & Installing Natural Paving in the [Knowledge Hub](/knowledge-hub/?range=Natural+Stone).',
    },
    {
      question: 'What should natural stone paving be jointed with?',
      answer: `For patios, paths and other foot‑traffic areas, you can use Pavetuf All Weather Jointing Compound for joint widths from 5mm, or Pavetuf Fine Finish Jointing Compound for joint widths of 3mm, both requiring a minimum depth of 20mm. These products offer easy, all‑weather application and are suitable for all natural stone ranges.

For patios and driveways requiring a stronger solution, choose Pavetuf Flowable Jointing Mortar. This rapid‑setting mortar is ideal for professional installers and is suitable for joint widths of 5mm–50mm with a minimum depth of 20mm.

For patios, paths, light commercial areas and driveways that need a high‑performance, two‑part epoxy option, use Pavetuf Apex Flowable Jointing Grout. It is suitable for all stone ranges, for joint widths from 5mm and a minimum depth of 20mm.

For natural stone block paving laid on a flexible sand screed, a polymeric brush‑in sand such as Pavetuf Sand Set is ideal for jointing.

For full installation guidance, refer to our [Knowledge Hub](/knowledge-hub/).

Alternatively, you can use a traditional mortar joint: mix four parts building sand with one part cement, adding only enough water to bind the mix. Add a plasticiser as instructed. Use a pointing trowel to place the mortar into the joints and a pointing bar/iron to compact it. Clean the slab edges as you go using a damp soapy sponge.`,
    },
    {
      question: 'Which is the correct way up to lay natural paving?',
      answer:
        'You must always lay the largest face (and uncalibrated, riven face) upwards. Please see our Guide to Planning & Installing Natural Paving for further information.',
    },
    {
      question: 'Should I seal my natural stone paving?',
      answer: `Sealing natural stone is optional and comes down to personal preference. A wide range of sealers are available, each offering different finishes. Some products are designed to enhance the appearance of the stone, for example by adding a satin sheen, while others simply help slow down the absorption of liquids.

A key factor to consider when choosing a sealer is breathability. If the sealer is not breathable, salts within the stone can become trapped beneath the surface. This may cause issues such as efflorescence, where salts attempt to migrate to the surface but cannot escape through the sealed layer. This can lead to staining that is difficult to remove and, in some cases, may even damage the stone’s surface.

Manufacturers of non‑breathable sealers typically recommend waiting around three months before sealing newly installed paving. This allows any efflorescence to appear and be washed away before the sealer is applied.

If you choose a breathable sealer, the paving can usually be sealed immediately after installation, though it’s always best to follow the manufacturer’s guidance.

If you decide to seal your natural stone, always test the product on a small, inconspicuous area first to ensure you’re happy with the finish.

Talasey only offer sealers that are breathable and water based.`,
    },
    {
      question: 'How do I prevent and clean leaf staining on my paving?',
      answer: `To help prevent leaf staining, it’s best to regularly sweep away fallen leaves and plant debris. Many types of leaves release tannins when left on the surface, which can cause discolouration, especially when combined with standing water.

If staining does occur, Pavetuf Green‑Off Cleaner is an excellent solution. It is easy to apply, works quickly, and effectively removes leaf‑related marks from affected areas.

Green‑Off contains no solvents, acids or caustic soda, so it won’t damage the treated surface. It is safe for use on all natural stone types, including sandstone, limestone, granite and marble, as well as porcelain, ceramic, concrete and decorative paving.`,
    },
  ],
  Porcelain: [
    {
      question: 'What is the difference between a through full-bodied and colour-bodied porcelain?',
      answer: `**Through full‑bodied porcelain**

In a through full‑bodied tile, the colour of the tile’s body is consistent with the raw materials used during manufacturing. This is often referred to as a “salt and pepper” finish. There is no digital surface print, and the natural colour of the materials runs completely through the tile. Colour options in this category are more limited, but any chips that may occur are usually far less noticeable.

- No digital printing on the surface, only a salt and pepper body.
- The body colour reflects the visible surface finish.
- Very limited colour options due to natural material consistency.

**Colour‑bodied porcelain**

In colour‑bodied tiles, the body is tinted to closely match the surface design. While the surface itself is digitally printed, the matched body helps make small chips from cutting, handling or installation less visible. It’s worth noting that porcelain is a very dense and durable material, so the chance of chipping is inherently low. Colour‑bodied tiles still undergo the same vitrification process, ensuring low water absorption, high stain resistance and long‑term durability.

- Body colour is matched to complement the printed surface design.
- Small chips are typically less noticeable.
- Available in a range of finishes including polished, slip‑resistant and matte.`,
    },
    {
      question: 'What is the difference between rectified and non-rectified porcelain?',
      answer: `**Rectified tiles**

Rectified porcelain tiles have their edges mechanically cut and precision‑ground after firing, resulting in tiles that are extremely consistent in size with sharp, 90‑degree edges. This makes them ideal for installations requiring minimal joint widths and clean, crisp lines.

- Precisely ground and machined edges
- Near‑perfect straight sides
- Very tight dimensional tolerances (typically ±1mm)
- Allows tighter joint widths, generally from 5mm upward

**Non‑rectified tiles**

Non‑rectified tiles retain the edges formed during pressing and firing, giving them a more organic, natural appearance. Although the edges are not machine‑cut, high‑quality moulds ensure they are still straight. However, they require wider grout joints to accommodate slight size variations.

- Slight dimensional differences between tiles
- Larger manufacturing tolerances compared to rectified tiles
- Recommended joint widths typically from 7mm upward`,
    },
    {
      question: 'What are glazed porcelain paving tiles?',
      answer: `A glazed porcelain tile has a layer of liquid glass applied to its surface during manufacturing. This glaze is then fused to the tile during firing, creating a protective, non‑porous surface that can be finished in a wide range of colours, patterns and designs through digital printing.

Glazed porcelain is commonly used for internal applications, as the glossy surface can sometimes be more susceptible to scratching or reduced slip resistance.`,
    },
    {
      question: 'Is porcelain low maintenance?',
      answer: `Porcelain paving is known to be one of the easiest types of flagstones to keep looking clean and ‘as new’.

Its fantastic technical properties mean it doesn’t weather as quickly as other paving types and when it does need a general cleaning, it requires minimal effort. Vitripiazza is an extremely strong, hard-wearing paving type and has very low water absorption, giving excellent resistance to the environment and weather, with high resistance to UV, frost, salt and acid.

For further information see our Guide to Understanding Vitripiazza in the [Knowledge Hub](/knowledge-hub/?range=Porcelain).`,
    },
    {
      question: 'Do I need a priming slurry to install porcelain paving?',
      answer:
        'What gives porcelain such superior properties including stain resistance is the fact that the paving is non-porous. Because of this low porosity, the porcelain requires a priming slurry to be applied to the underside of the flagstone, before being laid onto the mortar bed, to create an exceptional bond between the two. Our Pavetuf range offers a Priming Slurry designed for this.',
    },
    {
      question: 'Why does my porcelain have arrows on the back of the tile?',
      answer: `The arrow is pressed onto the tiles during manufacturing. It is a guide for loading the tiles into the kiln for firing and determines the directional pattern during the printing process. These arrows can be used when installing the tiles to give a better appearance.

If the tiles are laid keeping arrows in any one direction a more consistent pattern can be achieved. This is not mandatory, and tiles can be laid randomly if desired.

Vitripiazza ranges that the arrows will appear on:

- Anno
- Bellezza Lite
- Cava Quartz
- Cava Stone
- Cava Granito
- Sofia`,
    },
    {
      question: 'What is the best way to lay external porcelain paving?',
      answer: `There are various methods for the installation of vitrified porcelain paving. Our Guide to Planning & Installing Vitripiazza has been created with our suggested installation process which will give the very best aesthetic results and assure you of the short, medium and long-term performance of the paving in the UK climate.

While it’s true that you can lay directly onto grass or sand, we would strongly recommend you install on the construction shown within this guide.`,
    },
    {
      question: 'What is the best jointing option for porcelain?',
      answer: `There are various jointing options available for vitrified porcelain and the key to a successful joint is choosing the correct type of solution for your application. See our recommendations below.

**Pavetuf Jointing Grout**

Specifically formulated for porcelain paving, this grout is an excellent choice for both professionals and DIY users. It is suitable for joint widths of 3mm to 15mm, installed at the full depth of the tile. Ideal for driveways, pedestrian areas and swimming pools, it can be used internally or externally and provides a smooth finish.

**Pavetuf Jointing Mortar**

A versatile option suitable for all types of paving, this mortar supports joint widths from 5mm to 50mm, with a minimum depth of 20mm required. It is suitable for driveways and pedestrian areas and is intended for external use only, offering a granular finish.

**Pavetuf Fine Finish Jointing Compound**

This fine‑grade jointing compound is designed for a smooth, refined finish and is suitable for porcelain, ceramic, stone, concrete paving, and block paving. It is intended for pedestrian areas and external use only, providing a durable, long‑lasting joint with a professional appearance. It is simple to apply using water and is suitable for joint widths from 3mm to 20mm with a minimum depth of 20mm. As an air‑cured product, joints must be free‑draining to ensure correct performance.

**Pavetuf All Weather Jointing Compound**

This product is not recommended for porcelain paving installed on concrete sub‑bases, and the installation guide must be followed carefully when considering its use. It is suitable for joint widths of 5mm to 20mm with a minimum depth of 20mm. When used with porcelain paving, joints must be properly struck off to ensure good compaction. Intended for pedestrian use only, external use only, and provides a granular finish. As an air‑cured product, joints must be free‑draining to ensure correct performance.

**Pavetuf Apex Flowable Jointing Grout**

For patios, paths, light commercial areas and driveways that require a high‑performance, two‑part epoxy solution, Pavetuf Apex Flowable Jointing Grout is the ideal choice. It is suitable for joint widths from 5mm with a minimum depth of 20mm.`,
    },
    {
      question: 'How easy is porcelain to clean?',
      answer: `One of the key advantages of Talasey porcelain paving is its exceptionally low‑maintenance nature and high resistance to staining. Thanks to its technical properties and very low porosity, spills and everyday soiling are far less likely to penetrate the surface compared to many other paving materials. However, some routine care will help keep your porcelain looking as good as new.

- Regular sweeping: keep the surface free from leaves and debris by brushing with a standard bristle brush.
- General cleaning: everyday dirt can be easily washed away using Pavetuf Porcelain Cleaner or simply hot, soapy water.
- Heavier cleaning: for more stubborn marks or contamination, the Pavetuf specialist cleaning range provides solutions designed to tackle a wide variety of issues.
- Organic growth: algae and similar build‑ups can be effectively treated with Pavetuf Green‑Off.
- Pressure washing: pressure washers may be used on a fan setting, keeping the lance 30–45 cm away from the surface to avoid disturbing the jointing material.

For more detailed guidance, refer to the Guide to Understanding Vitripiazza.`,
    },
    {
      question: 'How do I prevent and clean leaf staining on porcelain?',
      answer: `To minimise leaf staining, it’s best to regularly sweep areas where leaves tend to fall. Many types of leaves and plant matter release tannins when left on the surface, which can cause discolouration, especially when combined with standing water.

If staining does occur, Pavetuf Green‑Off Cleaner is an effective and easy‑to‑use solution for removing marks caused by leaves and organic debris. Green‑Off works quickly, requires minimal effort, and restores the appearance of the affected paving.

The formula contains no solvents, acids or caustic soda, ensuring it won’t damage the surface being treated. It is safe for use on all natural stone, including sandstone, limestone, granite and marble, as well as porcelain, ceramic, concrete, decorative paving and all hard landscaping areas.`,
    },
    {
      question: 'What is the difference between porcelain and ceramic?',
      answer: `Ceramic tiles can be used for both indoor and outdoor projects, but vitrified porcelain is generally the preferred option. So, what sets the two materials apart?

The most significant difference lies in their water absorption rates. Vitrified porcelain absorbs less than 0.5% of water, making it highly resistant to moisture, whereas ceramic tiles absorb considerably more, reducing their durability in demanding environments.

Vitrified porcelain paving is made through the vitrification of high‑quality raw materials such as clays, feldspar, and siliceous sands. These materials are fired at temperatures exceeding 1200°C, causing them to sinter and compact. This process closes the pores within the tile, creating a dense, hard‑wearing product with excellent technical properties, ideal for paving and cladding in both domestic and commercial settings.

Ceramic tiles, on the other hand, are manufactured in a similar way but typically use lower‑grade clays and are fired at lower temperatures. They are then finished with a surface glaze, which provides decoration but does not offer the same strength, density, or long‑term durability as vitrified porcelain.`,
    },
    {
      question: 'Can porcelain be used on a driveway?',
      answer: `Yes, porcelain can be used on a driveway, but only when the correct product and installation method are used. Our 20mm thick ranges can accommodate domestic cars or light vans when laid on a properly designed structure. This requires a minimum 100mm reinforced concrete base, supported by an appropriate sub‑base and overall construction designed for vehicular loading.

The porcelain must then be fully bonded to the concrete using a high‑performance cementitious tile adhesive rated for driveway use. As adhesive performance varies by manufacturer, we cannot provide specific adhesive recommendations. Please consult the adhesive manufacturer for technical guidance.`,
    },
    {
      question: 'Where can I buy Talasey porcelain from?',
      answer:
        'Our Vitripiazza porcelain paving is available to purchase through our extensive network of distributors and stockists. To find your nearest stockist, please visit our [find a stockist](/find-a-stockist/) page.',
    },
  ],
  'Artificial grass': [
    {
      question: 'Where can I buy Luxigraze Artificial Grass from?',
      answer:
        'Our Luxigraze Artificial Grass is available to purchase through our extensive network of distributors and stockists. To find your nearest stockist, please [contact us](/find-a-stockist/).',
    },
    {
      question: 'How long will artificial grass last?',
      answer:
        'The life expectancy of Luxigraze depends on its usage. If installed and maintained to our recommendations, it is estimated that it will last for up to 15-20 years through normal domestic/garden use.',
    },
    {
      question: 'Will my artificial grass get hot in direct sunlight?',
      answer:
        'As with decking, patios and other landscaping products exposed to direct sunlight, artificial grass can get hot in extreme temperatures. Simply rinse with a garden hose to quickly reduce the surface temperature, if, for example, the children are playing in bare feet.',
    },
    {
      question: 'What is artificial grass made from?',
      answer:
        'Luxigraze Artificial Grass is manufactured from durable plastic polymers polyethylene and/or polypropylene. These lightweight plastics are extremely resistant to damage, providing Luxigraze Artificial Grasses a UV Guarantee.',
    },
    {
      question: 'How does artificial grass drain water?',
      answer:
        'All Luxigraze Artificial Grasses have pre-punched drainage holes. This allows rainwater to drain through, providing the sub-base is free draining. The drainage holes are concealed within the pile height and are not visible when installed.',
    },
    {
      question: 'Does artificial grass have a directional pile?',
      answer: `All artificial grasses have a slight pile direction along the length of the roll. This will be noticeable when first unrolled. The artificial grass will look slightly lighter from one direction, and darker from the other. This needs to be taken into consideration when measuring, planning and installing.

Where possible, make sure the grass pile is facing towards your home or main viewpoint, to ensure a full and natural look. Artificial grass looks at its best when you are looking into the pile of grass, otherwise, it can appear shiny.`,
    },
    {
      question: 'Can you use artificial grass for a driveway?',
      answer:
        'It is not recommended to park heavy vehicles on artificial grass, as driving on the fibres is likely to leave impressions, permanently squashing and changing the direction of the pile. Rubber tyres, under the weight of any vehicle, are likely to pull and rip the grass fibres out of the lawn causing damage. Artificial grass can be a great complement to a paved driveway.',
    },
    {
      question: 'Can artificial grass be recycled?',
      answer: `Not all artificial grass can be recycled. Luxigraze 35 Tranquillity, however, is an eco-friendly, 100% recyclable artificial grass. Currently, there is nowhere in the UK to recycle artificial grass.

Developments are being undertaken and this initiative is expected to be extended to more countries in the coming years. By the time the grass reaches the end of its life span, there should be a recycling facility available in the UK.`,
    },
  ],
  Care: [
    {
      question:
        'Can I use a power washer to clean the paving and Pavetuf Jointing Compound joints?',
      answer: `Yes, you can, however a pressure-washer may not be needed. We have made cleaning easy with our full and comprehensive range of Pavetuf maintenance products, negating the need for the use of high-pressure power washers.

Our cleaners can treat all kinds of different stains and dirt build up. If you do choose to use a pressure washer, do not clean your paving and newly installed Pavetuf Jointing Compound until it is fully cured, at least 4 weeks after installation.

When you clean the patio hold the power washer on a low pressure, at an angle of about 45 degrees and use a fan spray from no closer than 300mm from the paving joints. Alternatively, often a hose and brush will suffice to remove built-up dirt and debris.`,
    },
    {
      question: 'How can I revive and clean my old patio paving?',
      answer:
        'Our Pavetuf Deep Cleaner is an effective high-performance cleaner, helping to remove stubborn greasy stains and heavy soiling. This powerful cleaner has excellent degreasing properties and can be used on all areas externally on any type of natural stone including sandstone, limestone, granite, marble, brickwork, render and all types of concrete. This easy-to-use versatile product can also be used internally on porcelain and ceramic tiles where a normal strength cleaner is not enough. Formulated with biodegradable components and degreasing agents, giving you fast and long-lasting results.',
    },
    {
      question: 'How can I get green stains off my paving?',
      answer: `Our Pavetuf Green-Off Cleaner is a high-performance, long-lasting advanced formula that removes organic growth which causes green stains on paving. Containing no solvents, acids or caustic soda means it will not damage the treated surface and is safe to use on all natural stone, sandstone, limestone, granite, marble, porcelain, ceramic, and any kind of concrete and decorative paving.

Green-Off Cleaner will not affect the colour of the treated area and is fast acting and easy to apply. It is particularly effective on areas where algae, moss, fungus and leaf staining occur. It is easily applied using a watering can or a garden pump sprayer. Pavetuf Green-Off takes the hard work out of cleaning your paving.`,
    },
    {
      question: 'What is the best cleaner for natural stone?',
      answer:
        'The entire Pavetuf range of cleaners has been thoroughly tested and are safe to use on any natural stone product. The Pavetuf range of cleaners boasts twelve different options, from everyday to heavy duty cleaners and specific solutions for different types of staining. Whether you want a general tidy up or you are trying to remove stubborn stains, the Pavetuf range of cleaners has you covered.',
    },
  ],
  Laying: [
    {
      question:
        'If I am using a pedestal system, how can I do an area that has both paving and decking products on?',
      answer:
        'With Pavetuf Adjustable Risers it is simple to create an area using both paving and decking. There is no need to order different bases as our whole system simply clicks together meaning you can order your base height and the top plate that suits the product to be laid.',
    },
    {
      question: 'How much weight can pedestals take?',
      answer:
        'The Risers are very robust with a crush resistance of 1100-1150kg per Riser and a load bearing weight of up to 2400kg per square metre which is equal to 600kg per Riser.',
    },
    {
      question: 'How many pedestals do I need for my project?',
      answer:
        'See our Pavetuf Adjustable Riser Usage & Instructions Guide in the [Knowledge Hub](/knowledge-hub/?q=riser) for full details on how many pedestals you will need to use for both paving and decking installations.',
    },
    {
      question:
        'How do you lay paving or decking on pedestals if your area is uneven, or you are laying on a slope?',
      answer: `Laying on uneven ground is made easier by using one of our two options to help you keep it all level. Our HA5 Self-Levelling attachment is sold separately and simply clips into the base to assist with levelling of uneven ground up to 5%.

Our HS2 Slope Corrector can be stacked underneath the adjustable riser base to reduce inclination differences from 2% to 10%. Each Slope Corrector will give you a 2% difference and you can use up to five of these under each riser.`,
    },
    {
      question: 'Can I use channel drainage on a driveway?',
      answer:
        'Pavetuf Decorative Channel Drain system is a perfect choice for both pedestrian and light vehicular traffic areas. The system is tested in accordance with EN 1433:2003 standard and meets A15 and B125 classes. Pavetuf Decorative Channel Drain will meet the A15 Class with the Channel Drain laid on its own. When laid with the Grate, along with the appropriate concrete support at the sides, it will meet the B125 Class.',
    },
    {
      question: 'Can I use Pavetuf Jointing Compound with a driveway project?',
      answer:
        'Pavetuf Jointing Compound is only suitable for domestic foot traffic. However, our Pavetuf is perfectly suited to most driveway applications.',
    },
    {
      question: 'Can I joint my patio in wet weather?',
      answer: `Yes, one of the benefits of Pavetuf Jointing Compound over traditional jointing methods is that it can be applied in wet weather. However, avoid jointing if extreme weather is forecast, like heavy prolonged rain, snow, freezing conditions and extremely high temperatures.

Please refer to our Guide to Using Jointing Compound.`,
    },
    {
      question:
        'My Jointing Compound has left stains or marks on my paving. How do I remove these?',
      answer: `When used correctly Pavetuf Jointing Compound will not stain the paving. Staining can occur if insufficient water has been used during the installation, allowing the compound to leave a temporary resin stain. The staining is broken down by UV, so areas that are subject to a lot of sunshine will progress quicker than shaded areas.

It may take a full cycle of the seasons before it diminishes completely. Usually, the initial staining will have quite a sheen to it. This will last for 2-4 weeks before the stain then becomes a more matt finish, then over the coming weeks and months this darkness lightens off until, eventually, it will dissipate altogether.`,
    },
  ],
  Protecting: [
    {
      question: 'Why are water-based sealers better than other sealers?',
      answer:
        'Unlike some sealers on the market, Pavetuf Sealers are non-toxic, technically advanced, water-based, and are solvent-free, making them an environmentally friendly option. They have been designed to delay the penetration of water and oily liquids allowing time to clean up any spillage to prevent staining of the hard landscaped area. With the added benefit of being breathable, not only can they be used to seal your paving before installation, but they can also be used immediately after.',
    },
  ],
  Composite: [
    {
      question: 'Where can I buy Piranha products?',
      answer:
        'Piranha products are available from our dedicated network of stockists and merchants. [Contact us](/find-a-stockist/) to find your local Piranha stockist.',
    },
    {
      question: 'What length are the Piranha decking boards?',
      answer: 'All of the Piranha Composite Decking boards are 3.6m in length.',
    },
    {
      question: 'Will Piranha Composite Decking scratch?',
      answer:
        'Our deck boards are very scratch resistant under normal use, however if heavy objects are dragged across the deck, it could leave marks. Please take care when moving heavy items over the decking, and lift not drag.',
    },
    {
      question: 'Will the Piranha Composite Decking boards change colour?',
      answer:
        'Yes, all outdoor products will change colour. This is due to natural weathering. You may notice a colour variation within the first 12 months. After this time, pigments will stabilise.',
    },
    {
      question:
        'What material should I use to build the sub-frame for my Piranha Composite Decking?',
      answer:
        'We suggest a treated tanalised timber (C16/C24) for your sub-frame. Please view our Piranha Installation & Technical Guides in the [Knowledge Hub](/knowledge-hub/?range=Composite+Products) for further installation guidance.',
    },
    {
      question: 'Can I use an aluminium sub-frame?',
      answer:
        'Yes, you can use an aluminium sub-frame when installing the composite decking. We recommend replacing our screws with aluminium screws.',
    },
    {
      question: 'How do I cut the composite decking boards?',
      answer:
        'A chop-saw or jig-saw with a small toothed blade, ideally 80 Tungsten Carbide teeth, on a 210mm diameter blade and on a high-speed setting. We recommend you ask a professional to cut the boards for you. [Find a local installer](/find-an-installer/) familiar with our products.',
    },
    {
      question: 'How do I clean the composite decking boards?',
      answer:
        'We recommend our Pavetuf Composite Cleaner, which is specially designed for use on composite materials.',
    },
    {
      question: 'Where can I use Piranha Composite Fencing?',
      answer:
        'Piranha Composite Fencing can be used in a choice of locations for both domestic and commercial applications.',
    },
    {
      question: 'What is Pioneer made from?',
      answer:
        'Pioneer is made from FSC-certified bamboo as part of a mixed core, and post-consumer recycled plastic. It’s 100% tree-free and toxin-free, offering strength, sustainability, and aesthetic appeal. This mix is referred to as bamboo foamed-PV Glass Fibre reinforced core.',
    },
    {
      question: 'Why use glass fibre in the core?',
      answer:
        'Glass fibre gives exceptional strength which means the span of the joists can be wider than ordinary wood plastic composite like our Hunter & Terrafuzion. Pioneer has woven fibre glass strands running the whole length of the boards on the top and bottom. Maximum joist span centre to centre is 500mm for Pioneer.',
    },
    {
      question: 'Does the decking fade over time?',
      answer:
        'No. Thanks to PMMA coating technology (used in aerospace and luxury watches), Pioneer has zero visible fade to the human eye, even after 4,000+ hours of UV testing under Delta E.',
    },
    {
      question: 'What wood finishes are available?',
      answer:
        'Three exclusive finishes: Ipe (deep espresso tone), Jacaranda (warm and expressive caramel grain), and Darker Oak (bold, timeless, rustic appeal).',
    },
    {
      question: 'Is Pioneer safe for families and pets?',
      answer:
        'Yes. It has a slip-resistant surface and a naturally antibacterial bamboo mixed core that repels odours, allergens, and pests.',
    },
    {
      question: 'Can Pioneer be used near pools and water features?',
      answer:
        'Absolutely. It’s moisture-proof and slip-resistant so ideal for poolside use. Pendulum Test Value result when wet and barefoot is 42 PTV.',
    },
    {
      question: 'Is Pioneer safe to use near hot tubs, beaches, or where chemicals may be present?',
      answer:
        'Pioneer is suitable for use around hot tubs, pools, and coastal environments. However, exposure to harsh chemicals like high-concentration chlorine or sea salt can affect surface performance over time. A full list of substances that may be harmful to the surface is provided in the Pioneer Technical Data Sheet. We recommend reviewing this document before installation in chemically exposed areas. Our team can provide it on request.',
    },
    {
      question: 'How is Pioneer installed?',
      answer:
        'Pioneer uses the Hulk™ collated clip system, so boards are automatically spaced and levelled. It can also be fitted with wider 500mm joist centres for 50% faster installation, and, if screws are needed, invisible fixings for a clean, professional finish.',
    },
    {
      question: 'What tools and accessories are required?',
      answer:
        'Contractors typically use Hulk™ clips, the Chain™ Hand Tool, Starborn™ Pro Plug systems, fascia fixings, and optional soundproofing accessories. If the Hulk Collated clip or the Starborn™ Pro Plug fixing systems are not used, then it will void the warranty.',
    },
    {
      question: 'How do I fasten the boards to the joists?',
      answer: `There are 2 options available depending on your chosen installation method.

- Hulk™ collated clips: each box contains 150 clips, and coverage depends on board length and board spacing. If setting your joists centre to centre to fit a 4800mm board, you would use 480mm centres to keep them equal. 1 clip at each end plus 10 joists = 11 clips per board.
- Starborn™ Pro Plug system: a hidden top fixing method used mainly on starter edge boards to fix the first board in place. A hole is routed out of the board with a special tool, a screw inserted, and the Pro Plug is inserted, which is made from the actual board surface. It can also be used as the method for the whole installation if preferred.

Each Pro Plug full kit includes 150 screws and 165 plugs. Screws and Pro Plugs are available to purchase separately with 100 of each per box or bag.

On a 170mm starter deck board it is recommended to use 2 Pro Plugs per joist fixing, 1 30mm from the edge of the board and another 30mm in from that. A clip is then used on the grooved side to secure the whole board. 22 Pro Plugs and screws per 4800mm board.

If using Pro Plug as the whole install method then 3 plugs per joist fixing is required, 33 Pro Plugs and screws per 4800mm board.

Always allow a small buffer for cuts, wastage, or custom edge detail.`,
    },
    {
      question: 'Is Pioneer compatible with timber or metal subframes?',
      answer:
        'Yes. It works with both timber and metal substructures, ground-level or raised. (Note metal fixing screws are available in the Hulk Collated Clip system.)',
    },
    {
      question: 'What is the Pavetuf Adjustable Riser System?',
      answer:
        'It’s a modular system that allows for soundproofed, elevated decking installations, with millimetre-level height adjustments. It’s made from 100% recycled and recyclable material.',
    },
    {
      question: 'Can the boards be lifted and reused?',
      answer:
        'Yes. Boards can be lifted and reinstalled easily for access to electrics or when moving home, especially when installed with the Pavetuf Riser System.',
    },
    {
      question: 'Does Pioneer require sanding, staining, or sealing?',
      answer:
        'No. The surface is stain-resistant, scratch-resistant and designed to stay in great shape with just a quick rinse using mild detergent. No chemical treatments are required.',
    },
    {
      question: 'What is the expected lifespan of Pioneer decking?',
      answer:
        'Pioneer is built to last over 30 years and has up to 4x the lifespan of traditional timber.',
    },
    {
      question: 'Is there a warranty on Pioneer decking?',
      answer:
        'Yes. Pioneer decking comes with a 30-year warranty. It is applied for in the same way as the Piranha warranties, through our [product warranty](/product-warranty-guarantee/) page.',
    },
    {
      question: 'How sustainable is Pioneer?',
      answer:
        'Extremely. The factory where Pioneer is made uses 24,000 tonnes of recycled plastic per year. Pioneer uses 100% FSC-certified bamboo as part of its core, and solar energy to power 20% of its production. It’s also certified to ISO 9001, 14001, 45001, and 50001.',
    },
    {
      question: 'Does Pioneer use any toxic chemicals or treatments?',
      answer:
        'No. Pioneer is free from toxins and does not require chemical preservatives, unlike timber alternatives.',
    },
    {
      question: 'Is the decking recyclable at end of life?',
      answer:
        'Yes. Pioneer can be ground down and used as a filler or as a replacement for solid fuel.',
    },
    {
      question: 'What are the dimensions of a standard Pioneer board?',
      answer: `Pioneer is wider than most other boards on the market at 170mm (W).

- Deck boards and starter square edge boards: 170mm (W) x 21mm (H) x 4800mm (L). Each pack includes 66 boards, covering 55.44m². Standard board coverage is 0.81m², or 0.84m² including the 6mm joint width.
- Fascia boards: 151mm (W) x 12mm (H) x 2200mm (L). Each pack contains 38 boards, covering 12.54m² or 83.60 linear metres. Board coverage is 0.33m².`,
    },
    {
      question: 'Are there edging or fascia options available?',
      answer:
        'Yes. Pioneer Starter Square edge board and Fascia Boards are available to provide clean perimeter finishes.',
    },
    {
      question: 'How heavy are the Pioneer boards?',
      answer:
        'Each deck board weighs approx. 14.49 kg (pallets weigh approx. 956.34 kg), Starter Square Edge Board 14.68kg (pallets weigh approx. 956.34 kg) and Fascia Boards 3.15kg (pallets weigh approx. 119.70 kg).',
    },
    {
      question: 'Can I order Pioneer samples?',
      answer:
        'Yes. Order them on our [samples](/samples/) page or ask our team. A local Pioneer contractor can also visit with samples, or we can tell you about a local merchant.',
    },
    {
      question: 'Is there a fitting video or guide available?',
      answer:
        'Yes. Installation guides and videos are in our [Knowledge Hub](/knowledge-hub/), or we can send them to you on request.',
    },
    {
      question: 'Who can I contact with technical queries?',
      answer:
        'You can call Talasey on 0330 333 8030 or email sales@talasey.co.uk for personalised support.',
    },
  ],
};
