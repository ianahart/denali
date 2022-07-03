import { Input, Box, Image, Text, Button } from '@chakra-ui/react';
import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { debounce } from 'lodash';
import { Link as RouterLink } from 'react-router-dom';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { ISearchItem, ISearchResponse, IUserContext } from '../../interfaces';
import { UserContext } from '../../context/user';
const Search = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [items, setItems] = useState<ISearchItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const clickAway = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    if (dropdownRef.current !== null) {
      if (!dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debounceSearch(e.target.value);
  };

  const debounceSearch = useCallback(
    debounce((value) => applySearch(value), 200),
    []
  );

  const applySearch = async (searchTerm: string) => {
    try {
      setDropdownOpen(true);
      if (searchTerm.trim().length === 0) {
        setDropdownOpen(false);
        return;
      }

      setItems([]);
      const response = await http.post<ISearchResponse>('/items/search/', {
        search_term: searchTerm,
        page: 0,
      });
      setItems((prevState) => [...prevState, ...response.data.items]);
      setHasNextPage(response.data.has_next);
      setPage(response.data.page);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 400) {
          setSearchValue(err.response.data.search_term);
        } else if (err.response.status === 404) {
          setSearchValue(err.response.data.errors);
        }
      }
    }
  };

  const loadMoreItems = async () => {
    try {
      const response = await http.post<ISearchResponse>('/items/search/', {
        search_term: searchValue,
        page,
      });
      setItems((prevState) => [...prevState, ...response.data.items]);
      setHasNextPage(response.data.has_next);
      setPage(response.data.page);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const saveItemSearch = async (itemId: number) => {
    try {
      setDropdownOpen(false);
      if (!user.logged_in || (user.logged_in && user.is_superuser)) return;
      const response = await http.post('/searches/', { item: itemId, user: user.id });
      console.log(response);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        return;
      }
    }
  };

  return (
    <Box width="50%" position="relative">
      <Box color="#FFF" width="100%">
        <Input
          onChange={handleOnChange}
          value={searchValue}
          border="1px solid"
          borderColor="purple.primary"
          color="#FFF"
          width="100%"
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          top="1px"
          height="38px"
          width="38px"
          borderRadius="4px"
          zIndex="3"
          right="1px"
          bg="purple.primary"
          position="absolute"
        >
          <AiOutlineSearch fontSize="2rem" />
        </Box>
      </Box>
      {dropdownOpen && (
        <Box
          borderRadius="md"
          boxShadow="md"
          ref={dropdownRef}
          className="overflow-scroll"
          color="#FFF"
          width="100%"
          bg="rgba(0, 0, 0, 0.9)"
          height="200px"
          position="absolute"
          overflowY="auto"
        >
          <Box>
            {items.map((item) => {
              return (
                <RouterLink
                  onClick={() => saveItemSearch(item.id)}
                  key={item.id}
                  to={`/items/${item.id}`}
                >
                  <Box borderBottom="1px solid #2d2d2e" my="0.5rem">
                    <Box p="0.5rem" display="flex" alignItems="center">
                      <Image
                        width="50px"
                        height="50px"
                        borderRadius="md"
                        src={item.product_url}
                      />
                      <Box ml="0.5rem" flexDir="column" display="flex">
                        <Text>{item.name}</Text>
                        <Text>{item.exerpt}</Text>
                      </Box>
                    </Box>
                  </Box>
                </RouterLink>
              );
            })}
            {hasNextPage && (
              <Box display="flex" justifyContent="center">
                <Button
                  onClick={loadMoreItems}
                  color="purple.primary"
                  _hover={{ bg: 'none', opacity: 0.6 }}
                  _active={{ bg: 'none' }}
                  bg="none"
                >
                  Load more...
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Search;
