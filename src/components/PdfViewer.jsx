import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import {
  CATALOG_PAGES,
  catalogPageSrc,
  buildSpreadViews,
  buildSingleViews,
} from '../data/site.js';

const WIDE_QUERY = '(min-width: 900px)';

/**
 * PDF 画册查看器（跨页版）。
 * - 宽屏：01 封面单页，02–37 两两合并（跨页产品图完整展示），38+ 单页
 * - 窄屏：逐页展示
 * - 整页形态由 body.pdf-page + styles/pdf.css 控制；导航栏保持在查看器之上
 * - 支持：上一页/下一页（按视图步进）、页码跳转、← → 键、点图翻页、Esc 返回
 */
export default function PdfViewer({ view, onBack }) {
  const { t } = useI18n();
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(WIDE_QUERY).matches,
  );
  const [page, setPage] = useState(1); // 当前视图首页页码
  const [numText, setNumText] = useState('1');
  const [loading, setLoading] = useState({});
  const [started, setStarted] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const on = (e) => setWide(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // 视图列表：宽屏跨页 / 窄屏单页
  const views = useMemo(() => (wide ? buildSpreadViews() : buildSingleViews()), [wide]);

  // 当前视图索引（page 可能落在跨页视图中间，取包含它的视图）
  const idx = Math.max(
    0,
    views.findIndex((v) => v.includes(page)),
  );
  const current = views[idx];
  const isSpread = current.length > 1;

  // 视口宽度切换时，保持停留在同一页
  useEffect(() => {
    setPage((p) => {
      const found = views.find((v) => v.includes(p));
      return found ? found[0] : p;
    });
  }, [views]);

  const showView = (i) => {
    const next = Math.max(0, Math.min(views.length - 1, i));
    const target = views[next];
    setPage(target[0]);
    setNumText(String(target[0]));
    if (stageRef.current) stageRef.current.scrollTop = 0;
    // 预载相邻视图
    [next - 1, next + 1].forEach((j) => {
      (views[j] || []).forEach((n) => {
        new Image().src = catalogPageSrc(n);
      });
    });
  };

  // 页码输入：跳转到包含该页的视图
  const jumpToPage = (text) => {
    const n = Math.max(1, Math.min(CATALOG_PAGES, parseInt(text, 10) || 1));
    const i = views.findIndex((v) => v.includes(n));
    if (i >= 0) {
      showView(i);
    } else {
      setNumText(String(page));
    }
  };

  // 首次进入 PDF 模式才加载图片（并预载首批视图）
  useEffect(() => {
    if (view === 'pdf' && !started) {
      setStarted(true);
      views.slice(0, 4).forEach((v) =>
        v.forEach((n) => {
          new Image().src = catalogPageSrc(n);
        }),
      );
    }
  }, [view, started, views]); // eslint-disable-line react-hooks/exhaustive-deps

  // 键盘翻页（按视图步进）
  useEffect(() => {
    if (view !== 'pdf') return undefined;
    const onKey = (e) => {
      const ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') {
        showView(idx - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        showView(idx + 1);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onBack();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [view, idx, views]); // eslint-disable-line react-hooks/exhaustive-deps

  const markLoaded = (src) =>
    setLoading((m) => (m[src] === true ? m : { ...m, [src]: true }));

  const srcs = started ? current.map((n) => ({ n, src: catalogPageSrc(n) })) : [];

  return (
    <div className="pdf-viewer" id="pdfView">
      <div className="pv-bar">
        <button type="button" className="pv-back" onClick={onBack}>
          {t('pdf.back')}
        </button>
        <button
          type="button"
          className="pv-nav"
          disabled={idx <= 0}
          onClick={() => showView(idx - 1)}
        >
          {t('pdf.prev')}
        </button>
        <span className="pv-page">
          <input
            type="text"
            inputMode="numeric"
            aria-label="page number"
            value={numText}
            onChange={(e) => setNumText(e.target.value)}
            onBlur={(e) => jumpToPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                jumpToPage(e.target.value);
                e.currentTarget.blur();
              }
            }}
          />
          {isSpread && (
            <span className="pv-page-range">
              –{current[1]}
            </span>
          )}{' '}
          / <b>{CATALOG_PAGES}</b>
        </span>
        <button
          type="button"
          className="pv-nav"
          disabled={idx >= views.length - 1}
          onClick={() => showView(idx + 1)}
        >
          {t('pdf.next')}
        </button>
        <span className="pv-hint">{t('pdf.hint')}</span>
        <a
          className="pv-open"
          href="assets/docs/catalog-2020.pdf"
          target="_blank"
          rel="noopener"
        >
          {t('pdf.open')}
        </a>
      </div>
      <div className={`pv-stage${isSpread ? ' spread' : ''}`} ref={stageRef}>
        {srcs.map(({ n, src }) => (
          <img
            key={src}
            alt={`产品画册第 ${n} 页`}
            className={loading[src] === true ? undefined : 'loading'}
            src={src}
            // 已有缓存的图片在挂载时同步判定完成，避免过渡动画卡在半透明
            ref={(el) => {
              if (el && el.complete && el.naturalWidth > 0) markLoaded(src);
            }}
            onLoad={() => markLoaded(src)}
            onError={() => markLoaded(src)}
            onClick={() => view === 'pdf' && showView(idx + 1)}
          />
        ))}
      </div>
    </div>
  );
}
