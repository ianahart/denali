import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useCallback } from 'react';

interface IUserMenuContainerProps {
  children?: React.ReactNode;
  setUserMenuOpen: (userMenuOpen: boolean) => void;
  userMenuOpen: boolean;
}

const UserMenuContainer = ({
  children,
  setUserMenuOpen,
  userMenuOpen,
}: IUserMenuContainerProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const clickAway = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.target as Element;
      if (menuRef.current !== null) {
        if (!menuRef.current.contains(target) && target.id !== 'trigger') {
          setUserMenuOpen(false);
        }
      }
    },
    [setUserMenuOpen]
  );

  useEffect(() => {
    document.addEventListener('click', clickAway);
    return () => document.removeEventListener('click', clickAway);
  }, [clickAway]);

  return (
    <Box
      ref={menuRef}
      top={['220px', '200px', '65px']}
      right={['55px', '150px', '200px']}
      position="absolute"
      width="300px"
      zIndex="5"
      minH="350px"
      border="1px solid"
      borderColor="#e7ebe7"
      boxShadow="md"
      bg="#FFF"
      borderRadius="md"
    >
      {children}
    </Box>
  );
};

export default UserMenuContainer;
