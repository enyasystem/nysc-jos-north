import { Flag, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/resources", label: "Resources" },
    { href: "/admin", label: "Admin Portal" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="py-16" data-testid="main-footer" style={{ background: 'linear-gradient(180deg, var(--admin-deep-sea), var(--admin-deep-sea-700))', color: 'var(--admin-foreground)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">NYSC Jos North</h3>
                <p className="text-white/85 text-sm">Official Biodata Platform</p>
              </div>
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              Empowering corps members with a modern, secure biodata platform and strong community engagement in Jos North LGA.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center hover:bg-white/20 transition-colors"
                  data-testid={`social-link-${social.label.toLowerCase()}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white/90" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`footer-link-${link.label.toLowerCase().replace(' ', '-')}`}>
                  <span className="block text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3" data-testid="contact-address">
                <MapPin className="w-5 h-5 text-white/70" />
                <span className="text-white/80 text-sm">Jos North LGA, Plateau State</span>
              </div>
              <div className="flex items-center space-x-3" data-testid="contact-phone">
                <Phone className="w-5 h-5 text-white/70" />
                <span className="text-white/80 text-sm">+234 803 XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3" data-testid="contact-email">
                <Mail className="w-5 h-5 text-white/70" />
                <span className="text-white/80 text-sm">info@nyscjosnorth.gov.ng</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm" data-testid="copyright">
            © 2024 NYSC Jos North. All rights reserved.
          </p>
          <p className="text-white/60 text-sm mt-4 md:mt-0" data-testid="powered-by">
            Powered by Jos North ICT CDS
          </p>
        </div>
      </div>
    </footer>
  );
}
