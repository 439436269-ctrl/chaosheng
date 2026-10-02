import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS, GALLERY } from './data/products.js';
import { CAT_ORDER, CAT_DESC, NEW_ARRIVALS, DOCS } from './data/site.js';

const CatalogContext = createContext(null);

export function countOf(cat) {
  if (cat === '全部') return PRODUCTS.length;
  return PRODUCTS.filter((p) => p.cat === cat).length;
}

// 视图初始态：默认 PDF 画册展示；URL hash 可强制指定（#grid 进入网页目录）
function initialView() {
  try {
    if (location.hash === '#grid') return 'grid';
    if (location.hash === '#pdf') return 'pdf';
  } catch {
    /* ignore */
  }
  return 'pdf';
}

export function CatalogProvider({ children }) {
  const [activeCat, setActiveCat] = useState('全部');
  // 抽屉内容：{kind:'product', product} | {kind:'photo', src} | null
  const [detail, setDetail] = useState(null);
  // 全局视图模式：grid | pdf（导航栏与产品目录共用）
  const [view, setViewState] = useState(initialView);

  // 整页画册形态：body class 与 URL hash 同步
  useEffect(() => {
    document.body.classList.toggle('pdf-page', view === 'pdf');
    try {
      history.replaceState(null, '', view === 'pdf' ? '#pdf' : location.pathname + location.search);
    } catch {
      /* ignore */
    }
    return () => document.body.classList.remove('pdf-page');
  }, [view]);

  const setView = useCallback((v) => {
    setViewState(v);
  }, []);

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
    view,
    setView,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
