import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RouterContext = createContext();

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [currentSearch, setCurrentSearch] = useState(() => window.location.search || '');
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '');

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentSearch(window.location.search || '');
      setCurrentHash(window.location.hash || '');
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = useCallback((to, options = {}) => {
    if (!to) return;
    
    // External link
    if (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:') || to.startsWith('tel:')) {
      window.location.href = to;
      return;
    }

    if (to.startsWith('#')) {
      window.location.hash = to;
      setCurrentHash(to);
      return;
    }

    if (options.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }

    setCurrentPath(window.location.pathname || '/');
    setCurrentSearch(window.location.search || '');
    setCurrentHash(window.location.hash || '');

    if (!options.keepScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Simple route matcher helper
  // pattern: e.g. '/collections/:slug' or '/products/:id' or '/checkout/success/:id'
  const matchRoute = useCallback((pattern) => {
    const patternParts = pattern.split('/').filter(Boolean);
    const currentParts = currentPath.split('/').filter(Boolean);

    if (patternParts.length !== currentParts.length) {
      return { isMatch: false, params: {} };
    }

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = decodeURIComponent(currentParts[i]);
      } else if (patternParts[i] !== currentParts[i]) {
        return { isMatch: false, params: {} };
      }
    }

    return { isMatch: true, params };
  }, [currentPath]);

  const queryParams = new URLSearchParams(currentSearch);

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        currentSearch,
        currentHash,
        queryParams,
        navigate,
        matchRoute
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const Link = ({ to, children, className, style, onClick, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (
      !e.defaultPrevented &&
      e.button === 0 && // left click only
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      props.target !== '_blank'
    ) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} className={className} style={style} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};
