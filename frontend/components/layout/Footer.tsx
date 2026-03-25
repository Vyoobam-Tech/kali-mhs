import Link from "next/link";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getCMSFooter() {
  try {
    const res = await fetch(`${API_URL}/cms/slug/footer`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const content = json?.data?.page?.content;
    return content ? JSON.parse(content) : null;
  } catch {
    return null;
  }
}

export async function Footer() {
  const cms = await getCMSFooter();

  const tagline =
    cms?.tagline ??
    "Engineering excellence in bulk material handling. Premium manufacturing of intelligent conveyor systems and industrial solutions globally.";
  const copyright =
    cms?.copyright ??
    "2024 Kali Material Handling Solutions. All rights reserved.";

  const defaultColumns = [
    {
      heading: "Products",
      links: [
        { label: "Belt Conveyor Systems", href: "/products" },
        { label: "Bulk Material Handling", href: "/products" },
        { label: "Pneumatic Systems", href: "/products" },
        { label: "Mobile Equipment", href: "/products" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Projects", href: "/projects" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  const columns = cms?.columns ?? defaultColumns;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="inline-block hover:opacity-90 flex items-center space-x-2 font-black text-2xl tracking-tighter mb-6"
            >
              <span className="text-primary text-3xl">kali</span>
              <span className="text-white text-sm font-bold tracking-widest mt-1">
                MHS
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">{tagline}</p>
          </div>

          {/* Dynamic Columns */}
          {columns.map((col: any) => (
            <div key={col.heading}>
              <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                {col.heading}
              </h3>
              <ul className="space-y-3 text-sm font-medium text-slate-400">
                {col.links.map((link: any) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect Column (Static for now as it contains specific SVG layout styling) */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
              Connect
            </h3>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <a href="#" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 font-medium">
          <div>
            ©{" "}
            {copyright.includes("2024")
              ? copyright
              : `${new Date().getFullYear()} ${copyright}`}
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
