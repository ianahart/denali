import { useContext, useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
import { IUserContext } from '../../interfaces';
interface Props {
  children: JSX.Element;
}

const RequireAdmin: React.FC<Props> = ({ children }): JSX.Element => {
  const location = useLocation();
  const { user } = useContext(UserContext) as IUserContext;

  const isSuperUser = localStorage.getItem('is_superuser');

  if (isSuperUser) {
    return children;
  } else {
    return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
};

export default RequireAdmin;
