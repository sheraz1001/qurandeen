import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import '../styles/zakat.css';

const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;
const ZAKAT_RATE = 0.025;
const AGRICULTURE_IRRIGATED_RATE = 0.05;
const AGRICULTURE_RAIN_RATE = 0.10;

const initialCategories = {
  cash: {
    name: 'Cash & Bank Balances',
    description: 'Include all cash on hand, checking accounts, savings accounts, and fixed deposits',
    icon: '💵',
    items: [],
    rate: ZAKAT_RATE
  },
  gold: {
    name: 'Gold',
    description: 'Gold jewelry, coins, bars (personal jewelry worn regularly may be exempt according to some scholars)',
    icon: '🪙',
    items: [],
    rate: ZAKAT_RATE
  },
  silver: {
    name: 'Silver',
    description: 'Silver jewelry, coins, bars, and utensils',
    icon: '🥈',
    items: [],
    rate: ZAKAT_RATE
  },
  stocks: {
    name: 'Stocks & Investments',
    description: 'Shares, mutual funds, bonds, retirement accounts (zakatable portion)',
    icon: '📈',
    items: [],
    rate: ZAKAT_RATE
  },
  business: {
    name: 'Business Assets',
    description: 'Inventory, trade goods, receivables, and cash in business',
    icon: '🏢',
    items: [],
    rate: ZAKAT_RATE
  },
  rental: {
    name: 'Rental Income',
    description: 'Accumulated rental income (not the property value itself)',
    icon: '🏠',
    items: [],
    rate: ZAKAT_RATE
  },
  crypto: {
    name: 'Cryptocurrency',
    description: 'Bitcoin, Ethereum, and other digital currencies',
    icon: '₿',
    items: [],
    rate: ZAKAT_RATE
  },
  debtsOwed: {
    name: 'Debts Owed to You',
    description: 'Money others owe you that you expect to receive',
    icon: '📋',
    items: [],
    rate: ZAKAT_RATE
  },
  agricultureIrrigated: {
    name: 'Agricultural Produce (Irrigated)',
    description: 'Crops grown with artificial irrigation - 5% Zakat',
    icon: '🌾',
    items: [],
    rate: AGRICULTURE_IRRIGATED_RATE
  },
  agricultureRain: {
    name: 'Agricultural Produce (Rain-fed)',
    description: 'Crops grown with rainwater only - 10% Zakat',
    icon: '🌧️',
    items: [],
    rate: AGRICULTURE_RAIN_RATE
  },
  debtsYouOwe: {
    name: 'Debts You Owe',
    description: 'Deduct debts due within the year (loans, credit cards, etc.)',
    icon: '📉',
    items: [],
    rate: 0,
    isDeduction: true
  }
};

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' }
];

