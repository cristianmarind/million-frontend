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
    <div className="px-4 py-2 d-flex justify-content-between align-items-center">
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
  );
}
