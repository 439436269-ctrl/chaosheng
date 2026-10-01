import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { CATALOG_PAGES, catalogPageSrc } from '../data/site.js';

/**
 * PDF 画册查看器。
 * - view='pdf' 时由外层 .pdf-mode + body.pdf-page 切换为整页形态（样式见 styles/pdf.css）
 * - 支持：上一页/下一页、页码输入（Enter 跳页）、← → 键翻页、点图翻页、Esc 返回
 */
export default function PdfViewer({ view, onBack }) {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [numText, setNumText] = useState('1');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const stageRef = useRef(null);

  const show = (n) => {
    const next = Math.max(1, Math.min(CATALOG_PAGES, parseInt(n, 10) || 1));
    setPage(next);
    setNumText(String(next));
    if (stageRef.current) stageRef.current.scrollTop = 0;
    // 预载相邻页
    if (next < CATALOG_PAGES) new Image().src = catalogPageSrc(next + 1);
    if (next > 1) new Image().src = catalogPageSrc(next - 1);
  };

  // 首次进入 PDF 模式才加载图片（与原站 lazy 行为一致）
  useEffect(() => {
    if (view === 'pdf' && !started) {
      setStarted(true);
      setLoading(true);
      show(1);
    }
  }, [view, started]); // eslint-disable-line react-hooks/exhaustive-deps

  // 键盘翻页
  useEffect(() => {
    if (view !== 'pdf') return undefined;
    const onKey = (e) => {
      const ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') {
        show(page - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        show(page + 1);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onBack();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [view, page, onBack]); // eslint-disable-line react-hooks/exhaustive-deps

  const src = started ? catalogPageSrc(page) : '';

  return (
    <div className="pdf-viewer" id="pdfView">
      <div className="pv-bar">
        <button type="button" className="pv-back" onClick={onBack}>
          {t('pdf.back')}
        </button>
        <button
          type="button"
          className="pv-nav"
          disabled={page <= 1}
          onClick={() => show(page - 1)}
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
            onBlur={(e) => show(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                show(e.target.value);
                e.currentTarget.blur();
              }
            }}
          />{' '}
          / <b>{CATALOG_PAGES}</b>
        </span>
        <button
          type="button"
          className="pv-nav"
          disabled={page >= CATALOG_PAGES}
          onClick={() => show(page + 1)}
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
      <div className="pv-stage" ref={stageRef}>
        <img
          id="pvImg"
          alt="产品画册页面"
          className={loading ? 'loading' : undefined}
          src={src || undefined}
          style={src ? undefined : { display: 'none' }}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          onClick={() => view === 'pdf' && show(page + 1)}
        />
      </div>
    </div>
  );
}
