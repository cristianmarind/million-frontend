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

export default function Footer() {
  return (
    <div className="page-footer pb-5 mt-5">
      <div className="text-center">
        {settings.companyName}
      </div>
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="d-flex gap-4 mt-2 list-unstyled">
            {
              settings.basicInfo.map((item) => (
                <li key={item.label} className="d-flex align-items-center">
                  <item.icon className="me-2" style={{ width: '20px', height: '20px' }} />
                  {item.value}
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="d-flex gap-4 mt-2 list-unstyled">
            {
              settings.socialNetworks.map((item) => (
                <li key={item.label} className="d-flex align-items-center">
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-light">
                    <item.icon style={{ width: '20px', height: '20px' }} />
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
