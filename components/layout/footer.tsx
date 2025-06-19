import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">FinansNorge</h3>
            <p className="text-gray-300 text-sm mb-4">
              Norges ledende kilde for finansnyheter, markedsanalyse og økonomisk innsikt.
            </p>
            <div className="flex space-x-4">
              <Twitter className="text-gray-400 hover:text-white cursor-pointer h-5 w-5" />
              <Linkedin className="text-gray-400 hover:text-white cursor-pointer h-5 w-5" />
              <Facebook className="text-gray-400 hover:text-white cursor-pointer h-5 w-5" />
              <Instagram className="text-gray-400 hover:text-white cursor-pointer h-5 w-5" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hurtiglenker</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/oslo-bors" className="text-gray-300 hover:text-white">
                  Oslo Børs
                </Link>
              </li>
              <li>
                <Link href="/krypto" className="text-gray-300 hover:text-white">
                  Kryptovaluta
                </Link>
              </li>
              <li>
                <Link href="/analyse" className="text-gray-300 hover:text-white">
                  Markedsanalyse
                </Link>
              </li>
              <li>
                <Link href="/valuta" className="text-gray-300 hover:text-white">
                  Valutakurser
                </Link>
              </li>
              <li>
                <Link href="/okonomi" className="text-gray-300 hover:text-white">
                  Økonomiske indikatorer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ressurser</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guider" className="text-gray-300 hover:text-white">
                  Investeringsguider
                </Link>
              </li>
              <li>
                <Link href="/leksikon" className="text-gray-300 hover:text-white">
                  Finansleksikon
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-300 hover:text-white">
                  API-dokumentasjon
                </Link>
              </li>
              <li>
                <Link href="/rss" className="text-gray-300 hover:text-white">
                  RSS-feeder
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-gray-300 hover:text-white">
                  Mobilapp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300 flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                redaksjon@finansnorge.no
              </li>
              <li className="text-gray-300 flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                +47 22 00 00 00
              </li>
              <li className="text-gray-300 flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Oslo, Norge
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FinansNorge. Alle rettigheter forbeholdt.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/personvern" className="text-gray-400 hover:text-white text-sm">
                Personvern
              </Link>
              <Link href="/vilkar" className="text-gray-400 hover:text-white text-sm">
                Vilkår
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
                Cookie-policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
