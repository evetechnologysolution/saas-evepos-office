import PropTypes from 'prop-types';
import React, { createContext, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from '../utils/axios';

export const mainContext = createContext({
  socket: null,
  setSocket: () => {},
  allNotif: null,
});

const MainContextProvider = ({ children }) => {
  const client = useQueryClient();
  const [socket, setSocket] = useState(null);

  const allNotif = null;
  // Fetch notification
  // const { data: allNotif } = useQuery(
  //   ['allNotif'],
  //   async () => {
  //     const res = await axios.get('/notification/all');
  //     return res.data;
  //   },
  //   {
  //     refetchOnWindowFocus: false, // Prevents refetch on window focus
  //   }
  // );

  return (
    <mainContext.Provider
      value={{
        socket,
        setSocket,
        allNotif,
      }}
    >
      {children}
    </mainContext.Provider>
  );
};

export default MainContextProvider;

// ----------------------------------------------------------------------

MainContextProvider.propTypes = {
  children: PropTypes.node,
};