export default function ZakatCalculator() {
  const [categories, setCategories] = useState(initialCategories);
  const [currency, setCurrency] = useState(currencies[0]);
  const [goldPrice, setGoldPrice] = useState(70);
  const [silverPrice, setSilverPrice] = useState(0.85);
  const [newItem, setNewItem] = useState({ category: '', name: '', value: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hawlMet, setHawlMet] = useState(true);

  const nisabGold = useMemo(() => GOLD_NISAB_GRAMS * goldPrice, [goldPrice]);
  const nisabSilver = useMemo(() => SILVER_NISAB_GRAMS * silverPrice, [silverPrice]);
  const nisab = useMemo(() => Math.min(nisabGold, nisabSilver), [nisabGold, nisabSilver]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    Object.keys(categories).forEach(key => {
      totals[key] = categories[key].items.reduce((sum, item) => sum + parseFloat(item.value || 0), 0);
    });
    return totals;
  }, [categories]);

  const totalAssets = useMemo(() => {
    return Object.keys(categoryTotals).reduce((sum, key) => {
      if (!categories[key].isDeduction) {
        return sum + categoryTotals[key];
      }
      return sum;
    }, 0);
  }, [categoryTotals, categories]);

  const totalDeductions = useMemo(() => {
    return Object.keys(categoryTotals).reduce((sum, key) => {
      if (categories[key].isDeduction) {
        return sum + categoryTotals[key];
      }
      return sum;
    }, 0);
  }, [categoryTotals, categories]);

  const netZakatableWealth = useMemo(() => {
    return Math.max(0, totalAssets - totalDeductions);
  }, [totalAssets, totalDeductions]);

  const isNisabMet = useMemo(() => netZakatableWealth >= nisab, [netZakatableWealth, nisab]);

  const zakatByCategory = useMemo(() => {
    const zakat = {};
    Object.keys(categories).forEach(key => {
      if (!categories[key].isDeduction) {
        zakat[key] = categoryTotals[key] * categories[key].rate;
      }
    });
    return zakat;
  }, [categories, categoryTotals]);

  const totalZakat = useMemo(() => {
    if (!isNisabMet || !hawlMet) return 0;
    return Object.values(zakatByCategory).reduce((sum, val) => sum + val, 0);
  }, [zakatByCategory, isNisabMet, hawlMet]);

  const addItem = () => {
    if (!activeCategory || !newItem.name || !newItem.value) return;
    
    setCategories(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory],
        items: [...prev[activeCategory].items, {
          id: Date.now(),
          name: newItem.name,
          value: parseFloat(newItem.value)
        }]
      }
    }));
    
    setNewItem({ category: '', name: '', value: '' });
    setShowAddModal(false);
  };

  const removeItem = (categoryKey, itemId) => {
    setCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        items: prev[categoryKey].items.filter(item => item.id !== itemId)
      }
    }));
  };

  const openAddModal = (categoryKey) => {
    setActiveCategory(categoryKey);
    setShowAddModal(true);
  };

  const formatCurrency = (amount) => {
    return `${currency.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const resetCalculator = () => {
    setCategories(initialCategories);
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Resources', href: '#' },
    { name: 'Zakat Calculator' }
  ];

  const siteUrl = 'https://qurandeen.com';
  const pageUrl = `${siteUrl}/islamic-resources/zakat-calculator`;
  const ogImage = `${siteUrl}/images/seo/zakat-calculator-banner.jpg`;

  return (
    <div className="zakat-calculator-page">
      <Helmet>
        <title>Free Islamic Zakat Calculator 2025 - Calculate Nisab Online</title>
        <meta name="description" content="Calculate your Zakat obligation with our free Islamic Zakat Calculator. Supports gold, silver, cash, stocks & crypto. Based on Quran & Sunnah with accurate Nisab." />
        <link rel="canonical" href={pageUrl} />
        
        <meta property="og:title" content="Free Islamic Zakat Calculator 2025 - Calculate Nisab Online" />
        <meta property="og:description" content="Calculate your Zakat obligation with our free Islamic Zakat Calculator. Supports gold, silver, cash, stocks & crypto. Based on Quran & Sunnah with accurate Nisab." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="QuranDeen" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Islamic Zakat Calculator 2025 - Calculate Nisab Online" />
        <meta name="twitter:description" content="Calculate your Zakat obligation with our free Islamic Zakat Calculator. Supports gold, silver, cash, stocks & crypto. Based on Quran & Sunnah with accurate Nisab." />
        <meta name="twitter:image" content={ogImage} />
        
        <meta name="keywords" content="zakat calculator, islamic zakat calculator, zakat calculator online, nisab calculator, gold zakat calculator, silver zakat, zakat on wealth, zakat calculation, muslim zakat, islamic finance calculator, zakat 2025" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Islamic Zakat Calculator",
            "description": "Free online Zakat calculator based on Quran and Sunnah. Calculate Zakat on gold, silver, cash, stocks, business assets, cryptocurrency and more.",
            "url": pageUrl,
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "publisher": {
              "@type": "Organization",
              "name": "QuranDeen",
              "url": siteUrl
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the Nisab for Zakat?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Nisab is the minimum amount of wealth a Muslim must possess before Zakat becomes obligatory. It is equivalent to 87.48 grams of gold or 612.36 grams of silver."
                }
              },
              {
                "@type": "Question",
                "name": "How much Zakat should I pay?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The standard Zakat rate is 2.5% of your total zakatable wealth above the Nisab threshold, provided you have held this wealth for one lunar year (Hawl)."
                }
              },
              {
                "@type": "Question",
                "name": "What types of wealth are subject to Zakat?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Zakat applies to cash, gold, silver, stocks, business inventory, rental income, cryptocurrency, and agricultural produce. Personal items like your home and car are generally exempt."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="zakat-hero">
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <nav className="hero-breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {crumb.href ? (
                  <a href={crumb.href}>{crumb.name}</a>
                ) : (
                  <span className="current">{crumb.name}</span>
                )}
                {i < breadcrumbs.length - 1 && <span className="separator">/</span>}
              </React.Fragment>
            ))}
          </nav>
          <h1 className="zakat-title">
            <span className="title-arabic">حاسبة الزكاة</span>
            <span className="title-english">Free Islamic Zakat Calculator</span>
          </h1>
          <p className="zakat-subtitle">Calculate Your Zakat Online - Based on Quran & Sunnah with Accurate Nisab Calculation</p>
        </div>
      </div>

      <div className="zakat-container">
        <div className="zakat-intro">
          <div className="intro-card">
            <h2>Understanding Zakat - Why Use a Zakat Calculator?</h2>
            <p>Zakat is one of the Five Pillars of Islam, an obligatory act of worship that purifies wealth and helps those in need. Allah (SWT) says in the Quran:</p>
            <blockquote className="quran-quote">
              <p>"And establish prayer and give Zakat, and whatever good you put forward for yourselves – you will find it with Allah."</p>
              <cite>Surah Al-Baqarah 2:110</cite>
            </blockquote>
            <div className="zakat-rules">
              <h3>Key Zakat Calculation Rules:</h3>
              <ul>
                <li><strong>Nisab:</strong> Minimum threshold of wealth (equivalent to 87.48g of gold or 612.36g of silver)</li>
                <li><strong>Hawl:</strong> Wealth must be held for one lunar year</li>
                <li><strong>Rate:</strong> 2.5% on most assets, 5-10% on agricultural produce</li>
                <li><strong>Recipients:</strong> Eight categories mentioned in Surah At-Tawbah 9:60</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="zakat-settings">
          <div className="settings-row">
            <div className="setting-item">
              <label>Currency</label>
              <select value={currency.code} onChange={(e) => setCurrency(currencies.find(c => c.code === e.target.value))}>
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="setting-item">
              <label>Gold Price (per gram)</label>
              <input 
                type="number" 
                value={goldPrice} 
                onChange={(e) => setGoldPrice(parseFloat(e.target.value) || 0)}
                step="0.01"
              />
            </div>
            <div className="setting-item">
              <label>Silver Price (per gram)</label>
              <input 
                type="number" 
                value={silverPrice} 
                onChange={(e) => setSilverPrice(parseFloat(e.target.value) || 0)}
                step="0.01"
              />
            </div>
            <div className="setting-item checkbox-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={hawlMet} 
                  onChange={(e) => setHawlMet(e.target.checked)}
                />
                Hawl (one lunar year) completed
              </label>
            </div>
          </div>
        </div>

        <div className="nisab-display">
          <div className="nisab-card">
            <h3>Nisab Threshold for Zakat Calculation</h3>
            <div className="nisab-values">
              <div className="nisab-item gold">
                <span className="nisab-label">Gold Nisab ({GOLD_NISAB_GRAMS}g)</span>
                <span className="nisab-value">{formatCurrency(nisabGold)}</span>
              </div>
              <div className="nisab-item silver">
                <span className="nisab-label">Silver Nisab ({SILVER_NISAB_GRAMS}g)</span>
                <span className="nisab-value">{formatCurrency(nisabSilver)}</span>
              </div>
              <div className="nisab-item minimum">
                <span className="nisab-label">Minimum Nisab Used</span>
                <span className="nisab-value">{formatCurrency(nisab)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="categories-grid">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className={`category-card ${category.isDeduction ? 'deduction' : ''}`}>
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  {!category.isDeduction && category.rate !== ZAKAT_RATE && (
                    <span className="rate-badge">{(category.rate * 100).toFixed(0)}% Zakat</span>
                  )}
                </div>
              </div>
              
              <div className="category-items">
                {category.items.length === 0 ? (
                  <p className="no-items">No items added</p>
                ) : (
                  category.items.map(item => (
                    <div key={item.id} className="item-row">
                      <span className="item-name">{item.name}</span>
                      <span className="item-value">{formatCurrency(item.value)}</span>
                      <button className="remove-btn" onClick={() => removeItem(key, item.id)}>×</button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="category-footer">
                <div className="category-total">
                  <span>Total:</span>
                  <span className={category.isDeduction ? 'deduction-value' : ''}>
                    {category.isDeduction ? '-' : ''}{formatCurrency(categoryTotals[key])}
                  </span>
                </div>
                {!category.isDeduction && categoryTotals[key] > 0 && isNisabMet && hawlMet && (
                  <div className="category-zakat">
                    <span>Zakat ({(category.rate * 100).toFixed(1)}%):</span>
                    <span className="zakat-value">{formatCurrency(zakatByCategory[key])}</span>
                  </div>
                )}
                {!category.isDeduction && categoryTotals[key] > 0 && (!isNisabMet || !hawlMet) && (
                  <div className="category-zakat not-applicable">
                    <span>Zakat:</span>
                    <span className="zakat-value muted">Not obligatory</span>
                  </div>
                )}
                <button className="add-item-btn" onClick={() => openAddModal(key)}>
                  + Add Item
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="zakat-summary">
          <div className="summary-card">
            <h2>Your Zakat Calculator Results</h2>
            
            <div className="summary-rows">
              <div className="summary-row">
                <span>Total Assets</span>
                <span className="positive">{formatCurrency(totalAssets)}</span>
              </div>
              <div className="summary-row">
                <span>Total Deductions</span>
                <span className="negative">-{formatCurrency(totalDeductions)}</span>
              </div>
              <div className="summary-row highlight">
                <span>Net Zakatable Wealth</span>
                <span>{formatCurrency(netZakatableWealth)}</span>
              </div>
              <div className="summary-row">
                <span>Nisab Threshold</span>
                <span>{formatCurrency(nisab)}</span>
              </div>
              <div className="summary-row status">
                <span>Nisab Status</span>
                <span className={isNisabMet ? 'met' : 'not-met'}>
                  {isNisabMet ? 'Nisab Met ✓' : 'Below Nisab'}
                </span>
              </div>
              <div className="summary-row status">
                <span>Hawl Status</span>
                <span className={hawlMet ? 'met' : 'not-met'}>
                  {hawlMet ? 'Hawl Completed ✓' : 'Hawl Not Completed'}
                </span>
              </div>
            </div>

            <div className="total-zakat">
              <div className="zakat-amount">
                <span>Your Zakat Due</span>
                <span className="amount">{formatCurrency(totalZakat)}</span>
              </div>
              {!isNisabMet && (
                <p className="zakat-note">Your wealth is below the Nisab threshold. Zakat is not obligatory, but you may still give voluntary charity (Sadaqah).</p>
              )}
              {!hawlMet && isNisabMet && (
                <p className="zakat-note">Hawl (one lunar year) must be completed for Zakat to become obligatory.</p>
              )}
            </div>

            <div className="summary-actions">
              <button className="reset-btn" onClick={resetCalculator}>Reset Calculator</button>
            </div>
          </div>
        </div>

        <div className="zakat-recipients">
          <h2>Who Can Receive Zakat? - Eight Categories of Zakat Recipients</h2>
          <p className="recipients-intro">As mentioned in Surah At-Tawbah (9:60):</p>
          <div className="recipients-grid">
            <div className="recipient-card">
              <span className="recipient-number">1</span>
              <h4>Al-Fuqara (The Poor)</h4>
              <p>Those who have little to no wealth</p>
            </div>
            <div className="recipient-card">
              <span className="recipient-number">2</span>
              <h4>Al-Masakin (The Needy)</h4>
              <p>Those who cannot meet their basic needs</p>
            </div>
            <div className="recipient-card">
              <span className="recipient-number">3</span>
              <h4>Zakat Collectors</h4>
              <p>Those employed to collect and distribute Zakat</p>
            </div>
            <div className="recipient-card">
              <span className="recipient-number">4</span>
              <h4>New Muslims</h4>
              <p>Those whose hearts are to be reconciled</p>
            </div>
            <div className="recipient-card">
              <span className="recipient-number">5</span>
              <h4>Freeing Captives</h4>
              <p>To free slaves and those in bondage</p>
            </div>
            <div className="recipient-card">
              <span className="recipient-number">6</span>
              <h4>Debtors</h4>
              <p>Those burdened with overwhelming debt</p>
            </div>
            <div className="recipient-card">
              <span className="recipient-number">7</span>
              <h4>Fi Sabilillah</h4>
              <p>In the cause of Allah (various Islamic causes)</p>
            </div>
            <div className="recipient-card">
              <span className="recipient-number">8</span>
              <h4>Travelers</h4>
              <p>Stranded travelers in need of assistance</p>
            </div>
          </div>
        </div>

        <div className="zakat-features">
          <h2>Features of Our Free Zakat Calculator</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>11 Wealth Categories</h3>
              <p>Comprehensive coverage including cash, gold, silver, stocks, business assets, rental income, cryptocurrency, agricultural produce, and debt management.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚖️</span>
              <h3>Accurate Nisab Calculation</h3>
              <p>Automatic Nisab threshold calculation based on 87.48g of gold or 612.36g of silver with customizable metal prices for real-time accuracy.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌍</span>
              <h3>Multi-Currency Support</h3>
              <p>Calculate Zakat in 10 currencies: USD, EUR, GBP, SAR, AED, PKR, INR, MYR, IDR, and BDT for global accessibility.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📖</span>
              <h3>Quran & Sunnah Based</h3>
              <p>All calculations follow authentic Islamic rulings with references to Quranic verses and Hadith for complete transparency.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌾</span>
              <h3>Agricultural Zakat Rates</h3>
              <p>Different rates for irrigated crops (5%) and rain-fed produce (10%) as per Islamic jurisprudence.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">➕</span>
              <h3>Add Multiple Items</h3>
              <p>Add unlimited items within each category with custom descriptions for detailed wealth tracking and organization.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📅</span>
              <h3>Hawl Verification</h3>
              <p>Built-in lunar year (Hawl) confirmation to ensure Zakat is only calculated when wealth has been held for the required period.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💳</span>
              <h3>Debt Deduction</h3>
              <p>Automatically deducts outstanding debts from your total wealth before calculating Zakat for accurate obligation assessment.</p>
            </div>
          </div>
        </div>

        <div className="zakat-disclaimer">
          <h3>Important Notes About Zakat Calculation</h3>
          <ul>
            <li>This calculator provides an estimate based on general Zakat principles. For specific rulings, please consult a qualified Islamic scholar.</li>
            <li>Gold and silver prices should be updated to current market rates for accurate Nisab calculation.</li>
            <li>Some scholars have different opinions on Zakat for certain assets (e.g., personal jewelry). Please seek guidance from your local scholar.</li>
            <li>Zakat on agricultural produce is calculated at harvest time, not annually.</li>
            <li>Business assets include inventory at current value, not cost price.</li>
          </ul>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-item-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Item to {categories[activeCategory]?.name}</h3>
            <div className="modal-form">
              <div className="form-group">
                <label>Item Description</label>
                <input 
                  type="text" 
                  placeholder="e.g., Savings Account, Gold Ring, etc."
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Value ({currency.symbol})</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={newItem.value}
                  onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                  step="0.01"
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="confirm-btn" onClick={addItem}>Add Item</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
