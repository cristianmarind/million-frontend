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
    <div className="px-5 py-1 flex justify-between items-center">
      <a href="/">
        <Image
          src="/logo.avif"
          alt="Casa moderna en la ciudad"
          width={200}
          height={90}
          loading="eager"
        />
      </a>


      <nav>
        <ul className="flex gap-10 mt-2">
          {
            menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))
          }
        </ul>
      </nav>
    </div>
  );
}
