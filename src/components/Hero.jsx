import { useI18n } from '../i18n.jsx';
import { useCatalog } from '../catalog.jsx';

export default function Hero() {
  const { t } = useI18n();
  const { products, cats } = useCatalog();
  const catCount = cats.length - 1; // 不含「全部」

  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">YUYAO CHAOSHENG · SINCE 2000</div>
          <h1>
            {t('hero.title1')} <em>PICANOL</em>
            <br />
            {t('hero.title2')}
          </h1>
          <p className="lead">{t('hero.lead')}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#products">
              {t('hero.btn1')}
            </a>
            <a className="btn btn-ghost" href="#contact">
              {t('hero.btn2')}
            </a>
          </div>
        </div>
        <div className="stats">
          <div className="stat">
            <b>2000+</b>
            <span>{t('stat.s1')}</span>
          </div>
          <div className="stat">
            <b>{products.length}</b>
            <span>{t('stat.s2')}</span>
          </div>
          <div className="stat">
            <b>{catCount}</b>
            <span>{t('stat.s3')}</span>
          </div>
          <div className="stat">
            <b>全国</b>
            <span>{t('stat.s4')}</span>
          </div>
          <div className="stat stat-qr">
            <div className="qr-row">
              <img src="assets/qrcode_site.png" alt="QR" loading="lazy" />
              {/* eslint-disable-next-line react/no-danger -- i18n 文案含 <br> 换行 */}
              <span dangerouslySetInnerHTML={{ __html: t('stat.qr') }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
