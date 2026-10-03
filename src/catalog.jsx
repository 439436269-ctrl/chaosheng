import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS, GALLERY } from './data/products.js';
import { CAT_ORDER, CAT_DESC, NEW_ARRIVALS, DOCS } from './data/site.js';

const CatalogContext = createContext(null);

export function countOf(cat) {
  if (cat === '全部') return PRODUCTS.length;
  return PRODUCTS.filter((p) => p.cat === cat).length;
}

// 视图初始态：默认 PDF 画册展示；URL 参数 ?view=grid|pdf 指定（兼容旧链接 #grid/#pdf）
function initialView() {
  try {
    const v = new URLSearchParams(location.search).get('view');
    if (v === 'grid') return 'grid';
    if (v === 'pdf') return 'pdf';
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

  // 整页画册形态：body class 与 URL 参数（?view=grid|pdf）同步；旧版 #grid/#pdf 迁移为参数
  useEffect(() => {
    document.body.classList.toggle('pdf-page', view === 'pdf');
    try {
      const params = new URLSearchParams(location.search);
      params.set('view', view);
      if (view !== 'pdf') params.delete('page');
      // 清除旧版视图 hash；切到网页目录时同时清掉页锚点 #page-…。分区锚点（#products 等）保留
      const legacy = location.hash === '#grid' || location.hash === '#pdf';
      const pageAnchor = /^#page-/.test(location.hash);
      let hash = location.hash;
      if (legacy || (view !== 'pdf' && pageAnchor)) hash = '';
      const qs = params.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + hash);
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
