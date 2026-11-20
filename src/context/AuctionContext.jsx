import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  getStoredCart,
  setStoredCart,
  getStoredWatchlist,
  setStoredWatchlist
} from '../utils/storage';
import {
  getStoredStripeConfig,
  setStoredStripeConfig
} from '../utils/stripeHelper';
import { WAREHOUSE_PICKUP_DETAILS } from '../utils/barcodeHelper';
import { dispatchLiveEmailInvoice, openMailClientWithInvoice } from '../utils/emailService';
import {
  fetchProductsFromDB,
  bulkUploadProductsToDB,
  createOrderInDB,
  fetchOrdersFromDB,
  lookupOrderFromDB,
  clearCatalogInDB,
  fetchSettingsFromDB,
  saveSettingsToDB,
  registerUser,
  loginUser,
  getMe,
  forgotPasswordApi,
  resetPasswordApi,
  createProductInDB,
  updateProductInDB,
  deleteProductInDB,
  fetchUsersFromDB,
  holdProductInDB,
  createOfferInDB,
  subscribeDropAlerts
} from '../services/api';
import { useNotification } from './NotificationContext';

const AuctionContext = createContext();

export const AuctionProvider = ({ children }) => {
  const { showSuccess, showAlert, showInfo } = useNotification();

  // Core Data (Driven by MongoDB)
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState(() => getStoredCart());
  const [watchlist, setWatchlist] = useState(() => getStoredWatchlist());
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const user = localStorage.getItem('apexvault_current_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    try {
      return localStorage.getItem('apexvault_auth_token') || null;
    } catch {
      return null;
    }
  });

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  // Auth & Admin Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [authPendingCallback, setAuthPendingCallback] = useState(null);
  const [resetTokenFromUrl, setResetTokenFromUrl] = useState('');
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // Stripe & Checkout States
  const [stripeConfig, setStripeConfig] = useState(() => getStoredStripeConfig());
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isStripeSettingsOpen, setIsStripeSettingsOpen] = useState(false);
  const [stripePaymentIntent, setStripePaymentIntent] = useState(null);

  // Theme State (Dark Onyx Luxury vs Crisp Clean Light)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('apexvault_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('apexvault_theme', theme);
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Listen for Password Reset Token in URL on page load
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('resetToken');
      if (token) {
        setResetTokenFromUrl(token);
        setAuthModalMode('reset');
        setIsAuthModalOpen(true);
      }
    } catch {}
  }, []);

  // Customer Contact Records (Synced with Logged in user if available)
  const [savedCustomer, setSavedCustomer] = useState(() => {
    if (currentUser) {
      return {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        street: currentUser.street || '',
        city: currentUser.city || '',
        province: currentUser.province || 'Ontario',
        postalCode: currentUser.postalCode || ''
      };
    }
    try {
      const data = localStorage.getItem('apexvault_customer_record');
      return data
        ? JSON.parse(data)
        : {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            street: '',
            city: '',
            province: 'Ontario',
            postalCode: ''
          };
    } catch {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        province: 'Ontario',
        postalCode: ''
      };
    }
  });

  // Keep customer details in sync when user logs in/out
  useEffect(() => {
    if (currentUser) {
      setSavedCustomer({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        street: currentUser.street || '',
        city: currentUser.city || '',
        province: currentUser.province || 'Ontario',
        postalCode: currentUser.postalCode || ''
      });
    }
  }, [currentUser]);

  // Email Gateway Settings
  const [isEmailSettingsOpen, setIsEmailSettingsOpen] = useState(false);

  // Modals & Drawers
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  // Platform Enhancements Modals
  const [isConditionGuideOpen, setIsConditionGuideOpen] = useState(false);
  const [isDropAlertOpen, setIsDropAlertOpen] = useState(false);
  const [isMakeOfferOpen, setIsMakeOfferOpen] = useState(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [offerProduct, setOfferProduct] = useState(null);
  const [heldProductIds, setHeldProductIds] = useState({});

  // Email Preview Modal & Warehouse Scanner
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [emailToPreview, setEmailToPreview] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedOrder, setScannedOrder] = useState(null);

  // Filters & Discovery
  const [selectedEventId, setSelectedEventId] = useState('evt-all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [stockFilter, setStockFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [priceMax, setPriceMax] = useState(5000);

  // Reload products from MongoDB
  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetchProductsFromDB({
        category: selectedCategory,
        condition: selectedConditions,
        search: searchQuery,
        sortBy,
        priceMax,
        eventId: selectedEventId,
        inStockOnly: stockFilter === 'in_stock'
      });

      if (res && res.data) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error loading products from MongoDB:', err);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [selectedCategory, selectedConditions, searchQuery, sortBy, priceMax, selectedEventId, stockFilter]);

  const openMakeOffer = useCallback(
    (product) => {
      if (!currentUser) {
        showInfo('Please sign in or register to make an offer.');
        setAuthPendingCallback(() => () => {
          setOfferProduct(product);
          setIsMakeOfferOpen(true);
        });
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
        return;
      }
      setOfferProduct(product);
      setIsMakeOfferOpen(true);
    },
    [currentUser, showInfo]
  );

  const triggerHoldProduct = useCallback(async (product, durationMinutes = 120) => {
    if (!currentUser) {
      showInfo('Please sign in to place a 2-Hour Flash Hold on this lot.');
      setAuthPendingCallback(() => () => triggerHoldProduct(product, durationMinutes));
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    const prodId = product.id || product._id;
    try {
      const res = await holdProductInDB(prodId, durationMinutes, {
        name: `${currentUser.firstName || 'User'} ${currentUser.lastName || ''}`.trim(),
        email: currentUser.email
      });

      if (res.success) {
        const expiry = new Date(Date.now() + durationMinutes * 60 * 1000);
        setHeldProductIds((prev) => ({
          ...prev,
          [prodId]: expiry
        }));
        showSuccess(`🔒 Lot reserved! 2-Hour Flash Hold active for ${product.title}.`);
        loadProducts();
      } else {
        showAlert(res.error || 'Failed to place hold on lot.');
      }
    } catch (err) {
      showAlert(`Hold error: ${err.message}`);
    }
  }, [currentUser, showSuccess, showAlert, showInfo, loadProducts]);

  // Initial load & filter change reload
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Load orders & settings on startup
  useEffect(() => {
    const initData = async () => {
      try {
        const dbOrders = await fetchOrdersFromDB();
        if (dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders);
        }
        const dbSettings = await fetchSettingsFromDB();
        if (dbSettings) {
          if (dbSettings.stripe) setStripeConfig(dbSettings.stripe);
        }
      } catch (err) {
        console.warn('Init data load error:', err);
      }
    };
    initData();
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    setStoredCart(cart);
  }, [cart]);

  // Save Watchlist to LocalStorage
  useEffect(() => {
    setStoredWatchlist(watchlist);
  }, [watchlist]);

  // Cart Totals Calculation
  const cartTotals = useMemo(() => {
    const validCart = Array.isArray(cart) ? cart : [];
    const itemCount = validCart.reduce((acc, item) => acc + (Number(item?.quantity) || 0), 0);
    const subtotal = validCart.reduce(
      (acc, item) => acc + (Number(item?.product?.price) || 0) * (Number(item?.quantity) || 1),
      0
    );
    const totalMSRP = validCart.reduce(
      (acc, item) =>
        acc +
        (Number(item?.product?.retailMSRP) || Number(item?.product?.price) || 0) *
          (Number(item?.quantity) || 1),
      0
    );
    const totalSavings = Math.max(0, totalMSRP - subtotal);
    const savingsPercent = totalMSRP > 0 ? Math.round((totalSavings / totalMSRP) * 100) : 0;
    const tax = subtotal * 0.13; // 13% Ontario HST/GST
    const grandTotal = subtotal + tax;

    return {
      itemCount,
      subtotal,
      totalMSRP,
      totalSavings,
      savingsPercent,
      tax,
      grandTotal
    };
  }, [cart]);

  // Catalog Statistics
  const catalogStats = useMemo(() => {
    const validProducts = Array.isArray(products) ? products : [];
    const totalProductsCount = validProducts.length;
    const totalRetailValue = validProducts.reduce(
      (acc, p) => acc + (Number(p?.retailMSRP) || Number(p?.price) || 0),
      0
    );
    const totalStoreValue = validProducts.reduce((acc, p) => acc + (Number(p?.price) || 0), 0);
    const totalSavings = Math.max(0, totalRetailValue - totalStoreValue);
    const inStockUnits = validProducts.reduce((acc, p) => acc + (Number(p?.stockQty) || 0), 0);

    return {
      totalProductsCount,
      totalRetailValue,
      totalStoreValue,
      totalSavings,
      inStockUnits
    };
  }, [products]);

  /* ==========================================================================
     Authentication Actions
     ========================================================================== */

  const login = useCallback(
    async (email, password) => {
      const res = await loginUser(email, password);
      if (res.success && res.user && res.token) {
        setCurrentUser(res.user);
        setAuthToken(res.token);
        localStorage.setItem('apexvault_current_user', JSON.stringify(res.user));
        localStorage.setItem('apexvault_auth_token', res.token);
        showSuccess(`Welcome back, ${res.user.firstName}!`);
        setIsAuthModalOpen(false);

        // Clean any URL params and smoothly redirect view to top of homepage
        try {
          if (window.location.search) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {}

        // If there was a pending checkout action, execute it!
        if (authPendingCallback) {
          const action = authPendingCallback;
          setAuthPendingCallback(null);
          action();
        }
        return { success: true };
      } else {
        showAlert(res.error || 'Invalid email or password');
        return { success: false, error: res.error };
      }
    },
    [authPendingCallback, showAlert, showSuccess]
  );

  const register = useCallback(
    async (userData) => {
      const res = await registerUser(userData);
      if (res.success && res.user && res.token) {
        setCurrentUser(res.user);
        setAuthToken(res.token);
        localStorage.setItem('apexvault_current_user', JSON.stringify(res.user));
        localStorage.setItem('apexvault_auth_token', res.token);
        showSuccess(`Account created! Welcome to ApexxVault, ${res.user.firstName}.`);
        setIsAuthModalOpen(false);

        // Clean any URL params and smoothly redirect view to top of homepage
        try {
          if (window.location.search) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {}

        // Execute pending checkout action if any
        if (authPendingCallback) {
          const action = authPendingCallback;
          setAuthPendingCallback(null);
          action();
        }
        return { success: true };
      } else {
        showAlert(res.error || 'Registration failed');
        return { success: false, error: res.error };
      }
    },
    [authPendingCallback, showAlert, showSuccess]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('apexvault_current_user');
    localStorage.removeItem('apexvault_auth_token');
    showInfo('You have been signed out.');

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  }, [showInfo]);

  const forgotPassword = useCallback(
    async (email) => {
      const res = await forgotPasswordApi(email);
      if (res.success) {
        showSuccess(res.message || 'Password reset link sent!');
        return res;
      } else {
        showAlert(res.error || 'Failed to send reset link');
        return res;
      }
    },
    [showAlert, showSuccess]
  );

  const resetPassword = useCallback(
    async (token, newPassword) => {
      const res = await resetPasswordApi(token, newPassword);
      if (res.success && res.user && res.token) {
        setCurrentUser(res.user);
        setAuthToken(res.token);
        localStorage.setItem('apexvault_current_user', JSON.stringify(res.user));
        localStorage.setItem('apexvault_auth_token', res.token);
        showSuccess('Your password has been reset successfully!');
        setIsAuthModalOpen(false);

        try {
          if (window.location.search) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {}

        return { success: true };
      } else {
        showAlert(res.error || 'Password reset failed');
        return { success: false, error: res.error };
      }
    },
    [showAlert, showSuccess]
  );

  /* ==========================================================================
     Cart & Checkout Actions (Gated with Auth)
     ========================================================================== */

  // Add Item to Cart (Visitors can add items freely)
  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (product.stockQty <= 0) {
        showAlert(`Item ${product.title} is currently out of stock.`);
        return;
      }

      setCart((prev) => {
        const existingIndex = prev.findIndex((i) => (i.product.id || i.product._id) === (product.id || product._id));
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = Math.min(product.stockQty, updated[existingIndex].quantity + quantity);
          updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
          return updated;
        }
        return [...prev, { product, quantity: Math.min(product.stockQty, quantity) }];
      });

      showSuccess(`Added "${product.title}" to your vault cart.`);
    },
    [showAlert, showSuccess]
  );

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((i) => (i.product.id || i.product._id) !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => (i.product.id || i.product._id) !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) =>
          (i.product.id || i.product._id) === productId
            ? { ...i, quantity: Math.min(i.product.stockQty, quantity) }
            : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Direct Order Intent State (No Payment Method)
  const [orderIntent, setOrderIntent] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Open Checkout / Order Confirmation Modal (GATED: Requires Login/Register)
  const openOrderConfirmation = useCallback(
    (customItems = null) => {
      const items = customItems || cart;
      if (!items || items.length === 0) return;

      // Check if visitor is logged in
      if (!currentUser) {
        showInfo('Please sign in or register to complete your order.');
        setAuthPendingCallback(() => () => openOrderConfirmation(items));
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
        return;
      }

      const subtotal = items.reduce((acc, i) => acc + (Number(i.product.price) || 0) * i.quantity, 0);
      const totalMSRP = items.reduce(
        (acc, i) => acc + (Number(i.product.retailMSRP) || Number(i.product.price) || 0) * i.quantity,
        0
      );
      const totalSavings = Math.max(0, totalMSRP - subtotal);
      const tax = subtotal * 0.13;
      const grandTotal = subtotal + tax;

      setOrderIntent({
        items,
        subtotal,
        totalMSRP,
        totalSavings,
        tax,
        grandTotal,
        currency: 'CAD'
      });

      setIsCartOpen(false);
      setSelectedProductModal(null);
      setIsOrderModalOpen(true);
    },
    [cart, currentUser, showInfo]
  );

  // Direct 1-Click Buy Now (GATED: Requires Login/Register)
  const buyNowDirect = useCallback(
    (product, qty = 1) => {
      if (!currentUser) {
        showInfo('Please sign in or register to buy this item.');
        setAuthPendingCallback(() => () => openOrderConfirmation([{ product, quantity: qty }]));
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
        return;
      }
      openOrderConfirmation([{ product, quantity: qty }]);
    },
    [currentUser, openOrderConfirmation, showInfo]
  );

  // Process Direct Order & Save Order to MongoDB (No Payment Method Required)
  const processDirectOrder = useCallback(
    async (customerData) => {
      if (!orderIntent) return;

      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const pickupCode = `PK-${Math.floor(1000 + Math.random() * 9000)}`;

      setSavedCustomer(customerData);

      const orderPayload = {
        orderId,
        pickupCode,
        date: new Date().toISOString(),
        items: orderIntent.items.map((i) => ({
          product: {
            id: i.product.id || i.product._id,
            title: i.product.title,
            sku: i.product.sku,
            category: i.product.category,
            condition: i.product.condition,
            price: i.product.price,
            retailMSRP: i.product.retailMSRP,
            warehouseLocation: i.product.warehouseLocation,
            images: i.product.images
          },
          quantity: i.quantity,
          price: i.product.price
        })),
        subtotal: orderIntent.subtotal,
        totalMSRP: orderIntent.totalMSRP,
        totalSavings: orderIntent.totalSavings,
        tax: orderIntent.tax,
        grandTotal: orderIntent.grandTotal,
        pickupLocation: WAREHOUSE_PICKUP_DETAILS.fullAddress,
        warehouseDetails: WAREHOUSE_PICKUP_DETAILS,
        paymentMethod: 'Direct Message (DM) / Reserve',
        stripeChargeId: 'DIRECT-DM-INQUIRY',
        customer: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          street: customerData.street,
          city: customerData.city,
          province: customerData.province,
          postalCode: customerData.postalCode,
          note: customerData.note || ''
        },
        emailDispatchedTo: customerData.email,
        status: 'Inquiry / DM Reserved'
      };

      try {
        const result = await createOrderInDB(orderPayload);
        const savedOrder = result?.data || orderPayload;
        setOrders((prev) => [savedOrder, ...prev]);
        setLastOrder(savedOrder);
        loadProducts();
      } catch (err) {
        console.error('Error saving order to MongoDB:', err);
        setLastOrder(orderPayload);
      }

      const isCartPayment = cart.length > 0 && orderIntent.items.length === cart.length;
      if (isCartPayment) {
        clearCart();
      }

      setIsOrderModalOpen(false);
      setIsCheckoutSuccessOpen(true);

      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch {}
    },
    [orderIntent, cart, clearCart, loadProducts]
  );

  // Watchlist Toggle
  const toggleWatchlist = useCallback(
    (productId) => {
      setWatchlist((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
    },
    []
  );

  // Stripe Config Update
  const updateStripeConfig = useCallback(
    async (newConfig) => {
      setStripeConfig(newConfig);
      setStoredStripeConfig(newConfig);
      await saveSettingsToDB({ stripe: newConfig });
      showSuccess('Stripe Payment Gateway settings saved.');
    },
    [showSuccess]
  );

  // Bulk Upload Manifest
  const bulkUploadProducts = useCallback(
    async (uploadedProducts) => {
      try {
        const res = await bulkUploadProductsToDB(uploadedProducts);
        if (res.success) {
          showSuccess(`Imported ${res.count || uploadedProducts.length} assets to MongoDB catalog!`);
          loadProducts();
          return { success: true, count: res.count };
        } else {
          showAlert(res.error || 'Failed to upload products.');
          return { success: false, error: res.error };
        }
      } catch (err) {
        showAlert(`Upload error: ${err.message}`);
        return { success: false, error: err.message };
      }
    },
    [loadProducts, showAlert, showSuccess]
  );

  // Reset Catalog
  const resetCatalog = useCallback(async () => {
    setSelectedCategory('all');
    setSelectedConditions([]);
    setSelectedEventId('evt-all');
    setStockFilter('all');
    setSearchQuery('');
    setSortBy('featured');
    setPriceMax(5000);
    loadProducts();
  }, [loadProducts]);

  // Lookup Order
  const lookupOrder = useCallback(async (query) => {
    return await lookupOrderFromDB(query);
  }, []);

  // Email Preview
  const openEmailPreview = useCallback((order) => {
    setEmailToPreview(order);
    setIsEmailPreviewOpen(true);
  }, []);

  return (
    <AuctionContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        isLoggedIn,
        isAdmin,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        resetTokenFromUrl,
        isAdminPortalOpen,
        setIsAdminPortalOpen,
        products,
        filteredProducts: products,
        isLoadingProducts,
        loadProducts,
        cart,
        cartTotals,
        watchlist,
        orders,
        lastOrder,
        savedCustomer,
        setSavedCustomer,
        catalogStats,
        isOrderModalOpen,
        setIsOrderModalOpen,
        orderIntent,
        openOrderConfirmation,
        openStripePayment: openOrderConfirmation,
        processDirectOrder,
        isEmailSettingsOpen,
        setIsEmailSettingsOpen,
        isEmailPreviewOpen,
        setIsEmailPreviewOpen,
        emailToPreview,
        openEmailPreview,
        isScannerOpen,
        setIsScannerOpen,
        scannedOrder,
        setScannedOrder,
        lookupOrder,
        selectedEventId,
        setSelectedEventId,
        selectedCategory,
        setSelectedCategory,
        selectedConditions,
        setSelectedConditions,
        stockFilter,
        setStockFilter,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        priceMax,
        setPriceMax,
        isBulkUploadOpen,
        setIsBulkUploadOpen,
        isCartOpen,
        setIsCartOpen,
        isCheckoutSuccessOpen,
        setIsCheckoutSuccessOpen,
        isWatchlistOpen,
        setIsWatchlistOpen,
        selectedProductModal,
        setSelectedProductModal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        buyNowDirect,
        toggleWatchlist,
        bulkUploadProducts,
        resetCatalog,
        isConditionGuideOpen,
        setIsConditionGuideOpen,
        isDropAlertOpen,
        setIsDropAlertOpen,
        isMakeOfferOpen,
        setIsMakeOfferOpen,
        isCustomerPortalOpen,
        setIsCustomerPortalOpen,
        offerProduct,
        setOfferProduct,
        openMakeOffer,
        heldProductIds,
        triggerHoldProduct,
        showSuccess,
        showAlert,
        showInfo
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};
