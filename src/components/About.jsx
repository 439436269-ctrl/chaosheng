import { useI18n } from '../i18n.jsx';

const FACTS = [
  ['厂名', '余姚市超盛纺织配件厂'],
  ['方向', 'PICANOL 喷气织机配件国产化'],
  ['起步', '2000 年'],
  ['方针', '质量第一 · 信誉第一 · 用户至上 · 勇于创新'],
  ['地址', '浙江省余姚市梨洲街道黄箭山新吕家 16A'],
];

export default function About() {
  const { t } = useI18n();

  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div className="panel">
          <div className="section-kicker">{t('sec.about_k')}</div>
          <h3>{t('sec.about')}</h3>
          <p>
            浙江省余姚市超盛纺织配件厂紧靠杭甬高速公路余姚道口，距余姚市区约 6 公里，
            离宁波机场约 40 公里，交通便捷。
          </p>
          <p>
            本厂自 2000 年起专业开发生产必佳诺 PICANOL 喷气织机配件国产化产品，
            精心研制 PAT-A、DELTA、OMNI、OMNIPLUS、PLUS800、GAMMA、OPTMAX 等系列机型配件，
            产品替代进口并远销国内外，深受用户好评。
          </p>
          <div className="motto">以质量求生存 · 以信誉求发展</div>
        </div>
        <div className="panel">
          <div className="section-kicker">{t('sec.profile_k')}</div>
          <h3>{t('sec.profile')}</h3>
          <div className="fact-list">
            {FACTS.map(([k, v]) => (
              <div className="fact" key={k}>
                <b>{k}</b>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
