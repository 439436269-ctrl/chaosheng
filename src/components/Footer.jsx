import { useI18n } from '../i18n.jsx';
import { CONTACT } from '../data/site.js';

export default function Footer() {
  const { t, lang } = useI18n();
  const addr = lang === 'en' ? CONTACT.addrEn : CONTACT.addrZh;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <b>{t('footer.add')}</b>
          {addr}
        </div>
        <div>余姚市超盛纺织配件厂 · PICANOL AIR-JET LOOM PARTS</div>
      </div>
    </footer>
  );
}
