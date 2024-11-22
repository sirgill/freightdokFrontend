import React, { createContext, useContext, useState } from 'react';

const CacheContext = createContext();

export const CacheProvider = ({ children }) => {
    const [cache, setCache] = useState({});

    return (
        <CacheContext.Provider value={{ cache, setCache }}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = () => useContext(CacheContext);