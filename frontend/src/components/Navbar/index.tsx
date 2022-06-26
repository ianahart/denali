import { Box, Heading, UnorderedList } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link as RouterLink } from 'react-router-dom';
import MenuItems from './MenuItems';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  const handleMobileOpen = () => setMobileOpen((prevState) => !prevState);

  const handleResize = (event: Event) => {
    const target = event.target as Window;
    setInnerWidth(target.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.addEventListener('resize', handleResize);
  }, []);

  return (
    <Box
      bg="black.secondary"
      width="100%"
      className={
        innerWidth < 599 ? (mobileOpen ? 'mobile-nav' : 'regular-nav') : 'regular-nav'
      }
    >
      <Box>
        <Box
          display="flex"
          justifyContent={['space-between', 'space-between', 'center']}
          p="0.5rem"
        >
          <RouterLink to="/">
            <Heading fontFamily="cursive" fontSize="2rem" color="#FFF">
              Denali
            </Heading>
          </RouterLink>
          <Box
            onClick={handleMobileOpen}
            cursor="pointer"
            display={['block', 'block', 'none']}
          >
            <GiHamburgerMenu color="#FFF" fontSize="2.2rem" />
          </Box>
          <UnorderedList
            width="100%"
            display={['none', 'none', 'flex']}
            justifyContent="space-evenly"
            alignItems="center"
            listStyleType="none"
            p="0"
          >
            <MenuItems />
          </UnorderedList>
        </Box>
        {mobileOpen && (
          <UnorderedList
            width="100%"
            flexDir="column"
            display={['flex', 'flex', 'none']}
            justifyContent="space-evenly"
            alignItems="center"
            margin="0 auto"
            listStyleType="none"
            p="0"
          >
            <MenuItems />
          </UnorderedList>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
