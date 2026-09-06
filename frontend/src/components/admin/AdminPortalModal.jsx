import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
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
  fetchSubscribersFromDB
} from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';

export const AdminPortalModal = () => {
  const {
    isAdminPortalOpen,
    setIsAdminPortalOpen,
    products,
    loadProducts,
    orders,
    setOrders,
    setIsBulkUploadOpen
  } = useAuction();
  const { showSuccess, showAlert } = useNotification();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'customers' | 'offers' | 'subscribers'
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    category: 'electronics',
    condition: 'Brand New',
    conditionNotes: '',
    price: '',
    retailMSRP: '',
    stockQty: '1',
    warehouseLocation: 'Bay A-01',
    imageUrl: '',
    description: ''
  });

  // Customers State
  const [customersList, setCustomersList] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Offers State
  const [offersList, setOffersList] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);

  // Subscribers State
  const [subscribersList, setSubscribersList] = useState([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);

  // Load Data when switching tabs
  useEffect(() => {
    if (!isAdminPortalOpen) return;
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
    }
  }, [isAdminPortalOpen, activeTab]);

  if (!isAdminPortalOpen) return null;

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset Product Form
  const resetForm = () => {
    setFormData({
      title: '',
      sku: '',
      category: 'electronics',
      condition: 'Brand New',
      conditionNotes: '',
      price: '',
      retailMSRP: '',
      stockQty: '1',
      warehouseLocation: 'Bay A-01',
      imageUrl: '',
      description: ''
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
      setActionError('Title and Liquidation Price are required.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      sku: formData.sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      category: formData.category,
      condition: formData.condition,
      conditionNotes: formData.conditionNotes.trim() || 'Factory inspected & verified',
      price: Number(formData.price),
      retailMSRP: Number(formData.retailMSRP) || Number(formData.price),
      stockQty: Number(formData.stockQty) || 1,
      warehouseLocation: formData.warehouseLocation.trim() || 'Bay 1',
      images: formData.imageUrl.trim()
        ? [formData.imageUrl.trim()]
        : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800'],
      description: formData.description.trim()
    };

    try {
      if (editingProductId) {
        const res = await updateProductInDB(editingProductId, payload);
        if (res.success) {
          setActionSuccess(`Updated item "${formData.title}" successfully!`);
          loadProducts();
          resetForm();
        } else {
          setActionError(res.error || 'Failed to update product');
        }
      } else {
        const res = await createProductInDB(payload);
        if (res.success) {
          setActionSuccess(`Published "${formData.title}" to store catalog!`);
          loadProducts();
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
      sku: product.sku || '',
      category: product.category || 'electronics',
      condition: product.condition || 'Brand New',
      conditionNotes: product.conditionNotes || '',
      price: product.price?.toString() || '',
      retailMSRP: product.retailMSRP?.toString() || '',
      stockQty: product.stockQty?.toString() || '1',
      warehouseLocation: product.warehouseLocation || '',
      imageUrl: product.images && product.images[0] ? product.images[0] : '',
      description: product.description || ''
    });
    setIsAddingProduct(true);
  };

  // Delete Product
  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the store catalog?`)) {
      const res = await deleteProductInDB(id);
      if (res.success) {
        setActionSuccess(`Removed "${title}" from inventory.`);
        loadProducts();
      }
    }
  };

  // Release Order Trigger
  const handleReleaseOrder = async (orderId) => {
    const res = await markOrderReleasedInDB(orderId);
    if (res.success) {
      setActionSuccess(`Order #${orderId} marked as Released to Customer!`);
      const updatedOrders = await fetchOrdersFromDB();
      setOrders(updatedOrders);
    }
  };

  // Filtered Products for Table
  const filteredInventory = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.warehouseLocation && p.warehouseLocation.toLowerCase().includes(q))
    );
  });

  // Filtered Orders for Table
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
    <div className="modal-backdrop" onClick={() => setIsAdminPortalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1100px', width: '95vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--gold-bg)',
                color: 'var(--gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                  ApexVault Admin Console
                </h3>
                <span
                  style={{
                    background: 'var(--gold-bg)',
                    color: 'var(--gold-light)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}
                >
                  ADMIN PRIVILEGES
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Manage catalog items, inspect customer purchase orders &amp; monitor store directory
              </p>
            </div>
          </div>

          <button
            className="modal-close-btn"
            onClick={() => setIsAdminPortalOpen(false)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.75rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div className="tab-button-group" style={{ maxWidth: '680px', flexWrap: 'wrap' }}>
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
          </div>

          {/* Search in Admin */}
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.2rem', paddingRight: '0.75rem', fontSize: '0.825rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Status Messages */}
        {actionSuccess && (
          <div style={{ background: 'var(--emerald-bg)', color: 'var(--emerald-light)', padding: '0.6rem 1.75rem', fontSize: '0.825rem', borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}>
            ✓ {actionSuccess}
          </div>
        )}
        {actionError && (
          <div style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#fda4af', padding: '0.6rem 1.75rem', fontSize: '0.825rem', borderBottom: '1px solid rgba(244, 63, 94, 0.2)' }}>
            ⚠ {actionError}
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem' }}>
          {/* =================================================================
              TAB 1: INVENTORY MANAGEMENT
             ================================================================= */}
          {activeTab === 'inventory' && (
            <div>
              {/* Top Action Bar */}
              <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}>
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
                      background: isAddingProduct ? 'var(--bg-secondary)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                    <span>{isAddingProduct ? 'Cancel Form' : 'Add New Item to Website'}</span>
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
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--emerald-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} />
                    {editingProductId ? 'Edit Store Product' : 'Create & Publish New Product'}
                  </h4>

                  <form onSubmit={handleSaveProduct}>
                    {/* Row 1: Title & SKU */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Product Title *
                        </label>
                        <input
                          type="text"
                          required
                          name="title"
                          placeholder="e.g. Apple iPad Pro 11-inch M4 256GB"
                          value={formData.title}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

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
                    </div>

                    {/* Row 2: Category, Condition, Bay */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Category
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
                          Warehouse Bay Location
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

                    {/* Row 3: Pricing & Stock */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Liquidation Price ($ CAD) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          name="price"
                          placeholder="e.g. 199.99"
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
                          placeholder="e.g. 599.99"
                          value={formData.retailMSRP}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          Stock Units Available
                        </label>
                        <input
                          type="number"
                          min="1"
                          name="stockQty"
                          placeholder="1"
                          value={formData.stockQty}
                          onChange={handleInputChange}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Row 4: Image URL */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Product Image URL
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
                      />
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
                          cursor: 'pointer'
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
                      <th style={{ padding: '0.75rem 1rem' }}>Condition</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                      <th style={{ padding: '0.75rem 1rem' }}>MSRP</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Stock</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Location</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item.id || item._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {item.sku}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', maxWidth: '280px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Category: {item.category}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span className="badge-condition" style={{ fontSize: '0.7rem' }}>
                            {item.condition}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--emerald-light)' }}>
                          {formatCurrency(item.price)}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {formatCurrency(item.retailMSRP)}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                          <span style={{ color: item.stockQty > 0 ? 'var(--emerald-light)' : '#fda4af' }}>
                            {item.stockQty} units
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                          {item.warehouseLocation || 'Bay 1'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              style={{ color: 'var(--blue-light)', padding: '4px' }}
                              title="Edit Item"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.id || item._id, item.title)}
                              style={{ color: 'var(--rose-primary)', padding: '4px' }}
                              title="Delete Item"
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
              TAB 2: CUSTOMER PURCHASE ORDERS
             ================================================================= */}
          {activeTab === 'orders' && (
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Customer Purchase Orders ({filteredOrders.length})
              </h4>

              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No customer orders found matching your search.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {filteredOrders.map((ord) => {
                    const cust = ord.customer || {};
                    const isReleased = ord.status === 'Released to Customer';

                    return (
                      <div
                        key={ord.orderId || ord._id}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '1.25rem 1.5rem',
                          boxShadow: 'var(--shadow-xs)'
                        }}
                      >
                        {/* Order Header */}
                        <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div className="flex items-center gap-3">
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--emerald-light)', fontSize: '1rem' }}>
                              #{ord.orderId}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Pickup Code: <strong style={{ color: 'var(--text-primary)' }}>{ord.pickupCode}</strong>
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(ord.date || ord.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              style={{
                                background: isReleased ? 'var(--emerald-bg)' : 'var(--gold-bg)',
                                color: isReleased ? 'var(--emerald-light)' : 'var(--gold-light)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: `1px solid ${isReleased ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                              }}
                            >
                              {ord.status || 'Ready for Warehouse Pickup'}
                            </span>

                            {!isReleased && (
                              <button
                                onClick={() => handleReleaseOrder(ord.orderId)}
                                style={{
                                  background: 'var(--emerald-primary)',
                                  color: '#ffffff',
                                  padding: '0.35rem 0.85rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Mark as Released
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Customer & Items 2-Col Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
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
                              👤 Customer Contact &amp; Shipping Details
                            </h5>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                {cust.firstName} {cust.lastName}
                              </div>

                              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <Mail size={14} color="var(--emerald-light)" />
                                <span>{cust.email || ord.emailDispatchedTo || 'N/A'}</span>
                              </div>

                              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <Phone size={14} color="var(--emerald-light)" />
                                <span>{cust.phone || 'N/A'}</span>
                              </div>

                              <div className="flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <MapPin size={14} color="var(--emerald-light)" style={{ marginTop: '3px', flexShrink: 0 }} />
                                <span>
                                  {cust.street ? `${cust.street}, ${cust.city}, ${cust.province} ${cust.postalCode}` : 'Local Warehouse Pickup Depot'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Purchased Items & Totals */}
                          <div
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              padding: '1rem'
                            }}
                          >
                            <h5 style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                              📦 Purchased Items ({ord.items ? ord.items.length : 0})
                            </h5>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem', maxHeight: '120px', overflowY: 'auto' }}>
                              {ord.items &&
                                ord.items.map((it, idx) => (
                                  <div key={idx} className="flex items-center justify-between" style={{ fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                      {it.quantity}x {it.product?.title || 'Product Item'}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--emerald-light)' }}>
                                      {formatCurrency(it.price * it.quantity)}
                                    </span>
                                  </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Paid via {ord.paymentMethod || 'Stripe'}
                              </span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 900, color: 'var(--emerald-light)' }}>
                                {formatCurrency(ord.grandTotal)}
                              </span>
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
              TAB 3: CUSTOMER DIRECTORY
             ================================================================= */}
          {activeTab === 'customers' && (
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Registered Customer Directory ({customersList.length})
              </h4>

              {isLoadingCustomers ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading customers...</div>
              ) : (
                <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>Customer Name</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Phone Number</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Full Address</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Registered Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customersList.map((usr) => (
                        <tr key={usr.id || usr._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {usr.firstName} {usr.lastName}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                            {usr.email}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}>
                            {usr.phone}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                            {usr.street}, {usr.city}, {usr.province} {usr.postalCode}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span
                              style={{
                                background: usr.role === 'admin' ? 'var(--gold-bg)' : 'var(--blue-bg)',
                                color: usr.role === 'admin' ? 'var(--gold-light)' : 'var(--blue-light)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.7rem',
                                fontWeight: 700
                              }}
                            >
                              {usr.role}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            {new Date(usr.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: OFFERS & NEGOTIATIONS                                              */}
          {/* ========================================================================= */}
          {activeTab === 'offers' && (
            <div>
              {isLoadingOffers ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading offers from MongoDB...
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
                        (off.customer?.phone || '').toLowerCase().includes(q) ||
                        (off.customer?.email || '').toLowerCase().includes(q)
                      );
                    })
                    .map((off) => {
                      const offerId = off.id || off._id;
                      const rawPhone = (off.customer?.phone || '').replace(/[^0-9+]/g, '');
                      const isAccepted = off.status === 'Accepted';
                      const isDeclined = off.status === 'Declined';
                      const isPending = !isAccepted && !isDeclined;

                      const whatsappMsg = encodeURIComponent(
                        `Hi ${off.customer?.name || 'Customer'}! Your offer of ${formatCurrency(off.offeredPrice)} for ${off.productTitle} has been accepted by ApexxVault. When would you like to pick it up at our Scarborough Warehouse (705 Progress Ave #32)?`
                      );

                      return (
                        <div
                          key={offerId}
                          style={{
                            background: 'var(--bg-card)',
                            border: `1px solid ${isAccepted ? 'rgba(16, 185, 129, 0.4)' : isDeclined ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-subtle)'}`,
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
                                  background: isAccepted ? 'var(--emerald-bg)' : isDeclined ? 'rgba(244, 63, 94, 0.15)' : 'var(--gold-bg)',
                                  color: isAccepted ? 'var(--emerald-light)' : isDeclined ? '#fda4af' : 'var(--gold-light)',
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
                              Buyer: <strong style={{ color: 'var(--text-primary)' }}>{off.customer?.name}</strong> • Phone: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald-light)' }}>{off.customer?.phone}</span> {off.customer?.email ? `• Email: ${off.customer?.email}` : ''}
                            </div>

                            {off.note && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', marginTop: '5px', fontStyle: 'italic', background: 'var(--bg-secondary)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-xs)', display: 'inline-block' }}>
                                Buyer note: "{off.note}"
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
                                    setOffersList((prev) => prev.map((o) => (o.id === offerId || o._id === offerId ? { ...o, status: 'Accepted' } : o)));
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

                            {/* Decline Button */}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const res = await updateOfferStatusInDB(offerId, { status: 'Declined' });
                                  if (res.success) {
                                    setOffersList((prev) => prev.map((o) => (o.id === offerId || o._id === offerId ? { ...o, status: 'Declined' } : o)));
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

                            {/* Call Buyer */}
                            {rawPhone && (
                              <a
                                href={`tel:${rawPhone}`}
                                style={{
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-muted)',
                                  color: 'var(--text-primary)',
                                  padding: '0.45rem 0.65rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  textDecoration: 'none'
                                }}
                                title="Call buyer phone"
                              >
                                <Phone size={13} color="var(--blue-light)" />
                                <span>Call</span>
                              </a>
                            )}

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
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
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

          {/* ========================================================================= */}
          {/* TAB 5: DROP ALERT SUBSCRIBERS / LEADS                                     */}
          {/* ========================================================================= */}
          {activeTab === 'subscribers' && (
            <div>
              {isLoadingSubscribers ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading subscribers from MongoDB...
                </div>
              ) : subscribersList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No drop alert subscribers yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>Subscriber Name</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                        <th style={{ padding: '0.75rem 1rem' }}>SMS Phone</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Alert Categories</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Channel</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Date Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribersList.map((sub) => (
                        <tr key={sub.id || sub._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {sub.name || 'Anonymous Buyer'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--emerald-light)' }}>
                            {sub.email}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}>
                            {sub.phone || '—'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {Array.isArray(sub.preferredCategories) ? sub.preferredCategories.join(', ') : 'All'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{ background: 'var(--gold-bg)', color: 'var(--gold-light)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700 }}>
                              {sub.notifyVia || 'Email'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
