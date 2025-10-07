import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import logoLM from '../assets/logo_lm_branco.png';



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

    <header className="shadow-lg" style={{ backgroundColor: '#ff7e82' }}>

      {/* Logo and Navigation Section */}

      <div className="border-b border-white border-opacity-20">

        <div className="container mx-auto px-4 py-4">

          {/* Logo com imagem real do assets */}

          <div className="flex justify-center mb-6">

            <Link to="/" className="block">

              <img 

                src={logoLM} 

                alt="Logo Liberdade Médica" 

                className="h-auto w-auto object-contain hover:opacity-90 transition-opacity duration-300"

                style={{ 

                  maxHeight: '70px',

                  maxWidth: '200px'

                }}

              />

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

                      className="text-white hover:text-gray-100 font-medium transition-colors duration-300 capitalize relative group text-lg"

                      onClick={(e) => e.preventDefault()}

                    >

                      {item.label}

                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>

                    </a>

                  ) : (

                    <Link 

                      to={item.path}

                      className="text-white hover:text-gray-100 font-medium transition-colors duration-300 capitalize relative group text-lg"

                    >

                      {item.label}

                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>

                    </Link>

                  )}

                </li>

              ))}

            </ul>

          </nav>

        </div>

      </div>

    </header>

  );

};



export default Header;