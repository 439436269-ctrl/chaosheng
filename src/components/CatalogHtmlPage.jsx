import { CONTACT, NEW_ARRIVALS } from '../data/site.js';

// 画册 HTML 渲染页：版式复刻扫描页（A4 比例 2380×3368，内部尺寸一律用 cqw 随容器缩放）
// 注册表：id → 组件；site.js 的 EXTRA_CATALOG_PAGES 中 { kind:'html', id } 引用此处 id
// 新增/替换新品只需改 site.js 的 NEW_ARRIVALS 数组，网页「新品推荐」区块与本页同步生效
// （缩略图约定：与原图同目录的 <原名>_t.webp；缺失时自动回退原图）

const thumb = (img) => img.replace(/\.jpe?g$/i, '_t.webp');

/** 新产品推荐页（插在紫色汇总页之后、封底之前） */
function NewArrivalsPage({ pageNumber }) {
  // 扫描画册印刷页码 = 文件页码 - 2；印刷奇数页页码在右、偶数在左（与扫描页一致）
  const printed = pageNumber - 2;
  const side = printed % 2 === 1 ? 'right' : 'left';

  const cells = NEW_ARRIVALS.map((s) => (
    <div className="chp-cell" key={s.code}>
      <div className="chp-cell-img">
        <img
          src={thumb(s.img)}
          alt={s.name}
          loading="lazy"
          onError={(e) => {
            if (!e.currentTarget.dataset.fb) {
              e.currentTarget.dataset.fb = '1';
              e.currentTarget.src = s.img;
            }
          }}
        />
      </div>
      <div className="chp-cell-txt">
        <span className="chp-code">{s.code}</span>
        <span className="chp-row">名称: {s.name}</span>
        <span className="chp-row">件号: {s.part}</span>
      </div>
    </div>
  ));

  return (
    <div className="chp">
      <div className="chp-top" />
      <div className="chp-head" />
      <div className="chp-logo">
        <img src="assets/logo.webp" alt="超盛纺配" />
      </div>
      <div className="chp-tel">
        TEL: {CONTACT.tel}
        <br />
        M.T: {CONTACT.mobile}
        <br />
        https://csfzpj.1688.com
      </div>
      <div className="chp-fax">
        FAX: {CONTACT.fax}
        <br />
        QQ: {CONTACT.qq}
      </div>
      <div className="chp-qr">
        <img src="assets/qrcode_site.png" alt="二维码" />
      </div>

      <div className="chp-title">
        <span className="chp-title-zh">2026.09 新产品推荐</span>
        <span className="chp-title-en">NEW ARRIVALS</span>
      </div>

      <div className="chp-grid">
        {cells}
        <div className="chp-cell chp-cell-info">
          <img src="assets/qrcode_site.png" alt="二维码" />
          <span className="chp-info-t1">
            更多新品
            <br />
            扫码查看
          </span>
          <span className="chp-info-t2">csfzpj.1688.com</span>
        </div>
      </div>

      <div className={`chp-no chp-no-${side}`}>{printed}</div>

      <footer className="chp-foot">
        <span>ADD: {CONTACT.addrZh}</span>
      </footer>
    </div>
  );
}

const HTML_PAGES = {
  'new-arrivals': NewArrivalsPage,
};

/**
 * 画册 HTML 页入口。
 * id：site.js EXTRA_CATALOG_PAGES 中登记的组件 id
 * pageNumber：该页在画册中的位置页码（1 起）
 */
export default function CatalogHtmlPage({ id, pageNumber }) {
  const Page = HTML_PAGES[id];
  if (!Page) return null;
  return <Page pageNumber={pageNumber} />;
}
