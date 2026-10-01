import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { useCatalog, countOf } from '../catalog.jsx';
import PdfViewer from './PdfViewer.jsx';

function Tile({ product, hidden, index, onOpen }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            // 与原站一致的错峰入场
            setTimeout(() => el.classList.add('in'), Math.min(index % 12, 12) * 30);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index]);

  return (
    <button
      type="button"
      className={`tile${hidden ? ' hide' : ''}`}
      ref={ref}
      onClick={() => onOpen(product)}
    >
      <div className="imgwrap">
        <img
          src={product.img || `assets/products/${product.code}.jpg`}
          alt={product.name}
          loading="lazy"
        />
      </div>
      <div className="body">
        <div className="code">{product.code}</div>
        <div className="nm">{product.name}</div>
        <div className="meta">
          <div>
            <i>机型</i>
            {product.machine || '通用'}
          </div>
          <div>
            <i>件号</i>
            {product.part || '—'}
          </div>
        </div>
      </div>
    </button>
  );
}

function initialView() {
  try {
    if (location.hash === '#pdf') return 'pdf';
    if (location.hash === '#grid') return 'grid';
    return localStorage.getItem('cs_view') || 'grid';
  } catch {
    return 'grid';
  }
}

export default function ProductsSection() {
  const { t } = useI18n();
  const { products, cats, activeCat, setActiveCat, visible, openProduct } = useCatalog();
  const [view, setView] = useState(initialView);

  // 整页形态：body class 与 URL hash 同步
  useEffect(() => {
    document.body.classList.toggle('pdf-page', view === 'pdf');
    try {
      history.replaceState(null, '', view === 'pdf' ? '#pdf' : location.pathname + location.search);
    } catch {
      /* ignore */
    }
    return () => document.body.classList.remove('pdf-page');
  }, [view]);

  const changeView = (v) => {
    setView(v);
    try {
      localStorage.setItem('cs_view', v);
    } catch {
      /* ignore */
    }
  };

  // 与原站一致：全量渲染 + hide 类过滤（筛选切换不重建 DOM）
  return (
    <section
      className={`section${view === 'pdf' ? ' pdf-mode' : ''}`}
      id="products"
      style={{ paddingTop: '12px' }}
    >
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{t('sec.products_k')}</div>
            <h2 className="section-title">{t('sec.products')}</h2>
            <div className="section-rule" />
          </div>
          <div className="head-right">
            <div className="count-line">
              {visible.length} {t('count.prefix')}
              {activeCat}
            </div>
            <div className="view-switch">
              <button
                type="button"
                className={`vs-btn${view === 'grid' ? ' on' : ''}`}
                onClick={() => changeView('grid')}
              >
                {t('view.grid')}
              </button>
              <button
                type="button"
                className={`vs-btn${view === 'pdf' ? ' on' : ''}`}
                onClick={() => changeView('pdf')}
              >
                {t('view.pdf')}
              </button>
            </div>
          </div>
        </div>

        <div className="filters" id="chips">
          {cats.map((c) => (
            <button
              type="button"
              key={c}
              className={`chip${c === activeCat ? ' on' : ''}`}
              onClick={() => setActiveCat(c)}
            >
              {c}
              <span className="n">{countOf(c)}</span>
            </button>
          ))}
        </div>

        <div className="grid" id="grid">
          {products.map((p, i) => (
            <Tile
              key={i}
              index={i}
              product={p}
              hidden={activeCat !== '全部' && p.cat !== activeCat}
              onOpen={openProduct}
            />
          ))}
        </div>

        <PdfViewer view={view} onBack={() => changeView('grid')} />
      </div>
    </section>
  );
}
