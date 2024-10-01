import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { NavDropdown } from 'react-bootstrap';
import styled from 'styled-components';

const Theme = {
  fontPrimary: "'Poppins', sans-serif",
  fontSecondary: "'Playfair Display', serif",
  primary: '#C9A86A', // Muted gold
  secondary: '#8A7968', // Warm taupe
  accent: '#D64C31', // Deep coral
  background: '#0F1419', // Rich dark blue-gray
  surface: '#1E2328', // Slightly lighter blue-gray
  text: '#F2F2F2', // Off-white
  textDark: '#A0A0A0', // Medium gray
};

const NavbarContainer = styled.nav`
  background-color: ${Theme.surface};
  padding: 15px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50px;
  z-index: 1000;
  width: 95%;
  max-width: 1200px;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: ${Theme.primary};
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  padding-left:3px;
  font-family: ${Theme.fontSecondary};
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${Theme.primary};
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 991px) {
    display: block;
  }
`;

const MenuItems = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 991px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${Theme.surface};
    padding: 20px;
    border-radius: 0 0 20px 20px;
  }
`;

const commonFontStyles = `
  font-size: ${Theme.fontPrimary};
  font-family: ${Theme.fontPrimary};
  font-weight: 500;
  color: ${Theme.text};
`;

const StyledNavDropdown = styled(NavDropdown)`
   .dropdown-toggle {
     ${commonFontStyles}
     padding: 10px; 
     transition: .3s; 

     &:hover {
       color: ${Theme.primary} !important; 
     }
   }

   .dropdown-menu {
     background-color: ${Theme.surface}; 
     border: none; 
     border-radius: .25rem; 
     padding: .5rem; 
   }

   .dropdown-item {
     ${commonFontStyles}
     transition: .3s; 

     &:hover {
       background-color: ${Theme.primary}; 
       color: ${Theme.background}; 
     }
   }
`;

const NavLink = styled(Link)`
  ${commonFontStyles}
  text-decoration: none;
  padding: 10px 15px;
  transition: color 0.3s;

  &:hover {
    color: ${Theme.primary};
  }
`;

const ContactButton = styled(Link)`
   background-color:${Theme.primary}; 
   color:${Theme.background}; 
   padding:.5rem; 
   border-radius:.25rem; 
   text-decoration:none; 

   &:hover {
       background-color:${Theme.accent}; 
       color:${Theme.text}; 
   }
`;

const Navbar = ({ history })  => {
  const isLoggedIn = !!sessionStorage.getItem('userData');

   const [isOpen, setIsOpen] = useState(false);
   const [width, setWidth] = useState(window.innerWidth);

   const updateWidth = () => {
       const newWidth = window.innerWidth;
       setWidth(newWidth);
       if (isOpen && newWidth > 991) {
           setIsOpen(false);
       }
   };

   useEffect(() => {
       window.addEventListener("resize", updateWidth);
       return () => window.removeEventListener("resize", updateWidth);
   }, []);

   const toggleNav = () => setIsOpen(!isOpen);

   // Retrieve user data from local storage
   const userData = JSON.parse(sessionStorage.getItem('userData'));
   const isAdmin = userData ? userData.isAdmin : false;

   const handleClick = () => {
      const userData = sessionStorage.getItem('userData');

      if (userData) {
          // User is logged in, navigate to create-campaign
          window.location.href = '/create-campaign';
      } else {
          // User is not logged in, redirect to login
          window.location.href = '/login';
      }
    };

   const handleLogout = () => {
      // Remove userData from sessionStorage
      sessionStorage.removeItem('userData');
      
      // Redirect to home page
      history.push('/');
    };

   return (
       <NavbarContainer>
           <NavContent>
               <Logo to="/">DONATION</Logo>
               <MenuButton onClick={toggleNav}>☰</MenuButton>
               <MenuItems isOpen={isOpen}>
                   <NavLink to="/">Home</NavLink>
                   <NavLink to="#" onClick={handleClick}>Start a Fundraiser</NavLink>
                   <NavLink to="/donate">Donate</NavLink>
                   {/* Conditionally render Review Campaigns link */}
                   {isAdmin && <NavLink to="/reviewCampaigns">Review Campaigns</NavLink>}
                   <NavLink to="/News">News</NavLink>
                   <StyledNavDropdown title="Campaign Search" id="charity-nav-dropdown">
                       <NavDropdown.Item as={Link} to="/Map">By Map</NavDropdown.Item>
                       <NavDropdown.Item as={Link} to="/Search">By Name</NavDropdown.Item>
                   </StyledNavDropdown>
                   <StyledNavDropdown title={sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')).name : 'Account'} id="account-nav-dropdown">
                        {/* Check if userData is present in sessionStorage */}
                        {sessionStorage.getItem('userData') ? (
                            // User is logged in, show Logout option
                            <React.Fragment>
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </React.Fragment>
                        ) : (
                            // User is not logged in, show Sign Up and Login options
                            <React.Fragment>
                                <NavDropdown.Item as={Link} to="/sign-up">Sign Up</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                            </React.Fragment>
                        )}
                    </StyledNavDropdown>
                   <ContactButton to="/contact">Contact</ContactButton>
               </MenuItems>
           </NavContent>
       </NavbarContainer>
   );
};

export default withRouter(Navbar);