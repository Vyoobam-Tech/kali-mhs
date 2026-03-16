/**
 * Kali MHS — Database Seeder
 * Run with: npx ts-node -r tsconfig-paths/register src/seed.ts
 *
 * Covers:
 *  - Products (6)
 *  - Projects (3)
 *  - Documents (6)
 *  - CMS Pages: homepage, about-page, contact-page, careers-page, resources-page
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { ProductModel } from '@infra/database/models/Product.model';
import { ProjectModel } from '@infra/database/models/Project.model';
import { DocumentModel } from '@infra/database/models/Document.model';
import { CMSPageModel } from '@infra/database/models/CMS.model';
import { UserModel } from '@infra/database/models/User.model';
import { ProductCategory, ProductStatus } from '@domain/product.interface';
import { DocumentCategory, DocumentAccessLevel, DocumentStatus } from '@domain/document.interface';
import { CMSContentType, ContentStatus } from '@domain/cms.interface';

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kali-mhs';
  console.log('🌱 Connecting to database...');
  await mongoose.connect(uri);
  console.log('✅ Connected!\n');

  // Get or create an admin user to use as createdBy
  let admin = await UserModel.findOne({ role: 'SUPER_ADMIN' }).lean();
  if (!admin) {
    admin = await UserModel.findOne({}).lean();
  }
  if (!admin) {
    console.error('❌ No users found. Run the app first and create an admin user, then re-run the seed.');
    process.exit(1);
  }
  const adminId = (admin as any)._id;
  console.log(`🔑 Using admin: ${(admin as any).email}\n`);

  // ── PRODUCTS ──────────────────────────────────────────────────────────────
  const productsCount = await ProductModel.countDocuments({ isDeleted: false });
  if (productsCount === 0) {
    console.log('🏭 Seeding Products...');
    await ProductModel.insertMany([
      {
        name: 'Heavy-Duty Belt Conveyor System',
        slug: 'heavy-duty-belt-conveyor-system',
        shortDescription: 'High-capacity troughed belt conveyor for mining, ports, and bulk terminals up to 30,000 TPH.',
        fullDescription: 'Our flagship belt conveyor system is engineered for the harshest material handling environments. Available in widths from 500mm to 2400mm, with idler spacing and belt speeds customised to the specific material and throughput requirement.',
        category: ProductCategory.METAL_ROOFING_SHEET, // Using a category from enum; ideally backend enum would be updated
        status: ProductStatus.ACTIVE,
        specifications: [
          { name: 'Capacity', value: 'Up to 30,000', unit: 'TPH' },
          { name: 'Belt Width', value: '500 – 2400', unit: 'mm' },
          { name: 'Max Length', value: '20', unit: 'km' },
          { name: 'Drive Power', value: 'Up to 6,000', unit: 'kW' },
        ],
        features: ['ISO 5048 Compliant Design', 'CEMA Standard Idlers', 'Variable Speed Drive Ready', 'Fully Automated Control Option'],
        applications: ['Iron Ore Mining', 'Coal Handling', 'Port Terminals', 'Steel Plant Logistics', 'Cement Plants'],
        images: [],
        documents: [],
        showPrice: false,
        seo: {
          metaTitle: 'Belt Conveyor Systems | Kali MHS',
          metaDescription: 'Heavy-duty belt conveyor systems for mining, ports, and bulk material handling. Up to 30,000 TPH capacity.',
          keywords: ['belt conveyor', 'material handling', 'mining conveyor', 'bulk conveyor'],
        },
        viewCount: 0, downloadCount: 0, inquiryCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        name: 'Bucket Wheel Stacker-Reclaimer',
        slug: 'bucket-wheel-stacker-reclaimer',
        shortDescription: 'Automated bucket wheel stacker-reclaimers for stockyard and bulk terminal applications up to 10,000 TPH.',
        fullDescription: 'Our bucket wheel stacker-reclaimers provide fully automated, energy-efficient stockyard management for coal, iron ore, limestone, and other bulk materials. All machines feature a rail-mounted design with luffing boom and central SCADA integration capability.',
        category: ProductCategory.METAL_SANDWICH_PANEL,
        status: ProductStatus.ACTIVE,
        specifications: [
          { name: 'Stacking Capacity', value: 'Up to 12,000', unit: 'TPH' },
          { name: 'Reclaiming Capacity', value: 'Up to 10,000', unit: 'TPH' },
          { name: 'Boom Length', value: 'Up to 80', unit: 'm' },
          { name: 'Travel Speed', value: 'Up to 40', unit: 'm/min' },
        ],
        features: ['S7 PLC Automation', 'Anti-collision System', 'CCTV Integration', 'Remote Monitoring Ready'],
        applications: ['Iron Ore Ports', 'Coal Power Plants', 'Steel Plant Yards', 'Cement Stockyards'],
        images: [],
        documents: [],
        showPrice: false,
        seo: {
          metaTitle: 'Stacker Reclaimers | Kali MHS',
          metaDescription: 'Automated bucket wheel stacker-reclaimers for bulk material ports and industrial stockyards.',
          keywords: ['stacker reclaimer', 'bucket wheel', 'stockyard', 'bulk terminal'],
        },
        viewCount: 0, downloadCount: 0, inquiryCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        name: 'Continuous Ship Unloader',
        slug: 'continuous-ship-unloader',
        shortDescription: 'High-efficiency continuous ship unloaders for coal and grain import terminals, up to 3,000 TPH.',
        fullDescription: 'Our continuous ship unloaders (CSU) use a bucket elevator principle mounted on a travelling portal frame to achieve high throughput with low spillage, minimal dust emissions, and fully automated operation controlled from a centralised cabin.',
        category: ProductCategory.METAL_CLADDING,
        status: ProductStatus.ACTIVE,
        specifications: [
          { name: 'Capacity', value: 'Up to 3,000', unit: 'TPH' },
          { name: 'Outreach', value: 'Up to 40', unit: 'm' },
          { name: 'Digging Depth', value: 'Up to 22', unit: 'm' },
        ],
        features: ['Dust Containment System', 'Automated Material Level Detection', 'Full Hatch Coverage', 'Shore Power Compatible'],
        applications: ['Coal Import Terminals', 'Grain Ports', 'Fertilizer Terminals', 'Power Plant Jetties'],
        images: [],
        documents: [],
        showPrice: false,
        seo: { metaTitle: 'Ship Unloaders | Kali MHS', metaDescription: 'Continuous ship unloaders for coal and grain import terminals.' },
        viewCount: 0, downloadCount: 0, inquiryCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        name: 'Radial Ship Loader',
        slug: 'radial-ship-loader',
        shortDescription: 'Radial travelling shiploaders for export terminals with capacities up to 12,000 TPH.',
        fullDescription: 'Our radial shiploaders are designed for efficient, dust-free loading of bulk carriers at export terminals. Available as luffing-slewing and straight-boom variants, with trimming spouts and dust suppression integrated as standard.',
        category: ProductCategory.METAL_ACCESSORIES,
        status: ProductStatus.ACTIVE,
        specifications: [
          { name: 'Capacity', value: 'Up to 12,000', unit: 'TPH' },
          { name: 'Boom Length', value: 'Up to 60', unit: 'm' },
          { name: 'Slewing Range', value: '180', unit: 'degrees' },
        ],
        features: ['Telescopic Chute', 'Dust Suppression Integrated', 'Auto Trimming Control', 'Draft Survey Camera'],
        applications: ['Coal Export Terminals', 'Iron Ore Export', 'Bauxite Terminals', 'Fertilizer Export'],
        images: [],
        documents: [],
        showPrice: false,
        seo: { metaTitle: 'Ship Loaders | Kali MHS', metaDescription: 'Radial ship loaders for bulk material export terminals worldwide.' },
        viewCount: 0, downloadCount: 0, inquiryCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        name: 'Apron Feeder',
        slug: 'apron-feeder',
        shortDescription: 'Heavy-duty apron feeders for controlled extraction from hoppers, bins, and crusher discharge points.',
        fullDescription: 'Kali MHS apron feeders are designed to handle the most abrasive, lumpy, and high-temperature materials in primary crushing applications, stockpile reclaim, and hopper extraction with precision speed control via variable frequency drives.',
        category: ProductCategory.CONCRETE_ROOF_TILE,
        status: ProductStatus.ACTIVE,
        specifications: [
          { name: 'Capacity', value: 'Up to 4,000', unit: 'TPH' },
          { name: 'Width', value: '600 – 3,000', unit: 'mm' },
          { name: 'Max Lump Size', value: 'Up to 1,200', unit: 'mm' },
        ],
        features: ['Manganese Steel Pans', 'VFD Speed Control', 'Double Strand Heavy Chains', 'Tapered Frame Design'],
        applications: ['Primary Crusher Feed', 'ROM Ore Extraction', 'Sinter Plant Feed', 'Blast Furnace Charging'],
        images: [],
        documents: [],
        showPrice: false,
        seo: { metaTitle: 'Apron Feeders | Kali MHS', metaDescription: 'Heavy-duty apron feeders for primary material extraction in mining and steel plants.' },
        viewCount: 0, downloadCount: 0, inquiryCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        name: 'Pipe Conveyor System',
        slug: 'pipe-conveyor-system',
        shortDescription: 'Enclosed pipe conveyor for dusty, corrosive, or environmentally sensitive bulk material transport.',
        fullDescription: 'Pipe conveyors offer the ability to negotiate tight horizontal and vertical curves without transfer points, making them ideal for complex terrain and environmentally sensitive routes. The belt forms a sealed tube around the material preventing spillage and dust emission.',
        category: ProductCategory.CONCRETE_RIDGE_TILE,
        status: ProductStatus.ACTIVE,
        specifications: [
          { name: 'Capacity', value: 'Up to 5,000', unit: 'TPH' },
          { name: 'Pipe Diameter', value: '100 – 750', unit: 'mm' },
          { name: 'Max Curve Radius', value: 'Down to 150', unit: 'm' },
        ],
        features: ['Zero Spillage Design', 'Bidirectional Operation', 'Sharp Curve Capability', 'Fully Enclosed Material'],
        applications: ['Urban Material Transport', 'Overland Routes', 'Fertilizer Handling', 'Chemical Plant Conveyors'],
        images: [],
        documents: [],
        showPrice: false,
        seo: { metaTitle: 'Pipe Conveyors | Kali MHS', metaDescription: 'Enclosed pipe conveyor systems for environmentally sensitive and complex terrain applications.' },
        viewCount: 0, downloadCount: 0, inquiryCount: 0,
        createdBy: adminId, isDeleted: false,
      },
    ]);
    console.log('  ✅ Products seeded (6 products)');
  } else {
    console.log(`  ⏭️  Products already exist (${productsCount}), skipping.`);
  }

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  const projectsCount = await ProjectModel.countDocuments({ isDeleted: false });
  if (projectsCount === 0) {
    console.log('🏗️  Seeding Projects...');
    await ProjectModel.insertMany([
      {
        title: '12 MTPA In-Pit Crushing & Conveying System',
        slug: 'ipcc-iron-ore-south-africa',
        shortDescription: 'Fully integrated IPCC solution with a 3.2 km overland conveyor for a major iron ore producer in South Africa.',
        fullDescription: 'Designed and delivered a fully integrated IPCC solution with a 3.2 km overland conveyor, reducing haul truck fleet by 60% and operating costs by 35% annually. The project included primary gyratory crushing, in-pit conveyor gallery, overland conveyor with drive stations, and surge bins.',
        client: 'A Major Iron Ore Producer',
        location: 'Northern Cape, South Africa',
        category: 'INDUSTRIAL',
        status: 'PUBLISHED',
        isFeatured: true,
        tags: ['Mining', 'IPCC', 'Conveyor', 'Iron Ore'],
        keyFeatures: ['35% reduction in operating cost', '60% fewer haul trucks', '12 MTPA throughput achieved', 'Delivered 2 months ahead of schedule'],
        images: [],
        productsUsed: [],
        viewCount: 0, likeCount: 0, displayOrder: 1,
        metaTitle: 'IPCC Iron Ore South Africa | Kali MHS',
        metaDescription: '12 MTPA in-pit crushing and conveying system for iron ore mining in South Africa.',
        createdBy: adminId, isDeleted: false,
      },
      {
        title: 'Automated Coal Import Terminal — 8,000 TPH',
        slug: 'coal-import-terminal-uae',
        shortDescription: 'Turnkey coal unloading terminal featuring twin ship unloaders, 6 km of conveyor systems, and a fully automated SCADA-controlled stockyard.',
        fullDescription: 'Turnkey coal unloading terminal featuring twin continuous ship unloaders at 4,000 TPH each, 6 km of conveyor systems across 3 berths, a combined stacker-reclaimer for a 1.2 MT stockyard, and a fully automated SCADA-controlled material tracking system.',
        client: 'Abu Dhabi Ports Authority',
        location: 'Abu Dhabi, UAE',
        category: 'INFRASTRUCTURE',
        status: 'PUBLISHED',
        isFeatured: true,
        tags: ['Ports', 'Coal', 'Ship Unloader', 'SCADA'],
        keyFeatures: ['8,000 TPH ship unloading rate', 'SCADA-integrated stockyard', '100% automation achieved', 'ISO 9001 certified erection'],
        images: [],
        productsUsed: [],
        viewCount: 0, likeCount: 0, displayOrder: 2,
        metaTitle: 'Coal Import Terminal UAE | Kali MHS',
        metaDescription: 'Automated 8,000 TPH coal import terminal with SCADA stockyard management in Abu Dhabi.',
        createdBy: adminId, isDeleted: false,
      },
      {
        title: '5 MTPA Integrated Steel Plant Logistics',
        slug: 'steel-plant-logistics-vietnam',
        shortDescription: 'Complete raw material handling covering iron ore, coal, and limestone flow paths for a greenfield integrated steel plant.',
        fullDescription: 'Complete material flow from jetty unloading to blast furnace charging, including ore and coal unloaders, conveyor networks, stockyard machines, and bin charging conveyors totalling over 22 km of belt conveyors.',
        client: 'Vietnam Steel Corporation',
        location: 'Hai Phong, Vietnam',
        category: 'INDUSTRIAL',
        status: 'PUBLISHED',
        isFeatured: true,
        tags: ['Steel', 'Greenfield', 'Conveyor', 'Vietnam'],
        keyFeatures: ['5 MTPA integrated flow', '3 stockyard machines supplied', '22 km of belt conveyors', 'Delivered ahead of schedule'],
        images: [],
        productsUsed: [],
        viewCount: 0, likeCount: 0, displayOrder: 3,
        metaTitle: 'Steel Plant Material Handling Vietnam | Kali MHS',
        metaDescription: '5 MTPA integrated raw material handling for steel plant in Vietnam.',
        createdBy: adminId, isDeleted: false,
      },
    ]);
    console.log('  ✅ Projects seeded (3 projects)');
  } else {
    console.log(`  ⏭️  Projects already exist (${projectsCount}), skipping.`);
  }

  // ── DOCUMENTS ─────────────────────────────────────────────────────────────
  const docsCount = await DocumentModel.countDocuments({ isDeleted: false });
  if (docsCount === 0) {
    console.log('📄 Seeding Documents...');
    await DocumentModel.insertMany([
      {
        title: 'Belt Conveyor Systems — Technical Brochure',
        description: 'Comprehensive overview of our belt conveyor technology including troughed, flat, pipe, and chevron belt variants with full technical specifications.',
        category: DocumentCategory.BROCHURE,
        status: DocumentStatus.PUBLISHED,
        fileUrl: '#', fileName: 'belt-conveyor-brochure.pdf', fileType: 'application/pdf', fileSize: 2400000,
        accessLevel: DocumentAccessLevel.PUBLIC,
        watermarkEnabled: false,
        slug: 'belt-conveyor-brochure',
        version: '2024.1',
        tags: ['belt conveyor', 'conveyor', 'brochure'],
        viewCount: 0, downloadCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        title: 'Stacker-Reclaimer Systems — Technical Brochure',
        description: 'Detailed overview of slewing, rail-mounted, and portal reclaimers for bulk terminal applications.',
        category: DocumentCategory.BROCHURE,
        status: DocumentStatus.PUBLISHED,
        fileUrl: '#', fileName: 'stacker-reclaimer-brochure.pdf', fileType: 'application/pdf', fileSize: 3200000,
        accessLevel: DocumentAccessLevel.PUBLIC,
        watermarkEnabled: false,
        slug: 'stacker-reclaimer-brochure',
        version: '2024.1',
        tags: ['stacker reclaimer', 'stockyard', 'brochure'],
        viewCount: 0, downloadCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        title: 'Kali MHS Company Profile 2024',
        description: 'An executive overview of Kali MHS — our history, capabilities, global footprint, and client portfolio.',
        category: DocumentCategory.BROCHURE,
        status: DocumentStatus.PUBLISHED,
        fileUrl: '#', fileName: 'company-profile-2024.pdf', fileType: 'application/pdf', fileSize: 4800000,
        accessLevel: DocumentAccessLevel.GATED,
        watermarkEnabled: true,
        slug: 'company-profile-2024',
        version: '2024.1',
        tags: ['company profile', 'corporate'],
        viewCount: 0, downloadCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        title: 'Ship Loaders & Unloaders Catalogue',
        description: 'Full technical catalogue of our ship loaders and continuous ship unloader product range.',
        category: DocumentCategory.CATALOG,
        status: DocumentStatus.PUBLISHED,
        fileUrl: '#', fileName: 'ship-equipment-catalogue.pdf', fileType: 'application/pdf', fileSize: 5100000,
        accessLevel: DocumentAccessLevel.GATED,
        watermarkEnabled: true,
        slug: 'ship-equipment-catalogue',
        version: '2023.2',
        tags: ['ship loader', 'ship unloader', 'catalogue'],
        viewCount: 0, downloadCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        title: 'IPCC Case Study — Iron Ore South Africa',
        description: '12 MTPA in-pit crushing and conveying project case study with full project scope, challenge breakdown, and outcome metrics.',
        category: DocumentCategory.CASE_STUDY,
        status: DocumentStatus.PUBLISHED,
        fileUrl: '#', fileName: 'ipcc-south-africa-case-study.pdf', fileType: 'application/pdf', fileSize: 1800000,
        accessLevel: DocumentAccessLevel.PUBLIC,
        watermarkEnabled: false,
        slug: 'ipcc-south-africa-case-study',
        version: '2022.1',
        tags: ['case study', 'mining', 'IPCC', 'South Africa'],
        viewCount: 0, downloadCount: 0,
        createdBy: adminId, isDeleted: false,
      },
      {
        title: 'Coal Import Terminal Case Study — UAE',
        description: '8,000 TPH automated coal unloading terminal at Abu Dhabi Ports — full case study with engineering scope and project outcomes.',
        category: DocumentCategory.CASE_STUDY,
        status: DocumentStatus.PUBLISHED,
        fileUrl: '#', fileName: 'coal-terminal-uae-case-study.pdf', fileType: 'application/pdf', fileSize: 2200000,
        accessLevel: DocumentAccessLevel.PUBLIC,
        watermarkEnabled: false,
        slug: 'coal-terminal-uae-case-study',
        version: '2021.1',
        tags: ['case study', 'ports', 'coal', 'UAE'],
        viewCount: 0, downloadCount: 0,
        createdBy: adminId, isDeleted: false,
      },
    ]);
    console.log('  ✅ Documents seeded (6 documents)');
  } else {
    console.log(`  ⏭️  Documents already exist (${docsCount}), skipping.`);
  }

  // ── CMS PAGES ─────────────────────────────────────────────────────────────
  const cmsCount = await CMSPageModel.countDocuments({});
  if (cmsCount === 0) {
    console.log('📝 Seeding CMS Pages...');
    await CMSPageModel.insertMany([

      // ── HOMEPAGE ──────────────────────────────────────────────────────────
      {
        title: 'Homepage',
        slug: 'homepage',
        type: CMSContentType.PAGE,
        status: ContentStatus.PUBLISHED,
        content: JSON.stringify({
          hero: {
            badge: 'Pioneering Material Handling',
            title: 'Engineering Excellence in Bulk Material Handling',
            titleHighlight: null,
            subtitle: 'Robotic-enhanced intelligent conveyor systems and bulk handling solutions. We design, manufacture, and install customized systems for maximal operational efficiency.',
            primaryButton: { label: 'Explore Products', href: '/products' },
            secondaryButton: { label: 'Contact Our Experts', href: '/contact' },
          },
          stats: [
            { value: '50+', label: 'Global Locations' },
            { value: '5000+', label: 'Projects Delivered' },
            { value: '98%', label: 'Client Retention' },
          ],
          pioneering: {
            badge: 'Our Story',
            title: 'Pioneering Material Handling Solutions Worldwide',
            body: 'With a deep understanding of heavy industries, Kali MHS has reliable operational experience across a wide range of complex environments. We combine robust mechanical engineering with the latest automation technology.',
            highlights: [
              'Optimized structural integrity',
              'Process-oriented manufacturing',
              '24/7 lifecycle support',
              'Highest safety standards globally',
            ],
            statValue: '50+',
            statLabel: 'Years of Material Handling Innovation',
          },
          productsSection: {
            badge: 'Our Products',
            title: 'Comprehensive Product Portfolio',
            subtitle: 'We design and manufacture heavy-duty systems built to withstand the harshest industrial conditions.',
            items: [
              {
                title: 'Belt Conveyor Systems',
                desc: 'Industry-leading conveyors with predictive maintenance capabilities to move heavily loaded materials efficiently and ensure facility uptime.',
                subItems: ['Troughed Belt Conveyors', 'Pipe Conveyors', 'Overland Conveyors'],
                learnMoreHref: '/products',
                learnMoreLabel: 'Learn More',
              },
              {
                title: 'Bulk Material Handling',
                desc: 'Comprehensive stockpile management, crushing, and screening circuits engineered for the mining and cement sectors.',
                subItems: ['Stackers & Reclaimers', 'Truck Unloading Systems', 'Crushing Plants'],
                learnMoreHref: '/products',
                learnMoreLabel: 'Learn More',
              },
              {
                title: 'Pneumatic Systems',
                desc: 'Enclosed pneumatic conveying systems to transport powder and granular materials dependably without dust contamination.',
                subItems: ['Dense Phase Systems', 'Dilute Phase Systems', 'Silo Venting'],
                learnMoreHref: '/products',
                learnMoreLabel: 'Learn More',
              },
              {
                title: 'Mobile Equipment',
                desc: 'Versatile modular and mobile units for flexible material routing and fast deployment across changing site conditions.',
                subItems: ['Mobile Hoppers', 'Tracked Conveyors', 'Radial Stackers'],
                learnMoreHref: '/products',
                learnMoreLabel: 'Learn More',
              },
            ],
          },
          virtualTour: {
            title: 'Explore Our Products in 360°',
            subtitle: 'View an interactive 3D virtual tour of our intelligent conveyor hubs. Experience the engineering precision firsthand using augmented reality.',
            buttonLabel: 'View Virtual Tour',
            buttonHref: '#',
          },
          sectors: {
            badge: 'Industries We Serve',
            title: 'Trusted Across Diverse Sectors',
            subtitle: 'Kali MHS operates across a wide spectrum of heavy industries, providing mission-critical infrastructure worldwide.',
            items: [
              { title: 'Mining & Minerals', desc: 'High-capacity extraction conveyors and ore handling.' },
              { title: 'Ports & Terminals', desc: 'Bulk ship loading and portside shiploader solutions.' },
              { title: 'Cement & Construction', desc: 'Aggregate storage, pre-blend yards, and clinker transport.' },
              { title: 'Power Generation', desc: 'Biomass and coal feeding systems for power generation.' },
              { title: 'Food & Agriculture', desc: 'Food-grade grain handling and enclosed storage silos.' },
              { title: 'Warehousing & Logistics', desc: 'Automated sortation lines and warehouse intralogistics.' },
            ],
          },
          solutions: {
            badge: 'Why Choose Us',
            title: 'End-to-End Solutions & Support',
            subtitle: 'From initial consultation to long-term support, we stand beside you every step of the way.',
            items: [
              { title: 'Custom Engineering', desc: 'Tailored drafts and CAD models designed explicitly around your facility constraints and parameters.' },
              { title: 'Expert Consultation', desc: 'Site assessments and capacity metrics modeled by our team of structural engineers.' },
              { title: 'Global Installation', desc: 'On-site construction and commissioning executed flawlessly by OSHA-certified teams worldwide.' },
              { title: 'Quality Assurance', desc: 'Rigorous testing protocols ensuring compliance with global machinery and automation safety standards.' },
              { title: 'After-Sales Service', desc: '24/7 dedicated support desk, local spare parts stocks, and scheduled maintenance programs.' },
              { title: 'Innovation Leader', desc: 'Constantly integrating automation, sensor diagnostics, and energy-recovery architectures into every line.' },
            ],
          },
          cta: {
            title: 'Ready to Optimize Your Material Handling?',
            subtitle: 'Connect with our team today for a custom capacity report and extensive project consultation.',
            primaryButton: { label: 'Request a Quote', href: '/rfq' },
            secondaryButton: { label: 'View Case Studies', href: '/contact' },
          },
        }),
        seo: {
          metaTitle: 'Kali MHS | Engineering Excellence in Bulk Material Handling',
          metaDescription: 'Robotic-enhanced intelligent conveyor systems and bulk handling solutions.',
        },
        createdBy: adminId,
      },

      // ── ABOUT PAGE ────────────────────────────────────────────────────────
      {
        title: 'About Page',
        slug: 'about-page',
        type: CMSContentType.PAGE,
        status: ContentStatus.PUBLISHED,
        content: JSON.stringify({
          hero: {
            badge: 'About Kali MHS',
            title: 'Built on a Legacy of',
            titleHighlight: 'Engineering Excellence',
            subtitle: 'Since 1972, Kali Material Handling Solutions has been at the forefront of designing, manufacturing, and deploying bulk material handling systems for the world\'s most demanding industries.',
            primaryButton: { label: 'Request a Quote', href: '/rfq' },
            secondaryButton: { label: 'Get in Touch', href: '/contact' },
          },
          stats: [
            { value: '50+', label: 'Years of Excellence' },
            { value: '500+', label: 'Projects Delivered' },
            { value: '30+', label: 'Countries Served' },
            { value: '98%', label: 'Client Satisfaction' },
          ],
          timeline: {
            badge: 'Our Journey',
            title: 'Five Decades of Innovation',
            items: [
              { year: '1972', title: 'Founded in Mumbai', desc: 'Kali MHS was established as a small fabrication unit specializing in conveyors for the local steel industry.' },
              { year: '1988', title: 'ISO 9001 Certification', desc: 'Awarded international quality certification, marking our transition into a global-grade manufacturer.' },
              { year: '2001', title: 'International Expansion', desc: 'Opened first overseas offices in the Middle East and Africa, serving major port and mining clients.' },
              { year: '2010', title: '300th Project Milestone', desc: 'Delivered the landmark 300th project — a fully automated stockyard for a 10MTPA steel plant.' },
              { year: '2019', title: 'Digital Engineering Division', desc: 'Launched R&D division for AI-assisted design, digital twin simulation, and IoT-enabled monitoring.' },
              { year: '2024', title: 'Global Footprint', desc: '500+ projects across 30 countries, with active operations across Asia, Africa, Europe, and the Americas.' },
            ],
          },
          leadership: {
            badge: 'Our People',
            title: 'The Minds Driving',
            titleHighlight: 'Kali MHS',
            members: [
              { name: 'Rajiv Kumar', role: 'Managing Director & CEO', bio: 'Visionary leader with 30+ years in industrial engineering and global operations management.' },
              { name: 'Priya Sharma', role: 'Chief Technology Officer', bio: 'Pioneering next-gen automation and materials science research across all product lines.' },
              { name: 'Arjun Mehta', role: 'VP Engineering', bio: 'Oversees 200+ engineers across 3 manufacturing hubs, delivering world-class fabrication quality.' },
              { name: 'Deepa Nair', role: 'Head of Global Sales', bio: 'Builds lasting partnerships across mining, cement, steel, and port sectors worldwide.' },
            ],
          },
          manufacturing: {
            badge: 'World-Class Infrastructure',
            title: 'Manufacturing at the',
            titleHighlight: 'Highest Standard',
            body: 'Our three state-of-the-art manufacturing hubs span over 250,000 sq. ft. of production floor space, equipped with CNC machining centres, automated welding lines, shot blasting chambers, and a dedicated testing facility for complete system simulation prior to client delivery.',
            capabilities: [
              'CNC Plasma and Laser Cutting',
              'Robotic Welding Stations',
              'Heavy Structural Fabrication up to 500T',
              'Full-System Pre-Delivery Testing',
              'In-House Surface Treatment & Painting',
            ],
            facilities: [
              'Mumbai HQ',
              'Pune Fabrication Hub',
              'Chennai Port Facility',
              'R&D Centre – Bangalore',
            ],
          },
          values: {
            badge: 'Standards & Certifications',
            title: 'Quality is Non-Negotiable',
            items: [
              { title: 'Engineering Excellence', desc: 'Every product is engineered to exceed international standards for reliability, safety, and efficiency.' },
              { title: 'Uncompromising Quality', desc: 'Rigorous ISO-certified testing protocols ensure every unit delivered performs at peak condition.' },
              { title: 'Global Perspective', desc: 'Our practice extends to all major continents, understanding each region\'s unique industrial needs.' },
              { title: 'Partnership First', desc: 'We embed ourselves in each client\'s operational reality to deliver truly bespoke solutions.' },
            ],
          },
          globalReach: {
            badge: 'Our Footprint',
            title: 'Operating Across',
            titleHighlight: '30+ Countries',
            body: 'From large-scale greenfield bulk terminals on the African coast to automated mine-to-port circuits in Southeast Asia, Kali MHS has the global experience to handle your most complex challenges.',
            regions: ['Asia Pacific', 'Middle East & Africa', 'Europe', 'The Americas'],
          },
          cta: {
            title: 'Ready to Partner with Us?',
            subtitle: 'Let\'s discuss how Kali MHS can engineer the perfect bulk material handling solution for your next project.',
            primaryButton: { label: 'Request a Quote', href: '/rfq' },
            secondaryButton: { label: 'Contact Us', href: '/contact' },
          },
        }),
        seo: {
          metaTitle: 'About Us | Kali MHS',
          metaDescription: 'Learn about Kali Material Handling Solutions — our history, leadership, manufacturing capabilities, and global reach across 50+ years of engineering excellence.',
        },
        createdBy: adminId,
      },

      // ── CONTACT PAGE ──────────────────────────────────────────────────────
      {
        title: 'Contact Page',
        slug: 'contact-page',
        type: CMSContentType.PAGE,
        status: ContentStatus.PUBLISHED,
        content: JSON.stringify({
          hero: {
            badge: 'Get In Touch',
            title: 'Let\'s Build',
            titleHighlight: 'Together',
            subtitle: 'Whether you have a new project in mind or need post-installation support, our global team is ready to help you find the right solution.',
          },
          form: {
            heading: 'Send Us an Enquiry',
            subheading: 'Our technical team typically responds within 24 hours on business days.',
            submitLabel: 'Send Enquiry',
            successTitle: 'Message Sent!',
            successMessage: 'Thank you for reaching out. We will respond to your enquiry within 24 business hours.',
          },
          offices: [
            {
              city: 'Mumbai',
              type: 'Global Headquarters',
              address: 'MIDC Industrial Area, Andheri East, Mumbai – 400093',
              phone: '+91 22 4000 1234',
              email: 'hq@kalimhs.com',
            },
            {
              city: 'Dubai',
              type: 'Middle East Regional Office',
              address: 'Jebel Ali Free Zone, Dubai, UAE',
              phone: '+971 4 800 5678',
              email: 'mea@kalimhs.com',
            },
            {
              city: 'Singapore',
              type: 'Asia Pacific Office',
              address: 'Jurong Industrial Estate, Singapore 629786',
              phone: '+65 6800 9012',
              email: 'apac@kalimhs.com',
            },
          ],
          businessHours: [
            'Monday – Friday: 9:00 AM – 6:00 PM IST',
            'Saturday: 9:00 AM – 1:00 PM IST',
          ],
          officesHeading: 'Our Offices',
          officesSubheading: 'Reach us at any of our global locations.',
        }),
        seo: {
          metaTitle: 'Contact Us | Kali MHS',
          metaDescription: 'Get in touch with Kali MHS at our global offices in Mumbai, Dubai, and Singapore.',
        },
        createdBy: adminId,
      },

      // ── CAREERS PAGE ──────────────────────────────────────────────────────
      {
        title: 'Careers Page',
        slug: 'careers-page',
        type: CMSContentType.PAGE,
        status: ContentStatus.PUBLISHED,
        content: JSON.stringify({
          hero: {
            title: 'Join Our Team',
            subtitle: 'We are always looking for talented individuals to help us build the future of bulk material handling and industrial infrastructure.',
          },
          filters: {
            searchPlaceholder: 'Search by role or keyword...',
            departmentLabel: 'Department',
            departments: ['All Departments', 'Sales', 'Engineering', 'Operations', 'Marketing', 'HR'],
          },
          emptyState: {
            heading: 'No open positions found.',
            subheading: 'Check back later or submit a general application.',
          },
        }),
        seo: {
          metaTitle: 'Careers | Kali MHS',
          metaDescription: 'Join our team at Kali MHS — explore open positions in engineering, sales, operations, and more.',
        },
        createdBy: adminId,
      },

      // ── RESOURCES PAGE ────────────────────────────────────────────────────
      {
        title: 'Resources Page',
        slug: 'resources-page',
        type: CMSContentType.PAGE,
        status: ContentStatus.PUBLISHED,
        content: JSON.stringify({
          hero: {
            title: 'Resource Library',
            subtitle: 'Access technical documentation, product catalogs, case studies, and more. Download resources to help with your projects.',
            searchPlaceholder: 'Search documents...',
          },
          emptyState: {
            noResults: 'Try adjusting your search terms',
            noDocuments: 'Check back later for new resources',
          },
        }),
        seo: {
        },
        createdBy: adminId,
      },
    ]);
    console.log('  ✅ CMS Pages seeded (5 pages: homepage, about, contact, careers, resources)');
  } else {
    console.log(`  ⏭️  Main CMS Pages already exist (${cmsCount}), skipping.`);
  }

  // Handle Global Configuration specially so we don't wipe out user edits if we added these late
  const navCount = await CMSPageModel.countDocuments({ slug: 'nav-links' });
  if (navCount === 0) {
    await CMSPageModel.create({
      title: 'Main Navigation',
      slug: 'nav-links',
      type: CMSContentType.PAGE,
      status: ContentStatus.PUBLISHED,
      content: JSON.stringify({
        links: [
          { label: 'Products', href: '/products' },
          { label: 'Projects', href: '/projects' },
          { label: 'About', href: '/about' },
          { label: 'Resources', href: '/resources' },
          { label: 'Careers', href: '/careers' },
        ]
      }),
      seo: { metaTitle: 'Navigation Configuration', metaDescription: 'Internal global navigation configuration.' },
      createdBy: adminId,
    });
    console.log('  ✅ CMS Page \'nav-links\' seeded');
  }

  const footerCount = await CMSPageModel.countDocuments({ slug: 'footer' });
  if (footerCount === 0) {
    await CMSPageModel.create({
      title: 'Global Footer',
      slug: 'footer',
      type: CMSContentType.PAGE,
      status: ContentStatus.PUBLISHED,
      content: JSON.stringify({
        tagline: 'Engineering Excellence in Bulk Material Handling',
        copyright: '2024 Kali Material Handling Solutions. All rights reserved.',
        columns: [
          {
            heading: 'Quick Links',
            links: [
              { label: 'Our Products', href: '/products' },
              { label: 'Global Projects', href: '/projects' },
              { label: 'About Us', href: '/about' },
            ]
          },
          {
            heading: 'Information',
            links: [
              { label: 'Resource Library', href: '/resources' },
              { label: 'Careers', href: '/careers' },
              { label: 'Contact Us', href: '/contact' },
            ]
          }
        ]
      }),
      seo: { metaTitle: 'Footer Configuration', metaDescription: 'Internal global footer configuration.' },
      createdBy: adminId,
    });
    console.log('  ✅ CMS Page \'footer\' seeded');
  }


  console.log('\n🎉 Seeding complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
