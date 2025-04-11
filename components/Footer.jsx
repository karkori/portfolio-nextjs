import { quickLinks, servicesLinks } from "@/lib/data";
import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date()?.getFullYear();
  
  // En Tailwind CSS v4, usamos CSS personalizado inline para modo claro/oscuro
  const footerStyle = {
    backgroundColor: theme === 'light' ? '#1f2937' : 'var(--third)', // Fondo más oscuro en modo claro
    color: '#ffffff'
  };

  return (
    <footer className="py-12" style={footerStyle}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-6">
              <span className="text-teal-500">Mostapha</span>
              <span className="text-white">.dev</span>
            </h3>
            <p className="text-gray-200 mb-6">
              Fullstack developer specialized in backend systems, web technologies, 
              and cloud solutions. Helping businesses build reliable and scalable digital products.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/karkori"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-teal-500 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <span className="text-2xl">🐙</span>
              </Link>
              <Link
                href="https://linkedin.com/in/mostapha-bourarach"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-teal-500 transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <span className="text-2xl">🔗</span>
              </Link>
              <Link
                href="https://coding.ma"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-teal-500 transition-colors"
              >
                <span className="sr-only">Blog</span>
                <span className="text-2xl">🌐</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-teal-400">Navigation</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-gray-200 hover:text-teal-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-teal-400">My Services</h4>
            <ul className="space-y-2">
              {servicesLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-gray-200 hover:text-teal-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-teal-400">Contact Me</h4>
            <p className="text-gray-200 mb-4">
              Interested in working together? Feel free to reach out.
            </p>
            <Link
              href="mailto:femtonet.email@gmail.com"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-colors font-medium"
            >
              <span className="mr-2">📧</span>
              <span>Send Email</span>
            </Link>
            <div className="mt-4 text-gray-200">
              <p><span className="font-medium">Email:</span> femtonet.email@gmail.com</p>
              <p className="mt-1"><span className="font-medium">Response Time:</span> Within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-200">
          <p>&copy; {currentYear} Mostapha Bourarach. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;