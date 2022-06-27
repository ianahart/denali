import { useContext } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
import { retreiveTokens } from '../../helpers/utils';
import { IUserContext } from '../../interfaces';
interface Props {
  children: JSX.Element;
}

const RequireGuest: React.FC<Props> = ({ children }): JSX.Element => {
  const location = useLocation();
  const guestRoutes = ['/login', '/create-account', 'forgot-password'];
  const storage = retreiveTokens();
  if (storage === undefined && guestRoutes.includes(location.pathname)) {
    return children;
  } else {
    return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
};

export default RequireGuest;
