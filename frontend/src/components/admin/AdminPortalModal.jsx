import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Plus,
  Package,
  ShoppingBag,
  Users,
  Search,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Layers,
  Sparkles,
  ExternalLink,
  QrCode,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  FileText,
  TrendingUp,
  Tag,
  Boxes,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { useRouter } from '../../context/RouterContext';
import { CATEGORIES, CONDITIONS } from '../../data/auctionEvents';
import {
  createProductInDB,
  updateProductInDB,
  deleteProductInDB,
  fetchOrdersFromDB,
  markOrderReleasedInDB,
  fetchUsersFromDB,
  fetchOffersFromDB,
  updateOfferStatusInDB,
  deleteOfferFromDB,
  fetchSubscribersFromDB,
  fetchSettingsFromDB,
  saveSettingsToDB,
  deleteUserInDB,
  updateUserRoleInDB
} from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';

export const AdminPortalModal = ({ forceInline = false, onClose }) => {
  const {
    isAdminPortalOpen,
    setIsAdminPortalOpen,
    products,
    loadProducts,
    orders,
    setOrders,
    setIsBulkUploadOpen,
    transitionOrderStatus,
    sanitizeCatalogAction
  } = useAuction();
  const { navigate } = useRouter();
  const { showSuccess, showAlert } = useNotification();

  const handleCloseModal = () => {
    setIsAdminPortalOpen(false);
    if (typeof onClose === 'function') {
      onClose();
    }
    navigate('/');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active Tab: 'analytics' | 'inventory' | 'orders' | 'offers' | 'subscribers' | 'customers' | 'settings'
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');

  // 1-Click Sanitize Catalog State
  const [isSanitizingCatalog, setIsSanitizingCatalog] = useState(false);

  // Add / Edit Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    modelNumber: '',
    sku: '',
    category: 'electronics',
    condition: 'Brand New',
    conditionNotes: '',
    price: '',
    retailMSRP: '',
    costPrice: '',
    barcode: '',
    stockQty: '1',
    warehouseLocation: 'Bay A-01',
    imageUrl: '',
    description: '',
    supplier: ''
  });

  // Customers Directory State
  const [customersList, setCustomersList] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [maskPII, setMaskPII] = useState(true);

  // Offers State
  const [offersList, setOffersList] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);

  // Subscribers State
  const [subscribersList, setSubscribersList] = useState([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    businessName: 'ApexxVault Liquidation Depot',
    tagline: 'Premier Direct Liquidation & Surplus Wholesale Hub',
    phone: '+1 (416) 571-6702',
    email: 'support@apexxvault.com',
    address: '705 Progress Ave #32, Scarborough, ON M1H 2X1, Canada',
    hours: 'Mon-Fri 10am-6pm | Sat 11am-4pm | Sun Closed',
    taxRate: 0.13,
    currency: 'CAD',
    privacyPolicy: '',
    termsOfService: '',
    asIsAgreement: '',
    pickupPolicy: ''
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // UI Feedback Statuses
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Load Data on Tab Switch
  useEffect(() => {
    if (!isAdminPortalOpen && !forceInline) return;
    if (activeTab === 'customers') {
      const loadUsers = async () => {
        setIsLoadingCustomers(true);
        const users = await fetchUsersFromDB();
        setCustomersList(users);
        setIsLoadingCustomers(false);
      };
      loadUsers();
    } else if (activeTab === 'offers') {
      const loadOffers = async () => {
        setIsLoadingOffers(true);
        const offers = await fetchOffersFromDB();
        setOffersList(offers);
        setIsLoadingOffers(false);
      };
      loadOffers();
    } else if (activeTab === 'subscribers') {
      const loadSubscribers = async () => {
        setIsLoadingSubscribers(true);
        const subs = await fetchSubscribersFromDB();
        setSubscribersList(subs);
        setIsLoadingSubscribers(false);
      };
      loadSubscribers();
    } else if (activeTab === 'settings') {
      const loadSettings = async () => {
        setIsLoadingSettings(true);
        try {
          const res = await fetchSettingsFromDB();
          if (res) {
            setStoreSettings((prev) => ({
              ...prev,
              businessName: res.business?.name || res.store?.businessName || prev.businessName,
              tagline: res.business?.tagline || res.store?.tagline || prev.tagline,
              phone: res.business?.phone || res.store?.phone || prev.phone,
              email: res.business?.email || res.store?.supportEmail || prev.email,
              address: res.business?.address || (res.store?.street ? `${res.store.street}, ${res.store.city}, ${res.store.province} ${res.store.postalCode}` : prev.address),
              hours: res.business?.hours || res.store?.hoursWeekdays || prev.hours,
              taxRate: res.business?.taxRate || res.store?.taxRate || prev.taxRate,
              currency: res.business?.currency || res.store?.currency || prev.currency,
              privacyPolicy: res.privacyPolicy || res.policies?.privacyPolicy || '',
              termsOfService: res.termsOfService || res.policies?.termsOfService || '',
              asIsAgreement: res.asIsAgreement || res.policies?.asIsAgreement || '',
              pickupPolicy: res.pickupPolicy || res.policies?.pickupPolicy || ''
            }));
          }
        } catch {}
        setIsLoadingSettings(false);
      };
      loadSettings();
    }
  }, [isAdminPortalOpen, activeTab]);

  // Analytics Computation
  const analyticsData = useMemo(() => {
    const validOrders = Array.isArray(orders) ? orders : [];
    const validProducts = Array.isArray(products) ? products : [];

    const totalRevenue = validOrders
      .filter((o) => o.status === 'Paid' || o.status === 'Picked Up' || o.status === 'Released to Customer')
      .reduce((acc, o) => acc + (Number(o.grandTotal) || 0), 0);

    const pendingReserves = validOrders.filter(
      (o) =>
        o.status === 'Reserved' ||
        o.status === 'Inquiry / DM Reserved' ||
        o.status === 'Ready for Warehouse Pickup' ||
        o.status === 'Ready for Pickup'
    );

    const completedOrders = validOrders.filter(
      (o) => o.status === 'Picked Up' || o.status === 'Released to Customer'
    );

    const totalRetailValuation = validProducts.reduce(
      (acc, p) => acc + (Number(p.retailMSRP) || Number(p.price) || 0) * (Number(p.stockQty) || 1),
      0
    );

    const totalLiquidationValuation = validProducts.reduce(
      (acc, p) => acc + (Number(p.price) || 0) * (Number(p.stockQty) || 1),
      0
    );

    const totalUnitsCount = validProducts.reduce((acc, p) => acc + (Number(p.stockQty) || 0), 0);
    const lowStockItems = validProducts.filter((p) => Number(p.stockQty) <= 3 && Number(p.stockQty) > 0);
    const outOfStockItems = validProducts.filter((p) => Number(p.stockQty) <= 0);

    return {
      totalRevenue,
      totalOrdersCount: validOrders.length,
      completedOrdersCount: completedOrders.length,
      pendingReservesCount: pendingReserves.length,
      totalRetailValuation,
      totalLiquidationValuation,
      totalUnitsCount,
      lowStockItems,
      outOfStockItems
    };
  }, [orders, products]);

  if (!isAdminPortalOpen && !forceInline) return null;

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset Product Form
  const resetForm = () => {
    setFormData({
      title: '',
      brand: '',
      modelNumber: '',
      sku: '',
      category: 'electronics',
      condition: 'Brand New',
      conditionNotes: '',
      price: '',
      retailMSRP: '',
      costPrice: '',
      barcode: '',
      stockQty: '1',
      warehouseLocation: 'Bay A-01',
      imageUrl: '',
      description: '',
      supplier: ''
    });
    setEditingProductId(null);
    setIsAddingProduct(false);
  };

  // Save / Update Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (!formData.title || !formData.price) {
      setActionError('Product Title and Liquidation Price are required.');
      return;
    }

    const imagesList = formData.imageUrl.trim()
      ? formData.imageUrl.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800'];

    const payload = {
      title: formData.title.trim(),
      brand: formData.brand.trim(),
      modelNumber: formData.modelNumber.trim(),
      sku: formData.sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      category: formData.category,
      condition: formData.condition,
      conditionNotes: formData.conditionNotes.trim() || 'Factory inspected & verified',
      price: Number(formData.price),
      retailMSRP: Number(formData.retailMSRP) || Number(formData.price),
      costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
      barcode: formData.barcode.trim(),
      stockQty: Number(formData.stockQty) || 1,
      warehouseLocation: formData.warehouseLocation.trim() || 'Bay A-01',
      images: imagesList,
      description: formData.description.trim(),
      supplier: formData.supplier.trim()
    };

    try {
      if (editingProductId) {
        const res = await updateProductInDB(editingProductId, payload);
        if (res.success) {
          setActionSuccess(`Updated item "${formData.title}" successfully!`);
          await loadProducts();
          resetForm();
        } else {
          setActionError(res.error || 'Failed to update product');
        }
      } else {
        const res = await createProductInDB(payload);
        if (res.success) {
          setActionSuccess(`Published "${formData.title}" to catalog!`);
          await loadProducts();
          resetForm();
        } else {
          setActionError(res.error || 'Failed to create product');
        }
      }
    } catch (err) {
      setActionError(err.message || 'Error saving product');
    }
  };

  // Edit Product Trigger
  const handleEditClick = (product) => {
    setEditingProductId(product.id || product._id);
    setFormData({
      title: product.title || '',
      brand: product.brand || '',
      modelNumber: product.modelNumber || '',
      sku: product.sku || '',
      category: product.category || 'electronics',
      condition: product.condition || 'Brand New',
      conditionNotes: product.conditionNotes || '',
      price: product.price?.toString() || '',
      retailMSRP: product.retailMSRP?.toString() || '',
      costPrice: product.costPrice?.toString() || '',
      barcode: product.barcode || '',
      stockQty: product.stockQty?.toString() || '1',
      warehouseLocation: product.warehouseLocation || 'Bay A-01',
      imageUrl: Array.isArray(product.images) ? product.images.join(', ') : (product.images || ''),
      description: product.description || '',
      supplier: product.supplier || ''
    });
    setIsAddingProduct(true);
  };

  // Delete Product
  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      const res = await deleteProductInDB(id);
      if (res.success) {
        setActionSuccess(`Removed "${title}" from catalog.`);
        await loadProducts();
      } else {
        setActionError(res.error || 'Failed to delete product.');
      }
    }
  };

  // 1-Click Sanitize & Deduplicate Catalog
  const handleSanitizeCatalog = async () => {
    if (
      !window.confirm(
        'Run 1-Click Catalog Sanitization? This will clean retail titles, map proper departments, standardize condition grades, and resolve duplicate listings.'
      )
    )
      return;

    setIsSanitizingCatalog(true);
    setActionError('');
    setActionSuccess('');
    try {
      const res = await sanitizeCatalogAction();
      if (res.success) {
        setActionSuccess(
          `Sanitization complete! Updated ${res.updatedCount || 0} items and resolved ${res.mergedDuplicates || 0} duplicates.`
        );
      }
    } catch (err) {
      setActionError(`Sanitize error: ${err.message}`);
    } finally {
      setIsSanitizingCatalog(false);
    }
  };

  // Order Lifecycle Transitions
  const handleOrderStatusTransition = async (orderId, newStatus) => {
    let refundReason = '';
    if (newStatus === 'Refunded') {
      refundReason = window.prompt('Please enter the refund reason:', 'Customer requested cancellation') || '';
      if (!refundReason) return;
    }
    const res = await transitionOrderStatus(orderId, { status: newStatus, refundReason });
    if (res.success) {
      setActionSuccess(`Order #${orderId} updated to "${newStatus}"!`);
      const updatedOrders = await fetchOrdersFromDB();
      if (updatedOrders) setOrders(updatedOrders);
    }
  };

  // Save Store Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setActionError('');
    setActionSuccess('');
    try {
      const res = await saveSettingsToDB({
        business: {
          name: storeSettings.businessName,
          tagline: storeSettings.tagline,
          phone: storeSettings.phone,
          email: storeSettings.email,
          address: storeSettings.address,
          hours: storeSettings.hours,
          taxRate: Number(storeSettings.taxRate) || 0.13,
          currency: storeSettings.currency || 'CAD'
        },
        privacyPolicy: storeSettings.privacyPolicy,
        termsOfService: storeSettings.termsOfService,
        asIsAgreement: storeSettings.asIsAgreement,
        pickupPolicy: storeSettings.pickupPolicy
      });
      if (res.success || res._id) {
        setActionSuccess('Store profile, tax rate, and legal policies saved successfully!');
      } else {
        setActionError(res.error || 'Failed to save store settings.');
      }
    } catch (err) {
      setActionError(`Settings error: ${err.message}`);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Customer Management
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Permanently delete user "${userName}"? This cannot be undone.`)) {
      const res = await deleteUserInDB(userId);
      if (res.success) {
        showSuccess(`User "${userName}" deleted.`);
        setCustomersList((prev) => prev.filter((u) => (u.id || u._id) !== userId));
      } else {
        showAlert(res.error || 'Failed to delete user.');
      }
    }
  };

  const handleToggleUserRole = async (userId, currentRole, userName) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (window.confirm(`Switch role for "${userName}" to ${newRole.toUpperCase()}?`)) {
      const res = await updateUserRoleInDB(userId, newRole);
      if (res.success) {
        showSuccess(`Updated role for ${userName} to ${newRole}.`);
        setCustomersList((prev) =>
          prev.map((u) => ((u.id || u._id) === userId ? { ...u, role: newRole } : u))
        );
      } else {
        showAlert(res.error || 'Failed to update user role.');
      }
    }
  };

  // Mask PII Helper
  const maskPhone = (phone) => {
    if (!phone) return 'N/A';
    if (!maskPII) return phone;
    return phone.replace(/(\+?\d{1,3})?[\s-]?\(?\d{3}\)?[\s-]?(\d{3})[\s-]?(\d{4})/, '$1 (***) ***-$3');
  };

  const maskEmail = (email) => {
    if (!email) return 'N/A';
    if (!maskPII) return email;
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const name = parts[0];
    const maskedName = name.length > 2 ? `${name[0]}***${name.slice(-1)}` : `${name[0]}***`;
    return `${maskedName}@${parts[1]}`;
  };

  // Filtered Products
  const filteredInventory = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.warehouseLocation && p.warehouseLocation.toLowerCase().includes(q))
    );
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const cust = o.customer || {};
    return (
      (o.orderId && o.orderId.toLowerCase().includes(q)) ||
      (o.pickupCode && o.pickupCode.toLowerCase().includes(q)) ||
      (cust.firstName && cust.firstName.toLowerCase().includes(q)) ||
      (cust.lastName && cust.lastName.toLowerCase().includes(q)) ||
      (cust.email && cust.email.toLowerCase().includes(q)) ||
      (cust.phone && cust.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="modal-backdrop" onClick={handleCloseModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1180px',
          width: '96vw',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <img
              src="/apexxvault-emblem.png"
              alt="ApexxVault Emblem"
              style={{
                width: '42px',
                height: '42px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                  ApexxVault Executive Management Suite
                </h3>
                <span
                  style={{
                    background: 'var(--gold-bg)',
                    color: 'var(--gold-light)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(245, 158, 11, 0.4)'
                  }}
                >
                  ADMIN LEVEL 4
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Scarborough Depot Operations • Orders &amp; Holds • Live Inventory • Store Controls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                background: 'var(--bg-secondary, #2a2520)',
                color: 'var(--text-primary, #fff)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.2))'
              }}
              title="Return to Customer Storefront"
            >
              <ArrowLeft size={16} />
              <span>Exit to Storefront</span>
            </button>

            <button
              className="modal-close-btn"
              onClick={handleCloseModal}
              aria-label="Close Admin Portal and return to storefront"
              title="Close Admin Portal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.5rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div className="tab-button-group admin-tabs-scrollable" style={{ maxWidth: '100%', overflowX: 'auto', whiteSpace: 'nowrap', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' }}>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('analytics');
                setSearchQuery('');
              }}
            >
              <BarChart3 size={15} style={{ display: 'inline', marginRight: '6px' }} />
              Analytics
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('inventory');
                setSearchQuery('');
              }}
            >
              <Package size={15} style={{ display: 'inline', marginRight: '6px' }} />
              Inventory ({products.length})
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('orders');
                setSearchQuery('');
              }}
            >
              <ShoppingBag size={15} style={{ display: 'inline', marginRight: '6px' }} />
              Orders ({orders.length})
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('offers');
                setSearchQuery('');
              }}
            >
              <DollarSign size={15} style={{ display: 'inline', marginRight: '6px' }} />
              Offers ({offersList.length})
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('subscribers');
                setSearchQuery('');
              }}
            >
              <Sparkles size={15} color="var(--gold-light)" style={{ display: 'inline', marginRight: '6px' }} />
              Drop Leads ({subscribersList.length})
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('customers');
                setSearchQuery('');
              }}
            >
              <Users size={15} style={{ display: 'inline', marginRight: '6px' }} />
              Users ({customersList.length})
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('settings');
                setSearchQuery('');
              }}
            >
              <Settings size={15} style={{ display: 'inline', marginRight: '6px' }} />
              Store Settings
            </button>
          </div>

          {/* Quick Search */}
          {activeTab !== 'analytics' && activeTab !== 'settings' && (
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '2.2rem',
                  paddingRight: '0.75rem',
                  fontSize: '0.825rem'
                }}
              />
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>
          )}
        </div>

        {/* Feedback Alert Banners */}
        {actionSuccess && (
          <div
            style={{
              background: 'var(--emerald-bg)',
              color: 'var(--emerald-light)',
              padding: '0.65rem 1.75rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>✓ {actionSuccess}</span>
            <button
              onClick={() => setActionSuccess('')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        )}
        {actionError && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              color: '#fda4af',
              padding: '0.65rem 1.75rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              borderBottom: '1px solid rgba(244, 63, 94, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>⚠ {actionError}</span>
            <button
              onClick={() => setActionError('')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem' }}>
          {/* =================================================================
              TAB 0: DASHBOARD & ANALYTICS (Finding A5)
             ================================================================= */}
          {activeTab === 'analytics' && (
            <div>
              {/* Header with 1-Click Catalog Sanitizer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                    Operational Metrics &amp; Liquidation Insights
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Real-time sales, inventory valuations, hold expirations, and catalog health.
                  </p>
                </div>

                {/* 1-Click Sanitize & Deduplicate Catalog Button */}
                <button
                  type="button"
                  onClick={handleSanitizeCatalog}
                  disabled={isSanitizingCatalog}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: isSanitizingCatalog ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
                  }}
                  title="Cleans Amazon titles, standardizes conditions, normalizes categories, and merges duplicate SKUs"
                >
                  <RefreshCw
                    size={16}
                    style={{ animation: isSanitizingCatalog ? 'spin 1s linear infinite' : 'none' }}
                  />
                  <span>
                    {isSanitizingCatalog
                      ? 'Sanitizing Catalog...'
                      : '1-Click Sanitize & Deduplicate Catalog'}
                  </span>
                </button>
              </div>

              {/* 4-Card Executive KPI Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.75rem'
                }}
              >
                {/* Total Gross Revenue */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Paid Gross Revenue (CAD)
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      color: 'var(--emerald-light)',
                      marginTop: '0.35rem'
                    }}
                  >
                    {formatCurrency(analyticsData.totalRevenue)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {analyticsData.completedOrdersCount} orders picked up / completed
                  </div>
                </div>

                {/* Active Purchase Orders & Holds */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Total Orders / Pending Holds
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      color: 'var(--gold-light)',
                      marginTop: '0.35rem'
                    }}
                  >
                    {analyticsData.totalOrdersCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {analyticsData.pendingReservesCount} pending depot pickup reservations
                  </div>
                </div>

                {/* Catalog Liquidation Value */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Storefront Inventory Value
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      color: 'var(--blue-light)',
                      marginTop: '0.35rem'
                    }}
                  >
                    {formatCurrency(analyticsData.totalLiquidationValuation)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {analyticsData.totalUnitsCount} physical units across {products.length} lots
                  </div>
                </div>

                {/* Total Retail MSRP Valuation */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Total Retail MSRP Value
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      color: 'var(--text-primary)',
                      marginTop: '0.35rem'
                    }}
                  >
                    {formatCurrency(analyticsData.totalRetailValuation)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--emerald-light)', marginTop: '0.25rem', fontWeight: 600 }}>
                    Average Savings: ~65%–75% Below MSRP
                  </div>
                </div>
              </div>

              {/* Low Stock Alerts Table */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem'
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} color="var(--gold-light)" />
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Urgent Low-Stock Assets (&le; 3 units left)
                    </h5>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {analyticsData.lowStockItems.length} items flagged
                  </span>
                </div>

                {analyticsData.lowStockItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    All catalog assets currently have healthy inventory levels.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.5rem 0.75rem' }}>SKU</th>
                          <th style={{ padding: '0.5rem 0.75rem' }}>Title</th>
                          <th style={{ padding: '0.5rem 0.75rem' }}>Category</th>
                          <th style={{ padding: '0.5rem 0.75rem' }}>Location</th>
                          <th style={{ padding: '0.5rem 0.75rem' }}>Stock</th>
                          <th style={{ padding: '0.5rem 0.75rem' }}>Price</th>
                          <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.lowStockItems.slice(0, 10).map((item) => (
                          <tr key={item.id || item._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                              {item.sku}
                            </td>
                            <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {item.title}
                            </td>
                            <td style={{ padding: '0.5rem 0.75rem', textTransform: 'capitalize' }}>
                              {item.category}
                            </td>
                            <td style={{ padding: '0.5rem 0.75rem' }}>
                              {item.warehouseLocation || 'Depot'}
                            </td>
                            <td style={{ padding: '0.5rem 0.75rem', color: '#fca5a5', fontWeight: 800 }}>
                              Only {item.stockQty} left
                            </td>
                            <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald-light)', fontWeight: 700 }}>
                              {formatCurrency(item.price)}
                            </td>
                            <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>
                              <button
                                onClick={() => {
                                  handleEditClick(item);
                                  setActiveTab('inventory');
                                }}
                                style={{
                                  background: 'var(--bg-card)',
                                  border: '1px solid var(--border-subtle)',
                                  color: 'var(--emerald-light)',
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Edit Stock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 1: INVENTORY MANAGEMENT
             ================================================================= */}
          {activeTab === 'inventory' && (
            <div>
              {/* Top Action Bar */}
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}
              >
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Active Catalog Items ({filteredInventory.length})
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsBulkUploadOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-muted)',
                      color: 'var(--text-primary)',
                      padding: '0.55rem 1.15rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Package size={15} color="var(--emerald-light)" />
                    <span>📥 Bulk Upload CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isAddingProduct) {
                        resetForm();
                      } else {
                        resetForm();
                        setIsAddingProduct(true);
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: isAddingProduct
                        ? 'var(--bg-secondary)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: isAddingProduct ? '1px solid var(--border-muted)' : 'none',
                      color: '#ffffff',
                      padding: '0.55rem 1.15rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isAddingProduct ? 'none' : 'var(--shadow-emerald)'
                    }}
                  >
                    {isAddingProduct ? <X size={15} /> : <Plus size={15} />}
                    <span>{isAddingProduct ? 'Cancel Form' : 'Add New Item to Catalog'}</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Product Form Panel */}
              {isAddingProduct && (
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-muted)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    marginBottom: '1.75rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      color: 'var(--emerald-light)',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Sparkles size={16} />
                    {editingProductId ? 'Edit Catalog Asset' : 'Create & Publish New Asset'}
                  </h4>

                  <form onSubmit={handleSaveProduct}>
                    {/* Row 1: Title, Brand, Model */}
                    <div className="admin-form-row-3">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Product Title *
                        </label>
                        <input
                          type="text"
                          required
                          name="title"
                          placeholder="e.g. DeWalt 20V Max Cordless Drill Kit"
                          value={formData.title}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          placeholder="e.g. DeWalt"
                          value={formData.brand}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Model / Part #
                        </label>
                        <input
                          type="text"
                          name="modelNumber"
                          placeholder="e.g. DCD771C2"
                          value={formData.modelNumber}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Row 2: SKU, Category, Condition, Warehouse Bay */}
                    <div className="admin-form-row-4">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          SKU Code
                        </label>
                        <input
                          type="text"
                          name="sku"
                          placeholder="e.g. SKU-1099"
                          value={formData.sku}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Department Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        >
                          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Condition Grade
                        </label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        >
                          {CONDITIONS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.id}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Warehouse Bay (Internal Only)
                        </label>
                        <input
                          type="text"
                          name="warehouseLocation"
                          placeholder="e.g. Bay A-02"
                          value={formData.warehouseLocation}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Row 3: Pricing, Cost Price & Stock */}
                    <div className="admin-form-row-4-even">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Liquidation Price ($ CAD) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          name="price"
                          placeholder="e.g. 149.99"
                          value={formData.price}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Retail MSRP ($ CAD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="retailMSRP"
                          placeholder="e.g. 299.99"
                          value={formData.retailMSRP}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Cost / Intake Price ($ CAD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="costPrice"
                          placeholder="e.g. 45.00"
                          value={formData.costPrice}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Physical Stock Units
                        </label>
                        <input
                          type="number"
                          min="0"
                          name="stockQty"
                          placeholder="1"
                          value={formData.stockQty}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Row 4: Multi-Angle Image URLs & Supplier */}
                    <div className="admin-form-row-title-split">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Image URL(s) (Comma-separated for multi-photo gallery)
                        </label>
                        <input
                          type="text"
                          name="imageUrl"
                          placeholder="https://...jpg, https://...png"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Supplier / Liquidator Lot Source
                        </label>
                        <input
                          type="text"
                          name="supplier"
                          placeholder="e.g. Amazon Overstock"
                          value={formData.supplier}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Row 5: Condition Notes & Description */}
                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Condition Notes (Intake Inspection)
                        </label>
                        <input
                          type="text"
                          name="conditionNotes"
                          placeholder="e.g. Factory sealed, minor retail box dent, verified untouched"
                          value={formData.conditionNotes}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Item Description / Specs
                        </label>
                        <input
                          type="text"
                          name="description"
                          placeholder="e.g. Includes charger, two 2.0Ah batteries, and soft carrying case"
                          value={formData.description}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3" style={{ marginTop: '1.25rem' }}>
                      <button
                        type="button"
                        onClick={resetForm}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          padding: '0.55rem 1.15rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.825rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          padding: '0.55rem 1.4rem',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          boxShadow: 'var(--shadow-emerald)',
                          cursor: 'pointer',
                          border: 'none'
                        }}
                      >
                        {editingProductId ? 'Update Product' : 'Save & Publish Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>SKU</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Condition</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Price (CAD)</th>
                      <th style={{ padding: '0.75rem 1rem' }}>MSRP</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Stock</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Bay</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item.id || item._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {item.sku}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '280px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.title}
                          </div>
                          {item.brand && (
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              Brand: {item.brand}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textTransform: 'capitalize' }}>
                          {item.category}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            className={`badge-condition ${
                              item.condition === 'Brand New'
                                ? 'brand-new'
                                : item.condition === 'Appears New'
                                ? 'appears-new'
                                : 'open-box'
                            }`}
                            style={{ fontSize: '0.7rem' }}
                          >
                            {item.condition}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--emerald-light)' }}>
                          {formatCurrency(item.price)}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {formatCurrency(item.retailMSRP)}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.stockQty <= 3 ? '#fda4af' : '#86efac' }}>
                          {item.stockQty}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--gold-light)' }}>
                          {item.warehouseLocation || 'Bay A-01'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              style={{
                                color: 'var(--text-muted)',
                                padding: '4px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                              title="Edit item"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.id || item._id, item.title)}
                              style={{
                                color: '#f43f5e',
                                padding: '4px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                              title="Delete item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 2: CUSTOMER PURCHASE ORDERS (Finding A12: Full Workflow)
             ================================================================= */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                  Customer Orders &amp; Warehouse Pickup Slips ({filteredOrders.length})
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Statuses: Reserved &bull; Paid &bull; Ready for Pickup &bull; Picked Up &bull; Cancelled &bull; Refunded
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No customer orders found matching your search.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {filteredOrders.map((ord) => {
                    const cust = ord.customer || {};
                    const orderId = ord.orderId || ord._id;
                    const status = ord.status || 'Reserved';
                    const isCompleted = status === 'Picked Up' || status === 'Released to Customer';
                    const isCancelled = status === 'Cancelled' || status === 'Refunded';

                    return (
                      <div
                        key={orderId}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: `1px solid ${
                            isCompleted
                              ? 'rgba(16, 185, 129, 0.4)'
                              : isCancelled
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'var(--border-subtle)'
                          }`,
                          borderRadius: 'var(--radius-lg)',
                          padding: '1.25rem 1.5rem',
                          boxShadow: 'var(--shadow-xs)'
                        }}
                      >
                        {/* Order Header */}
                        <div
                          className="flex items-center justify-between"
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            paddingBottom: '0.85rem',
                            marginBottom: '1rem',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--emerald-light)', fontSize: '1.05rem' }}>
                              #{orderId}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Pickup Code: <strong style={{ color: 'var(--gold-light)' }}>{ord.pickupCode || 'N/A'}</strong>
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(ord.date || ord.createdAt).toLocaleString()}
                            </span>
                          </div>

                          {/* Order Status Badge & Lifecycle Action Buttons (Finding A12) */}
                          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                            <span
                              style={{
                                background: isCompleted
                                  ? 'var(--emerald-bg)'
                                  : isCancelled
                                  ? 'rgba(239, 68, 68, 0.15)'
                                  : 'var(--gold-bg)',
                                color: isCompleted
                                  ? 'var(--emerald-light)'
                                  : isCancelled
                                  ? '#fda4af'
                                  : 'var(--gold-light)',
                                padding: '0.25rem 0.65rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                border: `1px solid ${
                                  isCompleted
                                    ? 'rgba(16, 185, 129, 0.4)'
                                    : isCancelled
                                    ? 'rgba(239, 68, 68, 0.3)'
                                    : 'rgba(245, 158, 11, 0.4)'
                                }`
                              }}
                            >
                              {status}
                            </span>

                            {/* Mark Paid */}
                            {status !== 'Paid' && !isCompleted && !isCancelled && (
                              <button
                                onClick={() => handleOrderStatusTransition(orderId, 'Paid')}
                                style={{
                                  background: 'var(--bg-card)',
                                  border: '1px solid var(--emerald-primary)',
                                  color: 'var(--emerald-light)',
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Mark Paid
                              </button>
                            )}

                            {/* Ready for Pickup */}
                            {status !== 'Ready for Pickup' && !isCompleted && !isCancelled && (
                              <button
                                onClick={() => handleOrderStatusTransition(orderId, 'Ready for Pickup')}
                                style={{
                                  background: 'var(--bg-card)',
                                  border: '1px solid var(--blue-light)',
                                  color: 'var(--blue-light)',
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Ready for Pickup
                              </button>
                            )}

                            {/* Mark Picked Up */}
                            {!isCompleted && !isCancelled && (
                              <button
                                onClick={() => handleOrderStatusTransition(orderId, 'Picked Up')}
                                style={{
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: '#ffffff',
                                  padding: '0.35rem 0.85rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  border: 'none',
                                  boxShadow: 'var(--shadow-emerald)'
                                }}
                              >
                                Mark Picked Up
                              </button>
                            )}

                            {/* Cancel & Restock */}
                            {!isCompleted && !isCancelled && (
                              <button
                                onClick={() => handleOrderStatusTransition(orderId, 'Cancelled')}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: 'var(--rose-primary)',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Cancel &amp; Restock
                              </button>
                            )}

                            {/* Refund */}
                            {status === 'Paid' && (
                              <button
                                onClick={() => handleOrderStatusTransition(orderId, 'Refunded')}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.4)',
                                  color: '#fda4af',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Customer & Items 2-Col Grid */}
                        <div className="admin-form-row-title-split">
                          {/* Customer Details Box */}
                          <div
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              padding: '1rem'
                            }}
                          >
                            <h5 style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                              👤 Customer Contact &amp; Pickup Logistics
                            </h5>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                {cust.firstName} {cust.lastName}
                              </div>

                              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <Mail size={14} color="var(--emerald-light)" />
                                <span>{maskEmail(cust.email || ord.emailDispatchedTo)}</span>
                              </div>

                              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <Phone size={14} color="var(--emerald-light)" />
                                <span>{maskPhone(cust.phone)}</span>
                              </div>

                              <div className="flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <MapPin size={14} color="var(--emerald-light)" style={{ marginTop: '3px', flexShrink: 0 }} />
                                <span>
                                  {cust.street
                                    ? `${cust.street}, ${cust.city}, ${cust.province} ${cust.postalCode}`
                                    : '705 Progress Ave #32, Scarborough, ON (Warehouse Depot)'}
                                </span>
                              </div>

                              {ord.refundReason && (
                                <div style={{ color: '#fda4af', fontSize: '0.78rem', marginTop: '0.35rem', fontStyle: 'italic' }}>
                                  Refund reason: "{ord.refundReason}"
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Purchased Items & Itemized Tax */}
                          <div
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              padding: '1rem'
                            }}
                          >
                            <h5 style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                              📦 Ordered Items ({ord.items ? ord.items.length : 0})
                            </h5>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem', maxHeight: '110px', overflowY: 'auto' }}>
                              {ord.items &&
                                ord.items.map((it, idx) => (
                                  <div key={idx} className="flex items-center justify-between" style={{ fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                      {it.quantity}x {it.product?.title || 'Product Lot'}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--emerald-light)' }}>
                                      {formatCurrency(it.price * it.quantity)}
                                    </span>
                                  </div>
                                ))}
                            </div>

                            {/* Itemized 13% Ontario HST Breakdown */}
                            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-mono">{formatCurrency(ord.subtotal || ord.grandTotal / 1.13)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Ontario HST (13%):</span>
                                <span className="font-mono">{formatCurrency(ord.tax || ord.grandTotal - (ord.subtotal || ord.grandTotal / 1.13))}</span>
                              </div>
                              <div className="flex justify-between" style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--emerald-light)', marginTop: '0.25rem' }}>
                                <span>Total (CAD):</span>
                                <span className="font-mono">{formatCurrency(ord.grandTotal)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              TAB 3: OFFERS & NEGOTIATIONS
             ================================================================= */}
          {activeTab === 'offers' && (
            <div>
              {isLoadingOffers ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading offers from database...
                </div>
              ) : offersList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No incoming buyer offers recorded yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {offersList
                    .filter((off) => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        (off.productTitle || '').toLowerCase().includes(q) ||
                        (off.sku || '').toLowerCase().includes(q) ||
                        (off.customer?.name || '').toLowerCase().includes(q) ||
                        (off.customer?.phone || '').toLowerCase().includes(q)
                      );
                    })
                    .map((off) => {
                      const offerId = off.id || off._id;
                      const rawPhone = (off.customer?.phone || '').replace(/[^0-9+]/g, '');
                      const isAccepted = off.status === 'Accepted';
                      const isDeclined = off.status === 'Declined';
                      const isCountered = off.status === 'Countered';
                      const isPending = !isAccepted && !isDeclined && !isCountered;

                      const whatsappMsg = encodeURIComponent(
                        `Hi ${off.customer?.name || 'Customer'}! Your offer of ${formatCurrency(off.offeredPrice)} for ${off.productTitle} has been accepted by ApexxVault. When would you like to pick it up at our Scarborough Warehouse (705 Progress Ave #32)?`
                      );

                      return (
                        <div
                          key={offerId}
                          style={{
                            background: 'var(--bg-card)',
                            border: `1px solid ${
                              isAccepted
                                ? 'rgba(16, 185, 129, 0.4)'
                                : isDeclined
                                ? 'rgba(244, 63, 94, 0.3)'
                                : isCountered
                                ? 'rgba(59, 130, 246, 0.4)'
                                : 'var(--border-subtle)'
                            }`,
                            borderRadius: 'var(--radius-md)',
                            padding: '1.15rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            boxShadow: isAccepted ? '0 4px 16px rgba(16, 185, 129, 0.08)' : 'none'
                          }}
                        >
                          {/* Left: Product & Buyer Info */}
                          <div style={{ flex: 1, minWidth: '280px' }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
                              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.975rem' }}>
                                {off.productTitle}
                              </span>
                              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                                SKU #{off.sku}
                              </span>

                              {/* Status Badge */}
                              <span
                                style={{
                                  background: isAccepted
                                    ? 'var(--emerald-bg)'
                                    : isDeclined
                                    ? 'rgba(244, 63, 94, 0.15)'
                                    : isCountered
                                    ? 'var(--blue-bg)'
                                    : 'var(--gold-bg)',
                                  color: isAccepted
                                    ? 'var(--emerald-light)'
                                    : isDeclined
                                    ? '#fda4af'
                                    : isCountered
                                    ? 'var(--blue-light)'
                                    : 'var(--gold-light)',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                              >
                                {isAccepted && <CheckCircle2 size={11} />}
                                {isDeclined && <X size={11} />}
                                {isPending && <Clock size={11} />}
                                <span>{off.status || 'Pending'}</span>
                              </span>
                            </div>

                            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              Buyer: <strong style={{ color: 'var(--text-primary)' }}>{off.customer?.name}</strong> &bull; Phone:{' '}
                              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald-light)' }}>
                                {maskPhone(off.customer?.phone)}
                              </span>{' '}
                              {off.customer?.email ? `&bull; Email: ${maskEmail(off.customer?.email)}` : ''}
                            </div>

                            {off.note && (
                              <div
                                style={{
                                  fontSize: '0.78rem',
                                  color: 'var(--gold-light)',
                                  marginTop: '5px',
                                  fontStyle: 'italic',
                                  background: 'var(--bg-secondary)',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: 'var(--radius-xs)',
                                  display: 'inline-block'
                                }}
                              >
                                Buyer note: "{off.note}"
                              </div>
                            )}

                            {off.counterPrice && (
                              <div
                                style={{
                                  fontSize: '0.78rem',
                                  color: 'var(--blue-light)',
                                  marginTop: '4px',
                                  fontWeight: 700
                                }}
                              >
                                Counter-Offer Sent: {formatCurrency(off.counterPrice)}
                              </div>
                            )}
                          </div>

                          {/* Middle: Bid Price */}
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                              Proposed Bid (Qty {off.quantity})
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--emerald-light)', fontSize: '1.4rem', lineHeight: 1.1 }}>
                              {formatCurrency(off.offeredPrice)}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              Listed at {formatCurrency(off.liquidationPrice)}
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            {/* Accept Button */}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const res = await updateOfferStatusInDB(offerId, { status: 'Accepted' });
                                  if (res.success) {
                                    setOffersList((prev) =>
                                      prev.map((o) => (o.id === offerId || o._id === offerId ? { ...o, status: 'Accepted' } : o))
                                    );
                                    showSuccess(`Offer of ${formatCurrency(off.offeredPrice)} for ${off.productTitle} Accepted!`);
                                  }
                                } catch (err) {
                                  showAlert(err.message);
                                }
                              }}
                              style={{
                                background: isAccepted ? 'var(--emerald-primary)' : 'var(--emerald-bg)',
                                border: '1px solid var(--emerald-primary)',
                                color: isAccepted ? '#ffffff' : 'var(--emerald-light)',
                                padding: '0.45rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <CheckCircle2 size={13} />
                              <span>{isAccepted ? 'Accepted' : 'Accept'}</span>
                            </button>

                            {/* Counter-Offer Button */}
                            <button
                              type="button"
                              onClick={async () => {
                                const counterVal = window.prompt(
                                  `Enter counter-offer amount in CAD for "${off.productTitle}" (Buyer offered: ${formatCurrency(off.offeredPrice)}):`,
                                  `${Math.round((off.offeredPrice + (off.liquidationPrice || off.offeredPrice)) / 2)}`
                                );
                                if (!counterVal || isNaN(Number(counterVal))) return;
                                try {
                                  const res = await updateOfferStatusInDB(offerId, {
                                    status: 'Countered',
                                    counterPrice: Number(counterVal)
                                  });
                                  if (res.success) {
                                    setOffersList((prev) =>
                                      prev.map((o) =>
                                        o.id === offerId || o._id === offerId
                                          ? { ...o, status: 'Countered', counterPrice: Number(counterVal) }
                                          : o
                                      )
                                    );
                                    showSuccess(`Counter-offer of ${formatCurrency(Number(counterVal))} sent to ${off.customer?.name}!`);
                                  }
                                } catch (err) {
                                  showAlert(err.message);
                                }
                              }}
                              style={{
                                background: 'var(--blue-bg)',
                                border: '1px solid var(--blue-light)',
                                color: 'var(--blue-light)',
                                padding: '0.45rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Counter
                            </button>

                            {/* Decline Button */}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const res = await updateOfferStatusInDB(offerId, { status: 'Declined' });
                                  if (res.success) {
                                    setOffersList((prev) =>
                                      prev.map((o) => (o.id === offerId || o._id === offerId ? { ...o, status: 'Declined' } : o))
                                    );
                                    showAlert(`Offer for ${off.productTitle} marked as Declined.`);
                                  }
                                } catch (err) {
                                  showAlert(err.message);
                                }
                              }}
                              style={{
                                background: isDeclined ? 'rgba(244, 63, 94, 0.3)' : 'rgba(244, 63, 94, 0.1)',
                                border: '1px solid rgba(244, 63, 94, 0.3)',
                                color: '#fda4af',
                                padding: '0.45rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <X size={13} />
                              <span>{isDeclined ? 'Declined' : 'Decline'}</span>
                            </button>

                            {/* WhatsApp Buyer */}
                            {rawPhone && (
                              <a
                                href={`https://wa.me/${rawPhone.replace('+', '')}?text=${whatsappMsg}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: '#25d366',
                                  color: '#ffffff',
                                  padding: '0.45rem 0.65rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  textDecoration: 'none'
                                }}
                                title="Send WhatsApp to buyer"
                              >
                                <span>WhatsApp</span>
                              </a>
                            )}

                            {/* Delete Offer */}
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Delete offer from ${off.customer?.name}?`)) {
                                  try {
                                    const res = await deleteOfferFromDB(offerId);
                                    if (res.success) {
                                      setOffersList((prev) => prev.filter((o) => o.id !== offerId && o._id !== offerId));
                                      showSuccess('Offer deleted from database.');
                                    }
                                  } catch (err) {
                                    showAlert(err.message);
                                  }
                                }
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                padding: '0.45rem',
                                cursor: 'pointer'
                              }}
                              title="Delete Offer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              TAB 4: VIP DROP LEADS & SUBSCRIBERS
             ================================================================= */}
          {activeTab === 'subscribers' && (
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                  VIP Restock Drop Subscribers ({subscribersList.length})
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Opted-in for WhatsApp &amp; SMS Flash Drop Alerts
                </span>
              </div>

              {isLoadingSubscribers ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading subscriber leads...</div>
              ) : subscribersList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No drop subscribers registered yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>Subscriber Contact</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Channel</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Preferred Department</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Registered Date</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Direct Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribersList.map((sub, i) => (
                        <tr key={sub.id || sub._id || i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {maskPhone(sub.phone) || maskEmail(sub.email) || 'Anonymous'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span
                              style={{
                                background: sub.channel === 'whatsapp' ? 'rgba(37, 211, 102, 0.15)' : 'var(--blue-bg)',
                                color: sub.channel === 'whatsapp' ? '#25d366' : 'var(--blue-light)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.725rem',
                                fontWeight: 700
                              }}
                            >
                              {sub.channel?.toUpperCase() || 'SMS'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                            {sub.department || 'All Surplus Categories'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            {new Date(sub.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            {sub.phone && (
                              <a
                                href={`https://wa.me/${(sub.phone || '').replace(/[^0-9]/g, '')}?text=Hi!%20New%20ApexxVault%20overstock%20has%20arrived%20at%20Scarborough%20depot.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: 'var(--emerald-bg)',
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                  color: 'var(--emerald-light)',
                                  padding: '0.3rem 0.65rem',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  textDecoration: 'none'
                                }}
                              >
                                Send Restock Alert
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              TAB 5: USERS DIRECTORY & SECURITY (Finding A6, A13)
             ================================================================= */}
          {activeTab === 'customers' && (
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                  Registered Users &amp; Administrators ({customersList.length})
                </h4>

                {/* PII Masking Toggle (Finding A13: Customer PII Exposure) */}
                <button
                  type="button"
                  onClick={() => setMaskPII(!maskPII)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: maskPII ? 'var(--bg-secondary)' : 'var(--gold-bg)',
                    border: `1px solid ${maskPII ? 'var(--border-muted)' : 'rgba(245, 158, 11, 0.4)'}`,
                    color: maskPII ? 'var(--text-secondary)' : 'var(--gold-light)',
                    padding: '0.45rem 0.95rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Toggle masking of customer email addresses and phone numbers"
                >
                  {maskPII ? <EyeOff size={15} /> : <Eye size={15} />}
                  <span>{maskPII ? 'PII Masking Active' : 'PII Revealed'}</span>
                </button>
              </div>

              {isLoadingCustomers ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading user directory...</div>
              ) : (
                <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>User Name</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                        <th style={{ padding: '0.75rem 1rem' }}>City / Address</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customersList.map((usr) => (
                        <tr key={usr.id || usr._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {usr.firstName} {usr.lastName}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                            {maskEmail(usr.email)}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}>
                            {maskPhone(usr.phone)}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                            {maskPII ? `${usr.city || 'Scarborough'}, ON` : `${usr.street || ''}, ${usr.city || ''}, ${usr.province || 'ON'}`}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span
                              style={{
                                background: usr.role === 'admin' ? 'var(--gold-bg)' : 'var(--blue-bg)',
                                color: usr.role === 'admin' ? 'var(--gold-light)' : 'var(--blue-light)',
                                padding: '0.15rem 0.55rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                textTransform: 'uppercase'
                              }}
                            >
                              {usr.role}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <div className="flex items-center justify-end gap-2">
                              {/* Toggle Role Button */}
                              <button
                                onClick={() =>
                                  handleToggleUserRole(usr.id || usr._id, usr.role, `${usr.firstName} ${usr.lastName}`)
                                }
                                style={{
                                  background: 'var(--bg-card)',
                                  border: '1px solid var(--border-subtle)',
                                  color: 'var(--text-primary)',
                                  padding: '0.25rem 0.55rem',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '0.72rem',
                                  cursor: 'pointer'
                                }}
                                title="Change role between customer and admin"
                              >
                                {usr.role === 'admin' ? 'Demote to Customer' : 'Make Admin'}
                              </button>

                              {/* Delete User Button */}
                              <button
                                onClick={() =>
                                  handleDeleteUser(usr.id || usr._id, `${usr.firstName} ${usr.lastName}`)
                                }
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#f43f5e',
                                  cursor: 'pointer',
                                  padding: '4px'
                                }}
                                title="Delete user account"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              TAB 6: STORE SETTINGS & LEGAL POLICIES (Finding A3, A4)
             ================================================================= */}
          {activeTab === 'settings' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                  Store Profile, Depot Hours &amp; Legal Policies
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Configure your official Scarborough liquidation location, 13% Ontario HST, and customer agreement text.
                </p>
              </div>

              {isLoadingSettings ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading store settings...</div>
              ) : (
                <form onSubmit={handleSaveSettings}>
                  {/* Business Profile Row 1 */}
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--emerald-light)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                      🏢 Scarborough Depot Business Profile
                    </h5>

                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Store Business Name
                        </label>
                        <input
                          type="text"
                          value={storeSettings.businessName}
                          onChange={(e) => setStoreSettings({ ...storeSettings, businessName: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={storeSettings.email}
                          onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Depot Phone (Voice &amp; WhatsApp)
                        </label>
                        <input
                          type="text"
                          value={storeSettings.phone}
                          onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Operating Hours
                        </label>
                        <input
                          type="text"
                          value={storeSettings.hours}
                          onChange={(e) => setStoreSettings({ ...storeSettings, hours: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-row-3">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Depot Address (Customer Pickups)
                        </label>
                        <input
                          type="text"
                          value={storeSettings.address}
                          onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Ontario HST Rate
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={storeSettings.taxRate}
                          onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Currency
                        </label>
                        <input
                          type="text"
                          value={storeSettings.currency}
                          onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Legal Policies Customization (Finding A3) */}
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--gold-light)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                      📜 Legal &amp; Compliance Policy Content
                    </h5>

                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Privacy Policy Text (Markdown or Plain Text)
                        </label>
                        <textarea
                          rows={5}
                          value={storeSettings.privacyPolicy}
                          onChange={(e) => setStoreSettings({ ...storeSettings, privacyPolicy: e.target.value })}
                          placeholder="Leave blank to use default Ontario PIPEDA-compliant privacy policy..."
                          style={{ width: '100%', resize: 'vertical' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Terms of Service Text
                        </label>
                        <textarea
                          rows={5}
                          value={storeSettings.termsOfService}
                          onChange={(e) => setStoreSettings({ ...storeSettings, termsOfService: e.target.value })}
                          placeholder="Leave blank to use default Canadian commercial liquidation terms..."
                          style={{ width: '100%', resize: 'vertical' }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          AS-IS Sales &amp; Inspection Agreement
                        </label>
                        <textarea
                          rows={5}
                          value={storeSettings.asIsAgreement}
                          onChange={(e) => setStoreSettings({ ...storeSettings, asIsAgreement: e.target.value })}
                          placeholder="Leave blank to use default AS-IS wholesale agreement..."
                          style={{ width: '100%', resize: 'vertical' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Depot Pickup &amp; Hold Policy
                        </label>
                        <textarea
                          rows={5}
                          value={storeSettings.pickupPolicy}
                          onChange={(e) => setStoreSettings({ ...storeSettings, pickupPolicy: e.target.value })}
                          placeholder="Leave blank to use default 48-hour pickup window and loading dock policy..."
                          style={{ width: '100%', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        padding: '0.7rem 1.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        boxShadow: 'var(--shadow-emerald)',
                        cursor: isSavingSettings ? 'not-allowed' : 'pointer',
                        border: 'none'
                      }}
                    >
                      {isSavingSettings ? 'Saving Settings...' : 'Save All Store Settings & Policies'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
