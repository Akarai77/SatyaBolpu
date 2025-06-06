import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const {isLoading} = useLoading();
  const {token} = useAuth();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflowY = 'hidden';
      document.body.setAttribute("data-lenis-prevent", "true");
    } else {
      document.body.style.overflowY = 'auto';
    }

    return () => {
      document.body.style.height = '';
      document.body.style.overflowY = '';
    };
  }, [isMenuOpen]);

  const NavLinks = () => {
    return (
      <div className={`flex flex-col text-xl font-semibold absolute lg:relative top-0 lg:flex-row items-center justify-center h-screen lg:h-auto gap-5`}>
        <NavLink
          style={{textShadow: '1px 1px 6px black'}}
          className={`link transition-all duration-200 hover:scale-110 hover:text-primary ${location.pathname === '/' ? 'text-primary' : ''}`}
          to="/"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          style={{textShadow: '1px 1px 6px black'}}
          className={`link transition-all duration-200 hover:scale-110 hover:text-primary ${location.pathname === '/explore' ? 'text-primary' : ''}`}
          to="/explore"
          onClick={() => setIsMenuOpen(false)}
        >
          Explore
        </NavLink>
        <NavLink
          style={{textShadow: '1px 1px 6px black'}}
          className={`link transition-all duration-200 hover:scale-110 hover:text-primary ${location.pathname === '/map' ? 'text-primary' : ''}`}
          to="/map"
          onClick={() => setIsMenuOpen(false)}
        >
          Map
        </NavLink>
      </div>
    );
  };

  return (
    <>
      <nav className={`navbar z-[9999] text-white w-screen flex p-7 items-center justify-between ${location.pathname === '/' ? 'absolute bg-transparent' : 'relative bg-black'}`}>
        <div className="brand flex gap-2 items-center justify-center">
          <NavLink to="/">
            <img src="/assets/logoen.png" alt="logo" className="logo w-14 aspect-square" />
          </NavLink>
          <NavLink to="/" style={{textShadow: '1px 1px 6px black'}}>
            <h1 className="text-2xl sm:text-3xl font-bold">SatyaBolpu</h1>
          </NavLink>
        </div>
          
        <div className='flex gap-1 sm:gap-3 font-semibold items-center justify-center'>
          <div className='lg:hidden text-sm sm:text-xl auth flex bg-black rounded-3xl overflow-hidden cursor-pointer'>
            <div className='hover:bg-primary p-2 pl-3'>
              Log In
            </div>
            <div className='hover:bg-primary p-2 pr-3'>
              Sign Up
            </div>
          </div>
          {isMenuOpen ? (
              <MdOutlineHorizontalRule
                size="35px"
                className="lg:hidden hover:text-primary cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              />
            ) : (
              <MdOutlineMenu
                size="35px"
                className="lg:hidden hover:text-primary cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
              />
            )}
        </div>

        <div className='hidden links lg:flex gap-5 font-semibold items-center justify-center text-xl'>
          <NavLinks />
          <div className='hidden auth lg:flex gap-2 bg-black rounded-3xl overflow-hidden cursor-pointer'>
            <div className='hover:bg-primary p-2 pl-3'>
              Log In
            </div>
            <div className='hover:bg-primary p-2 pr-3'>
              Sign Up
            </div>
          </div>
        </div>
      </nav>
      <div
        className={`links lg:hidden text-xl font-semibold text-white text-center bg-black h-0 w-screen overflow-hidden flex flex-col items-center justify-center gap-3 absolute right-0 z-10 transition-all duration-500 ${
          isMenuOpen ? 'h-screen' : ''
        }`}
        ref={menuRef}
      >
        <NavLinks />
      </div>
    </>
  );
};

export default Navbar;
