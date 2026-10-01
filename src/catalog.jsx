import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { PRODUCTS, GALLERY } from './data/products.js';
import { CAT_ORDER, CAT_DESC, NEW_ARRIVALS, DOCS } from './data/site.js';

const CatalogContext = createContext(null);

export function countOf(cat) {
  if (cat === '全部') return PRODUCTS.length;
  return PRODUCTS.filter((p) => p.cat === cat).length;
}

export function CatalogProvider({ children }) {
  const [activeCat, setActiveCat] = useState('全部');
  // 抽屉内容：{kind:'product', product} | {kind:'photo', src} | null
  const [detail, setDetail] = useState(null);

  const cats = useMemo(() => {
    const seen = new Set(PRODUCTS.map((p) => p.cat));
    const rest = [...seen].filter((c) => !CAT_ORDER.includes(c));
    return ['全部', ...CAT_ORDER.filter((c) => c !== '全部' && seen.has(c)), ...rest.sort()];
  }, []);

  const visible = useMemo(
    () => (activeCat === '全部' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === activeCat)),
    [activeCat],
  );

  const pickCat = useCallback((cat) => {
    setActiveCat(cat);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const openProduct = useCallback((product) => setDetail({ kind: 'product', product }), []);
  const openPhoto = useCallback((src) => setDetail({ kind: 'photo', src }), []);
  const closeDetail = useCallback(() => setDetail(null), []);

  const value = {
    products: PRODUCTS,
    gallery: GALLERY,
    news: NEW_ARRIVALS,
    docs: DOCS,
    catDesc: CAT_DESC,
    cats,
    activeCat,
    setActiveCat,
    pickCat,
    visible,
    detail,
    openProduct,
    openPhoto,
    closeDetail,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
