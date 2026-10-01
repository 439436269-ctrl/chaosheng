import { useI18n } from '../i18n.jsx';
import { CONTACT } from '../data/site.js';

const INFO = [
  ['TEL / FAX', `${CONTACT.tel} · ${CONTACT.fax}`],
  ['手机', CONTACT.mobile],
  ['QQ', CONTACT.qq],
  ['邮箱', CONTACT.email],
  ['地址', CONTACT.addrZh],
];

export default function Contact() {
  const { t } = useI18n();

  return (
    <section className="section" id="contact" style={{ paddingBottom: '40px' }}>
      <div className="container">
        <div className="contact-band">
          <div>
            <div className="section-kicker" style={{ color: '#FFE08A' }}>
              {t('sec.contact_k')}
            </div>
            <h3>{t('sec.contact')}</h3>
            <p className="sub">{t('contact.sub')}</p>
            <div className="contact-actions">
              <a className="btn btn-primary" href={`tel:${CONTACT.tel.replace(/-/g, '')}`}>
                {t('contact.btn1')} {CONTACT.tel}
              </a>
              <a className="btn btn-ghost" href={`tel:${CONTACT.mobile}`}>
                {t('contact.btn2')} {CONTACT.mobile}
              </a>
            </div>
          </div>
          <div className="info-list">
            {INFO.map(([k, v]) => (
              <div className="info-item" key={k}>
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
