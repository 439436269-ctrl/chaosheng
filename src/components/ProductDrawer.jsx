import { useEffect } from 'react';
import { useI18n } from '../i18n.jsx';
import { useCatalog } from '../catalog.jsx';

/**
 * 右侧详情抽屉：既展示产品详情，也复用于实拍图查看（kind:'photo'）。
 */
export default function ProductDrawer() {
  const { t } = useI18n();
  const { detail, closeDetail, catDesc } = useCatalog();

  // Esc 关闭 + 打开时锁定 body 滚动
  useEffect(() => {
    if (!detail) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetail();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [detail, closeDetail]);

  const open = !!detail;
  const isPhoto = detail?.kind === 'photo';
  const p = detail?.kind === 'product' ? detail.product : null;

  return (
    <>
      <div className={`drawer-mask${open ? ' open' : ''}`} onClick={closeDetail} />
      <aside className={`drawer${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="drawer-hd">
          <button type="button" className="drawer-close" aria-label="关闭" onClick={closeDetail}>
            ✕
          </button>
          <div className="tag">{isPhoto ? '实拍' : p?.cat || '配件'}</div>
          <div className="code">{isPhoto ? 'PHOTO' : p?.code}</div>
          <h2>{isPhoto ? '产品实拍' : p?.name}</h2>
        </div>
        <div className="drawer-body">
          <img
            className="photo"
            src={isPhoto ? detail.src : p ? p.img || `assets/products/${p.code}.jpg` : undefined}
            alt={isPhoto ? '产品实拍' : p?.name || ''}
          />
          <div className="fields">
            <div className="row">
              <div className="k">{t('meta.name')}</div>
              <div className="v">{isPhoto ? '产品实拍' : p?.name || '—'}</div>
            </div>
            <div className="row">
              <div className="k">{t('meta.mach')}</div>
              <div className="v">{isPhoto ? '—' : p?.machine || '通用'}</div>
            </div>
            <div className="row">
              <div className="k">{t('meta.part')}</div>
              <div className="v">{isPhoto ? '—' : p?.part || '—'}</div>
            </div>
            <div className="row">
              <div className="k">{t('meta.cat')}</div>
              <div className="v">{isPhoto ? '实拍相册' : p?.cat || '—'}</div>
            </div>
          </div>
          <div className="note">
            {isPhoto
              ? '来自实拍相册，可按参考图询盘。'
              : (p && (catDesc[p.cat] || '适用于必佳诺喷气织机的国产化替代配件。')) || ''}
          </div>
          <div className="tags">
            {(isPhoto
              ? ['实拍', '询盘参考']
              : p
                ? [p.cat, p.machine || '通用', '国产替代', '可定制']
                : []
            ).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="drawer-foot">
            <b>以质量求生存 · 以信誉求发展</b>
            <br />
            TEL 0574-62561851 · M.T 13605846068
          </div>
        </div>
      </aside>
    </>
  );
}
