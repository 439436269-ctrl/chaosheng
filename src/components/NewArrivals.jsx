import { useI18n } from '../i18n.jsx';
import { useCatalog } from '../catalog.jsx';

export default function NewArrivals() {
  const { t } = useI18n();
  const { news, view } = useCatalog();

  return (
    <section className="section" id="new">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{t('sec.new_k')}</div>
            <h2 className="section-title">{t('sec.new')}</h2>
            <div className="section-rule" />
            <p className="section-desc">{t('sec.new_d')}</p>
          </div>
        </div>
        <div className="new-grid">
          {news.map((s, i) => (
            <article className="new-card" key={s.code}>
              <div className="imgwrap">
                {/* PDF 画册模式下挂起新品图，切回网页目录再加载，避免与画册抢带宽 */}
                {view === 'grid' && (
                  <img
                    src={s.img}
                    alt={s.name}
                    loading={i < 4 ? undefined : 'lazy'}
                    decoding="async"
                  />
                )}
              </div>
              <div className="body">
                <span className="badge">NEW</span>
                <div className="code">{s.code}</div>
                <div className="nm">{s.name}</div>
                <div className="meta">件号 {s.part}</div>
              </div>
            </article>
          ))}
          <article className="new-card empty">
            {/* eslint-disable-next-line react/no-danger -- i18n 文案含 <br> 换行 */}
            <div className="ph" dangerouslySetInnerHTML={{ __html: t('empty.ph') }} />
          </article>
        </div>
      </div>
    </section>
  );
}
