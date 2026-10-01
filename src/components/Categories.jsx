import { useI18n } from '../i18n.jsx';
import { useCatalog, countOf } from '../catalog.jsx';

export default function Categories({ onPick }) {
  const { t } = useI18n();
  const { cats, catDesc } = useCatalog();

  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{t('sec.cats_k')}</div>
            <h2 className="section-title">{t('sec.cats')}</h2>
            <div className="section-rule" />
            <p className="section-desc">{t('sec.cats_d')}</p>
          </div>
        </div>
        <div className="cat-grid">
          {cats
            .filter((c) => c !== '全部')
            .map((c) => (
              <button type="button" className="cat-card" key={c} onClick={() => onPick(c)}>
                <h3>{c}</h3>
                <p>{catDesc[c] || '按名称与件号询盘，支持来图定制。'}</p>
                <div className="cnt">{countOf(c)} 个型号 →</div>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}
