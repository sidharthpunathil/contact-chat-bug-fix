import React, { useState } from 'react';

export const MyContactContext = React.createContext();

function ContextShare({ children }) {
  const [contacts, setContacts] = useState([]);
  

  return (
    <MyContactContext.Provider value={{ contacts, setContacts }}>
      {children}
    </MyContactContext.Provider>
  );
}

export default ContextShare;