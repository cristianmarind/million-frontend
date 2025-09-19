import { MapPinHouse, Mail, Smartphone, Facebook, Instagram, Linkedin } from "lucide-react";

const settings = {
  companyName: "InDise Arquitectura",
  basicInfo: [
    {
      label: "Address",
      value: "Circular 3  #66 B- 46",
      icon: MapPinHouse,
    },
    {
      label: "Email",
      value: "Direccióncomercialindise@gmail.com",
      icon: Mail,
    },
    {
      label: "Cellphone",
      value: "301 398 94 77",
      icon: Smartphone,
    },
  ],
  socialNetworks: [
    { label: "Facebook", href: "https://facebook.com", icon: Facebook },
    { label: "Instagram", href: "https://instagram.com", icon: Instagram },
    { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  ],
};

export default function Header() {
  return (
    <div className="pb-5">
      <div className="text-center">
        {settings.companyName}
      </div>
      <div className="flex justify-center">
        <nav>
          <ul className="flex gap-10 mt-2">
            {
              settings.basicInfo.map((item) => (
                <li key={item.label} className="flex">
                  <item.icon className="w-5 h-5 text-gray-600 mr-1" />
                  {item.value}
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
      <div className="flex justify-center">
        <nav>
          <ul className="flex gap-10 mt-2">
            {
              settings.socialNetworks.map((item) => (
                <li key={item.label} className="flex">
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <item.icon className="w-5 h-5 text-gray-600 mr-1" />
                  </a>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </div>
  );
}
