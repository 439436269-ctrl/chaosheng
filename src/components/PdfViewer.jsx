import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import {
  CATALOG_PAGES,
  catalogPageSrc,
  catalogDisplaySrc,
  catalogMidSrc,
  catalogPageKind,
  catalogHtmlId,
  catalogPageLabel,
  findPageByLabel,
  buildSpreadViews,
} from '../data/site.js';
import CatalogHtmlPage from './CatalogHtmlPage.jsx';

const clampScale = (s) => Math.min(4, Math.max(0.5, s));

// 页码令牌 → 位置页码：支持位置数字（'41'）与独立页号（'2026-01'）；越界钳制
function resolvePageToken(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (/^\d{4}-\d+$/.test(s)) return findPageByLabel(s);
  const n = parseInt(s, 10);
  return Number.isFinite(n) && n >= 1 ? Math.min(n, CATALOG_PAGES) : null;
}

// 页锚点初始值：#page-… 优先，兼容 ?page=；归一到所在视图首页
function initialPage() {
  try {
    const m = /^#page-(.+)$/.exec(location.hash);
    const raw = m ? m[1] : new URLSearchParams(location.search).get('page');
    const n = resolvePageToken(raw);
    if (n) {
      const v = buildSpreadViews().find((x) => x.includes(n));
      return v ? v[0] : 1;
    }
  } catch {
    /* ignore */
  }
  return 1;
}

// 页码在 URL 中的令牌：HTML 页用独立页号（2026-01），扫描页用位置页码
const pageToken = (n) => catalogPageLabel(n) || String(n);

/**
 * 全屏放大查看器：
 * - 滚轮/双指缩放（以指针为锚点）、拖拽平移
 * - 点内容：fit ↔ 1.6 倍切换；点空白/✕/Esc 关闭
 * - 图片页加载高清原图叠加；HTML 页为矢量内容，任意倍数直接清晰
 */
