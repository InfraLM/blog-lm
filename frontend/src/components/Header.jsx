import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Início", path: "/" },
    { label: "Cursos", path: "#" },
    { label: "Blog", path: "/blog" },
    { label: "Newsletter", path: "/artigos" },
    { label: "Produtos", path: "#" },
    { label: "Sobre Nós", path: "#" }
  ];

  return (
    <header className="bg-white shadow-lg">
      {/* Logo and Navigation Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          {/* Logo placeholder */}
          <div className="flex justify-center mb-6">
            <Link to="/" className="block">
              <div className="w-48 h-16 bg-gradient-to-r from-[#f03b40] to-red-600 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
                <span className="text-white font-bold text-xl">LOGO</span>
              </div>
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav>
            <ul className="flex justify-center gap-8 lg:gap-12">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.path === "#" ? (
                    <a 
                      href="#" 
                      className="text-gray-700 hover:text-[#f03b40] font-medium transition-colors duration-300 capitalize relative group text-lg"
                      onClick={(e) => e.preventDefault()}
                    >
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f03b40] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ) : (
                    <Link 
                      to={item.path}
                      className="text-gray-700 hover:text-[#f03b40] font-medium transition-colors duration-300 capitalize relative group text-lg"
                    >
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f03b40] transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ backgroundColor: '#f03b40' }} className="text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left side - Main copy */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-normal text-white mb-2">
                Conteúdos que você precisa baseados em evidências científicas.
              </h1>
              <div className="bg-black text-white px-2 py-1 inline-block">
                <p className="text-xl lg:text-2xl font-medium">
                  Feito para quem não pode errar.
                </p>
              </div>
            </div>

            {/* Right side - Statistics (hidden on mobile) */}
            <div className="flex items-center gap-8 max-[767px]:hidden">

              {/* Divider line */}
              <div className="w-px h-16 bg-white bg-opacity-30"></div>
              
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  1 milhão
                </p>
                <p className="text-sm lg:text-base text-white opacity-90">
                  de vidas salvas<br />
                  nos próximos<br />
                  10 anos
                </p>
              </div>

              {/* Divider line */}
              <div className="w-px h-16 bg-white bg-opacity-30"></div>

              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  + 12 mil
                </p>
                <p className="text-sm lg:text-base text-white opacity-90">
                  assinantes em<br />
                  nossa newsletter
                </p>
              </div>

              {/* Divider line */}
              <div className="w-px h-16 bg-white bg-opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
