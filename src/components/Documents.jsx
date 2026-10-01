import { useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { useCatalog } from '../catalog.jsx';

export default function Documents() {
  const { t } = useI18n();
  const { docs } = useCatalog();
  const [preview, setPreview] = useState(null); // {title, href}
  const frameRef = useRef(null);

  const openPreview = (d) => {
    setPreview({ title: d.title, href: d.href });
    requestAnimationFrame(() => {
      document.getElementById('docsPreview')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const closePreview = () => setPreview(null);

  return (
    <section className="section" id="docs">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{t('sec.docs_k')}</div>
            <h2 className="section-title">{t('sec.docs')}</h2>
            <div className="section-rule" />
            <p className="section-desc">{t('sec.docs_d')}</p>
          </div>
        </div>
        <div className="docs-grid">
          {docs.map((d) => (
            <article className="doc-card" key={d.id}>
              <div className="dtype">{d.type}</div>
              <h3>{d.title}</h3>
              <div className="meta">{d.meta}</div>
              <div className="acts">
                <button type="button" className="btn-mini" onClick={() => openPreview(d)}>
                  {t('btn.preview')}
                </button>
                <a className="btn-mini ghost" href={d.href} target="_blank" rel="noopener">
                  {t('btn.download')}
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="docs-preview" id="docsPreview" hidden={!preview}>
          <div className="docs-preview-bar">
            <span>{preview?.title || t('btn.preview')}</span>
            <div>
              <a
                className="btn-mini"
                href={preview?.href || '#'}
                target="_blank"
                rel="noopener"
              >
                {t('btn.download')} PDF
              </a>
              <button type="button" className="btn-mini ghost" onClick={closePreview}>
                {t('btn.close')}
              </button>
            </div>
          </div>
          <iframe
            ref={frameRef}
            title="PDF 预览"
            src={preview?.href || ''}
            style={preview ? undefined : { display: 'none' }}
          />
        </div>
      </div>
    </section>
  );
}
