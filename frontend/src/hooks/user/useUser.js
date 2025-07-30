// hooks/user/useUser.js
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

export const useUser = () => {
  const { user } = useContext(UserContext);
  return user;
};