function PageZoom({ displaySrc, fullSrc, htmlId, pageNumber, pageLabel, label, onClose, onShowProduct }) {
  const { t } = useI18n();
  const [vt, setVt] = useState({ s: 1, x: 0, y: 0 });
  const [fullReady, setFullReady] = useState(false);
  const [fullFailed, setFullFailed] = useState(false);

  // 放大目标切换（整页 ↔ 商品图）时复位视口，避免沿用上一个视图的缩放/位移
  useEffect(() => {
    setVt({ s: 1, x: 0, y: 0 });
  }, [displaySrc, fullSrc, htmlId]);

  // 显示层秒开，全尺寸原图后台加载完成后无闪烁叠加替换（HTML 页无需原图）
  useEffect(() => {
    if (!fullSrc) return undefined;
    setFullReady(false);
    setFullFailed(false);
    const im = new Image();
    im.onload = () => setFullReady(true);
    im.onerror = () => setFullFailed(true);
    im.src = fullSrc;
    return () => {
      im.onload = null;
      im.onerror = null;
      im.src = '';
    };
  }, [fullSrc]);
  const wrapRef = useRef(null);
  const ptsRef = useRef(new Map());
  const lastDistRef = useRef(null);
  const dragRef = useRef(null);
  const movedRef = useRef(false);

  // 滚轮缩放（非 passive，阻止页面滚动）
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left - rect.width / 2;
      const py = e.clientY - rect.top - rect.height / 2;
      const f = Math.exp(-e.deltaY * 0.0016);
      setVt((v) => {
        const ns = Math.min(4, Math.max(0.5, v.s * f));
        const eff = ns / v.s;
        // 保持指针下的点不动
        return { s: ns, x: px - (px - v.x) * eff, y: py - (py - v.y) * eff };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const step = (k) => setVt((v) => ({ ...v, s: Math.min(4, Math.max(0.5, v.s * k)) }));

  const onPointerDown = (e) => {
    if (e.target.closest('button')) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    ptsRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    movedRef.current = false;
    if (ptsRef.current.size === 2) {
      const [a, b] = [...ptsRef.current.values()];
      lastDistRef.current = Math.hypot(a.x - b.x, a.y - b.y);
      dragRef.current = null;
    } else if (ptsRef.current.size === 1) {
      dragRef.current = {
        x0: e.clientX,
        y0: e.clientY,
        tx0: vt.x,
        ty0: vt.y,
        // 点内容（图片或 HTML 页内部）：fit ↔ 放大；点深色背景：关闭
        onImg: !!e.target.closest('.pv-zoom-inner'),
        // 点商品图（data-full）：切换为该商品原图
        prod: e.target.closest('img[data-full]'),
      };
    }
  };

  const onPointerMove = (e) => {
    const pts = ptsRef.current;
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pts.size >= 2) {
      const [a, b] = [...pts.values()];
      const nd = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastDistRef.current) {
        const rect = wrapRef.current.getBoundingClientRect();
        const cx = (a.x + b.x) / 2 - rect.left - rect.width / 2;
        const cy = (a.y + b.y) / 2 - rect.top - rect.height / 2;
        const f = nd / lastDistRef.current;
        setVt((v) => {
          const ns = Math.min(4, Math.max(0.5, v.s * f));
          const eff = ns / v.s;
          return { s: ns, x: cx - (cx - v.x) * eff, y: cy - (cy - v.y) * eff };
        });
        lastDistRef.current = nd;
      }
      movedRef.current = true;
      return;
    }

    const d = dragRef.current;
    if (d) {
      const dx = e.clientX - d.x0;
      const dy = e.clientY - d.y0;
      if (Math.abs(dx) + Math.abs(dy) > 5) movedRef.current = true;
      setVt((v) => ({ ...v, x: d.tx0 + dx, y: d.ty0 + dy }));
    }
  };

  const onPointerUp = (e) => {
    const pts = ptsRef.current;
    pts.delete(e.pointerId);
    if (pts.size < 2) lastDistRef.current = null;
    if (pts.size === 0) {
      const d = dragRef.current;
      if (d && !movedRef.current && !e.target.closest('button')) {
        if (d.prod && onShowProduct) {
          // 点商品 → 放大该商品原图
          onShowProduct(d.prod);
        } else if (d.onImg) {
          // 点其他内容：fit ↔ 放大
          setVt((v) => (v.s > 1.05 ? { s: 1, x: 0, y: 0 } : { s: 1.6, x: 0, y: 0 }));
        } else {
          onClose();
        }
      }
      dragRef.current = null;
    }
  };

  return (
    <div
      ref={wrapRef}
      className="pv-zoom"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="pv-zoom-inner"
        style={{ transform: `translate(${vt.x}px, ${vt.y}px) scale(${vt.s})` }}
      >
        {htmlId ? (
          <div className="pv-zoom-hp">
            <CatalogHtmlPage id={htmlId} pageNumber={pageNumber} label={pageLabel} />
          </div>
        ) : (
          <>
            <img className="pv-zoom-base" src={displaySrc} alt={label} draggable={false} />
            {fullReady && (
              <img className="pv-zoom-full" src={fullSrc} alt="" draggable={false} />
            )}
          </>
        )}
      </div>
      <span className="pv-zoom-label">{label}</span>
      {fullSrc && !fullReady && !fullFailed && (
        <span className="pv-zoom-badge">{t('pdf.zoom.loading')}</span>
      )}
      {fullSrc && fullFailed && <span className="pv-zoom-badge">{t('pdf.zoom.failed')}</span>}
      <div className="pv-zoom-tools">
        <button type="button" onClick={() => step(1.3)} aria-label="zoom in">
          ＋
        </button>
        <button type="button" onClick={() => step(1 / 1.3)} aria-label="zoom out">
          －
        </button>
        <button type="button" onClick={() => setVt({ s: 1, x: 0, y: 0 })} aria-label="reset">
          ⟲
        </button>
        <button type="button" className="pv-zoom-close" onClick={onClose} aria-label="close">
          ✕
        </button>
      </div>
      <span className="pv-zoom-hint">{t('pdf.zoom.hint')}</span>
    </div>
  );
}

/**
 * PDF 画册查看器（跨页版）。
 * - 跨页按原书页对：01 封面单页，02–37 相邻原书页两两合并，38+ 单页；HTML 插页恒单页
 * - URL 锚点：当前页写入 #page-<令牌>（扫描页为位置页码、HTML 页为独立页号如 2026-01），
 *   也兼容 ?page= 输入；视图模式由 ?view=grid|pdf 参数表达（见 catalog.jsx）
 * - 加载策略：stage 用显示层小图（约 1/6 体积）fetchpriority=high 秒开；
 *   相邻视图显示层待当前加载完再低优先预载，翻页自动取消过期预载；原图仅放大时加载
 * - stage 两侧大翻页按钮；点图片进入全屏放大（不再是翻页）
 */
