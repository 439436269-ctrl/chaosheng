import { useI18n } from '../i18n.jsx';
import { useCatalog } from '../catalog.jsx';

export default function Gallery() {
  const { t } = useI18n();
  const { gallery, openPhoto } = useCatalog();

  if (!gallery.length) return null;

  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{t('sec.gallery_k')}</div>
            <h2 className="section-title">{t('sec.gallery')}</h2>
            <div className="section-rule" />
            <p className="section-desc">{t('sec.gallery_d')}</p>
          </div>
        </div>
        <div className="gallery-grid">
          {gallery.map((src) => (
            <button type="button" className="gitem" key={src} onClick={() => openPhoto(src)}>
              <img src={src} alt="实拍图" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
