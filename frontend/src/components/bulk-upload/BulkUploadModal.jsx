import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  HelpCircle,
  FileText,
  PackageCheck
} from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';
import { parseCsvFile, processManifestRows, downloadSampleCsv } from '../../utils/csvParser';
import { formatCurrency } from '../../utils/formatters';
import { CONDITIONS, CATEGORIES } from '../../data/auctionEvents';

export const BulkUploadModal = () => {
  const {
    isBulkUploadOpen,
    setIsBulkUploadOpen,
    bulkUploadProducts,
    selectedEventId
  } = useAuction();

  const [activeTab, setActiveTab] = useState('file');
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [parsedProducts, setParsedProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [batchCondition, setBatchCondition] = useState('');

  const fileInputRef = useRef(null);

  if (!isBulkUploadOpen) return null;

  // Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file) => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const json = JSON.parse(text);
        const arrayData = Array.isArray(json) ? json : json.items || json.products || [];
        const prods = processManifestRows(arrayData, null, selectedEventId);
        setParsedProducts(prods);
      } else {
        const results = await parseCsvFile(file);
        if (!results.data || results.data.length === 0) {
          throw new Error('The uploaded CSV file was empty or could not be read.');
        }
        const prods = processManifestRows(results.data, null, selectedEventId);
        if (prods.length === 0) {
          throw new Error('Could not detect valid product rows. Ensure headers like Title and Price/MSRP exist.');
        }
        setParsedProducts(prods);
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setErrorMsg(err.message || 'Failed to parse file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPastedText = async () => {
    if (!pasteText.trim()) return;
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const results = await parseCsvFile(pasteText);
      const prods = processManifestRows(results.data, null, selectedEventId);
      if (prods.length === 0) {
        throw new Error('No valid product rows detected in pasted text.');
      }
      setParsedProducts(prods);
    } catch (err) {
      setErrorMsg(err.message || 'Error parsing pasted CSV text.');
    } finally {
      setIsProcessing(false);
    }
  };


  const handleApplyBatchCondition = (condition) => {
    setBatchCondition(condition);
    if (!condition) return;
    setParsedProducts((prev) =>
      prev.map((p) => ({
        ...p,
        condition,
        conditionNotes: `Condition verified as ${condition}.`
      }))
    );
  };

  const handleDeleteRow = (index) => {
    setParsedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCellChange = (index, field, value) => {
    setParsedProducts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const totalMSRP = parsedProducts.reduce((acc, p) => acc + (Number(p.retailMSRP) || 0), 0);
  const totalPrice = parsedProducts.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
  const totalUnits = parsedProducts.reduce((acc, p) => acc + (Number(p.stockQty) || 1), 0);

  const handlePublishAll = () => {
    if (parsedProducts.length === 0) return;
    bulkUploadProducts(parsedProducts, 'Direct Warehouse Manifest');
    setParsedProducts([]);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsBulkUploadOpen(false)}>
      <div
        className="modal-content bulk-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UploadCloud size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>1-Click Bulk Product Manifest Uploader</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Upload every single item at once via CSV, Excel or JSON without listing items individually.
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={() => setIsBulkUploadOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {parsedProducts.length === 0 ? (
            <div>
              {/* Tabs */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <button
                  className={`category-pill-btn ${activeTab === 'file' ? 'active' : ''}`}
                  onClick={() => setActiveTab('file')}
                >
                  <FileSpreadsheet size={15} /> Upload CSV / Excel File
                </button>
                <button
                  className={`category-pill-btn ${activeTab === 'paste' ? 'active' : ''}`}
                  onClick={() => setActiveTab('paste')}
                >
                  <FileText size={15} /> Paste Manifest Text
                </button>
              </div>

              {/* Tab 1: File Dropzone */}
              {activeTab === 'file' && (
                <div>
                  <div
                    className={`manifest-dropzone ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv, .txt, .json"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <div className="dropzone-icon-circle">
                      <UploadCloud size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                      Drag & Drop your inventory manifest spreadsheet here
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Imports SKU, Title, Category, Condition, Liquidation Price, MSRP, Stock Qty, and Warehouse Location.
                    </p>
                    <button
                      type="button"
                      className="btn-buy-now"
                      style={{ padding: '0.55rem 1.5rem', display: 'inline-block' }}
                    >
                      Browse Manifest File from Computer
                    </button>
                  </div>

                  <div className="flex items-center justify-between" style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-2" style={{ fontSize: '0.85rem' }}>
                      <HelpCircle size={16} color="var(--cyan-primary)" />
                      <span>Need a standard spreadsheet template?</span>
                    </div>
                    <button
                      onClick={downloadSampleCsv}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: 'var(--emerald-primary)',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={14} /> Download Sample CSV Template
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Paste CSV */}
              {activeTab === 'paste' && (
                <div>
                  <textarea
                    rows={8}
                    placeholder="Paste CSV text here (SKU, Title, Category, Condition, Liquidation Price, MSRP, Stock Qty)..."
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      padding: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                  <div className="flex items-center justify-end" style={{ marginTop: '1rem' }}>
                    <button
                      className="btn-bulk-upload"
                      onClick={handleProcessPastedText}
                      disabled={!pasteText.trim()}
                    >
                      Parse & Preview Products
                    </button>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem'
                }}>
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}
            </div>
          ) : (
            /* Step 2: Interactive Table Preview */
            <div>
              {/* Batch Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                background: 'var(--bg-card)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Parsed Products</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {parsedProducts.length} Items ({totalUnits} Units)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Retail MSRP</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {formatCurrency(totalMSRP)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Liquidation Inventory Value</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald-primary)' }}>
                    {formatCurrency(totalPrice)}
                  </div>
                </div>
              </div>

              {/* Batch Tools */}
              <div className="flex items-center justify-between gap-4" style={{ marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Batch Assign Condition:
                  </span>
                  <select
                    value={batchCondition}
                    onChange={(e) => handleApplyBatchCondition(e.target.value)}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="">-- Batch Change All --</option>
                    {CONDITIONS.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setParsedProducts([])}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Trash2 size={13} /> Clear & Re-Upload
                </button>
              </div>

              {/* Table */}
              <div className="manifest-table-wrap">
                <table className="manifest-preview-table">
                  <thead>
                    <tr>
                      <th style={{ width: '110px' }}>SKU</th>
                      <th>Product Title</th>
                      <th style={{ width: '120px' }}>Category</th>
                      <th style={{ width: '130px' }}>Condition</th>
                      <th style={{ width: '100px' }}>MSRP</th>
                      <th style={{ width: '110px' }}>Store Price</th>
                      <th style={{ width: '70px' }}>Stock</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedProducts.map((p, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            value={p.sku}
                            onChange={(e) => handleCellChange(idx, 'sku', e.target.value)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.8rem',
                              width: '100%'
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => handleCellChange(idx, 'title', e.target.value)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-primary)',
                              fontSize: '0.825rem',
                              fontWeight: 600,
                              width: '100%'
                            }}
                          />
                        </td>
                        <td>
                          <select
                            value={p.category}
                            onChange={(e) => handleCellChange(idx, 'category', e.target.value)}
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.75rem',
                              borderRadius: '4px',
                              padding: '2px 4px',
                              width: '100%'
                            }}
                          >
                            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            value={p.condition}
                            onChange={(e) => handleCellChange(idx, 'condition', e.target.value)}
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.75rem',
                              borderRadius: '4px',
                              padding: '2px 4px',
                              width: '100%'
                            }}
                          >
                            {CONDITIONS.map((cond) => (
                              <option key={cond.id} value={cond.id}>{cond.id}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={p.retailMSRP}
                            onChange={(e) => handleCellChange(idx, 'retailMSRP', Number(e.target.value))}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.8rem',
                              width: '80px'
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => handleCellChange(idx, 'price', Number(e.target.value))}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--emerald-primary)',
                              fontWeight: 700,
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.8rem',
                              width: '80px'
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={p.stockQty}
                            onChange={(e) => handleCellChange(idx, 'stockQty', Number(e.target.value))}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.8rem',
                              width: '50px'
                            }}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteRow(idx)}
                            style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                            title="Remove row"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between" style={{ marginTop: '1.25rem' }}>
                <button
                  className="btn-add-cart"
                  onClick={() => setIsBulkUploadOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn-buy-now"
                  onClick={handlePublishAll}
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Sparkles size={18} />
                  <span>Publish All {parsedProducts.length} Items to Live Store</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