export default function PdfViewer({ view, onBack }) {
  const { t } = useI18n();
  const [page, setPage] = useState(initialPage); // 当前视图首页页码（可由 ?page= / #page-… 初始化）
  const [numText, setNumText] = useState(() => pageToken(page));
  const [loaded, setLoaded] = useState({});
  const [started, setStarted] = useState(false);
  const [zoom, setZoom] = useState(null); // {src,label} 或 {htmlId,pageNumber,pageLabel,label}
  const stageRef = useRef(null);

  // 视图列表：全端统一跨页（36–37 等两两合并），布局交由 CSS 自适应
  const views = useMemo(() => buildSpreadViews(), []);

  // 当前视图索引（page 可能落在跨页视图中间，取包含它的视图）
  const idx = Math.max(
    0,
    views.findIndex((v) => v.includes(page)),
  );
  const current = views[idx];
  const isSpread = current.length > 1;

  const markLoaded = (src) => setLoaded((m) => (m[src] ? m : { ...m, [src]: true }));

  // 在途预载表：翻页时可取消，防止过期请求堆积占满带宽（响应截图中的队列问题）
  const preloadRef = useRef(new Map());

  // 当前视图（显示层）全部加载完后，才低优先预载相邻视图；视图切换即取消旧预载
  // HTML 页无图片 src，视为已加载（组件随视图即时渲染）
  useEffect(() => {
    if (!started) return undefined;
    const imgSrc = (n) => {
      const s = catalogDisplaySrc(n);
      return catalogPageKind(n) === 'image' ? s : null;
    };
    // 取消不再属于当前邻居的在途预载
    const alive = new Set();
    [idx - 1, idx, idx + 1].forEach((j) =>
      (views[j] || []).forEach((n) => {
        const s = imgSrc(n);
        if (!s) return;
        alive.add(s);
        alive.add(catalogMidSrc(n));
      }),
    );
    preloadRef.current.forEach((im, s) => {
      if (!alive.has(s)) {
        im.onload = null;
        im.onerror = null;
        im.src = ''; // 中止下载
        preloadRef.current.delete(s);
      }
    });

    const allLoaded = current.every((n) => {
      const s = imgSrc(n);
      return !s || loaded[s];
    });
    if (!allLoaded) return undefined;
    const timer = setTimeout(() => {
      // 按设备像素比选择预载档位：DPR1 用 952px 中间档，高分屏用 1488px
      const midPreferred = (window.devicePixelRatio || 1) < 1.5;
      [idx - 1, idx + 1].forEach((j) =>
        (views[j] || []).forEach((n) => {
          if (catalogPageKind(n) !== 'image') return;
          const s = midPreferred ? catalogMidSrc(n) : catalogDisplaySrc(n);
          if (preloadRef.current.has(s) || loaded[catalogDisplaySrc(n)]) return;
          const im = new Image();
          try {
            im.fetchPriority = 'low';
          } catch {
            /* ignore */
          }
          im.onload = () => preloadRef.current.delete(s);
          im.onerror = () => preloadRef.current.delete(s);
          im.src = s;
          preloadRef.current.set(s, im);
        }),
      );
    }, 150);
    return () => clearTimeout(timer);
  }, [started, idx, views, current, loaded]);

  // 卸载时清空全部在途预载
  useEffect(() => () => {
    preloadRef.current.forEach((im) => {
      im.onload = null;
      im.onerror = null;
      im.src = '';
    });
    preloadRef.current.clear();
  }, []);

  const showView = (i) => {
    const next = Math.max(0, Math.min(views.length - 1, i));
    const target = views[next];
    setPage(target[0]);
    setNumText(pageToken(target[0]));
    if (stageRef.current) stageRef.current.scrollTop = 0;
  };

  // 页码输入：跳转到包含该页的视图；支持位置数字（41）与独立页号（2026-01）
  const jumpToPage = (text) => {
    const n = resolvePageToken(text);
    if (n == null) {
      setNumText(pageToken(page));
      return;
    }
    const i = views.findIndex((v) => v.includes(n));
    if (i >= 0) {
      showView(i);
    } else {
      setNumText(pageToken(page));
    }
  };

  // 页锚点：把当前页写入 URL（#page-…；?view= 由 catalog 管理，?page= 输入被归一为锚点）
  useEffect(() => {
    if (view !== 'pdf') return;
    try {
      const want = `#page-${pageToken(page)}`;
      const params = new URLSearchParams(location.search);
      const hadParam = params.has('page');
      if (location.hash === want && !hadParam) return;
      if (hadParam) params.delete('page');
      const qs = params.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + want);
    } catch {
      /* ignore */
    }
  }, [view, page]);

  // 页锚点跳转：hash 变为 #page-… 时（外部粘贴/页内链接）切到对应视图
  useEffect(() => {
    if (view !== 'pdf') return undefined;
    const onHash = () => {
      const m = /^#page-(.+)$/.exec(location.hash);
      if (!m) return;
      const n = resolvePageToken(m[1]);
      if (n == null) return;
      const i = views.findIndex((v) => v.includes(n));
      if (i >= 0) showView(i);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [view, views]); // eslint-disable-line react-hooks/exhaustive-deps

  // 首次进入 PDF 模式才开始加载（只加载当前视图，不批量预载）
  useEffect(() => {
    if (view === 'pdf' && !started) setStarted(true);
  }, [view, started]);

  // 键盘翻页（按视图步进）；放大层打开时 Esc 只关放大层
  useEffect(() => {
    if (view !== 'pdf') return undefined;
    const onKey = (e) => {
      const ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
      if (zoom) {
        if (e.key === 'Escape') {
          setZoom((z) => (z && z.back) || null);
          e.preventDefault();
        }
        return;
      }
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
  }, [view, zoom, idx, views]); // eslint-disable-line react-hooks/exhaustive-deps

  // stage 用显示层小图（118KB 均值，全尺寸 1/6），点放大才加载原图；HTML 页直接渲染组件
  const srcs = started
    ? current.map((n) => ({
        n,
        kind: catalogPageKind(n),
        htmlId: catalogHtmlId(n),
        pageLabel: catalogPageLabel(n),
        src: catalogDisplaySrc(n),
      }))
    : [];

  const openZoom = (item) => {
    if (view !== 'pdf') return;
    const tok = pageToken(item.n);
    if (item.kind === 'html') {
      setZoom({
        htmlId: item.htmlId,
        pageNumber: item.n,
        pageLabel: item.pageLabel,
        label: `${tok} / ${CATALOG_PAGES}`,
      });
    } else {
      setZoom({
        displaySrc: item.src,
        fullSrc: catalogPageSrc(item.n),
        label: `${tok} / ${CATALOG_PAGES}`,
      });
    }
  };

  // 点商品 → 放大该商品原图（data-full）；back 为来源视图（放大层点入时返回）
  const showProduct = (imgEl, back) => {
    if (view !== 'pdf') return;
    setZoom({
      displaySrc: imgEl.getAttribute('src') || imgEl.dataset.full,
      fullSrc: imgEl.dataset.full,
      label: `${imgEl.dataset.code} · ${imgEl.alt}`,
      back: back || null,
    });
  };

  // 关闭放大：有来源视图则返回来源（商品图 → 整页），否则回舞台
  const closeZoom = () => setZoom((z) => (z && z.back) || null);

  return (
    <>
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
              inputMode="text"
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
            {isSpread && <span className="pv-page-range">–{pageToken(current[1])}</span>} /{' '}
            <b>{CATALOG_PAGES}</b>
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
        <div className="pv-stage-wrap">
          <button
            type="button"
            className="pv-edge pv-edge-prev"
            disabled={idx <= 0}
            onClick={() => showView(idx - 1)}
            aria-label={t('pdf.prev')}
          >
            ‹
          </button>
          <div className={`pv-stage${isSpread ? ' spread' : ''}`} ref={stageRef}>
            {srcs.map((item) => {
              const { n, kind, htmlId, pageLabel, src } = item;
              // 页锚点：每个页面元素带 id="page-<令牌>"（位置数字或独立页号）
              const anchor = `page-${pageToken(n)}`;
              if (kind === 'html') {
                return (
                  <div
                    key={`html-${n}`}
                    id={anchor}
                    className="pv-html-page"
                    role="img"
                    aria-label={`产品画册 ${pageToken(n)}`}
                    onClick={(e) => {
                      if (view !== 'pdf') return;
                      // 点商品 → 放大该商品原图；点其他 → 放大整页
                      const prod = e.target.closest?.('img[data-full]');
                      if (prod) showProduct(prod, null);
                      else openZoom(item);
                    }}
                  >
                    <CatalogHtmlPage id={htmlId} pageNumber={n} label={pageLabel} />
                  </div>
                );
              }
              return (
                <img
                  key={src}
                  id={anchor}
                  alt={`产品画册第 ${n} 页`}
                  src={src}
                  srcSet={`${catalogMidSrc(n)} 952w, ${src} 1488w`}
                  sizes="(max-width:899px) 100vw, 50vw"
                  fetchPriority="high"
                  decoding="async"
                  // 显示层小图直接显示，秒开
                  ref={(el) => {
                    if (el && el.complete && el.naturalWidth > 0) markLoaded(src);
                  }}
                  onLoad={() => markLoaded(src)}
                  onError={() => markLoaded(src)}
                  onClick={() => openZoom(item)}
                />
              );
            })}
          </div>
          <button
            type="button"
            className="pv-edge pv-edge-next"
            disabled={idx >= views.length - 1}
            onClick={() => showView(idx + 1)}
            aria-label={t('pdf.next')}
          >
            ›
          </button>
        </div>
      </div>
      {zoom && (
        <PageZoom
          displaySrc={zoom.displaySrc}
          fullSrc={zoom.fullSrc}
          htmlId={zoom.htmlId}
          pageNumber={zoom.pageNumber}
          pageLabel={zoom.pageLabel}
          label={zoom.label}
          onClose={closeZoom}
          onShowProduct={(prod) => showProduct(prod, zoom)}
        />
      )}
    </>
  );
}
