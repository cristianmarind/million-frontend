'use client'
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Who we are", href: "/who-we-are" },
  { label: "Contact us", href: "/contact-us" },
];

export default function Header() {
  return (
    <header className="px-4 mx-0">
      <div className="row">
        <div className="col-12 col-md-4 mb-3 mt-1 d-flex align-items-center justify-content-center justify-content-md-start">
          <Link href="/">
            <Image
              src="/logo.avif"
              alt="Casa moderna en la ciudad"
              width={200}
              height={90}
              loading="eager"
              className="h-auto"
            />
          </Link>
        </div>
        <div className="col-12 col-md-8 mb-3 d-flex align-items-center justify-content-center justify-content-md-end">
          <nav>
            <ul className="d-flex gap-4 mt-2 list-unstyled mb-0">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-decoration-none text-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

      </div>
    </header>
  );
}
