import { useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { useCatalog } from '../catalog.jsx';

const LINKS = [
  ['#products', 'nav.products'],
  ['#new', 'nav.new'],
  ['#categories', 'nav.cats'],
  ['#docs', 'nav.docs'],
  ['#gallery', 'nav.gallery'],
  ['#about', 'nav.about'],
  ['#contact', 'nav.contact'],
];

export default function Nav() {
  const { t, lang, toggle } = useI18n();
  const { view, setView } = useCatalog();
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <img src="assets/logo.webp" alt="超盛纺配" />
          <div className="t">
            <b>超盛纺配</b>
            <span>CHAOSHENG·TEXTILE</span>
          </div>
        </a>
        <div className="nav-right">
          <nav className={`nav-links${open ? ' open' : ''}`}>
            {LINKS.map(([href, key]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {t(key)}
              </a>
            ))}
            <button
              type="button"
              className={`lang-btn${lang === 'en' ? ' on' : ''}`}
              title="切换语言"
              onClick={toggle}
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
          </nav>
          {/* 全局画册切换：真链接（?view=grid|pdf），可复制/新标签打开；点击时阻止默认跳转保持 SPA */}
          <div className="view-switch nav-vs">
            <a
              href="?view=grid"
              className={`vs-btn${view === 'grid' ? ' on' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setView('grid');
              }}
            >
              {t('view.grid')}
            </a>
            <a
              href="?view=pdf"
              className={`vs-btn${view === 'pdf' ? ' on' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setView('pdf');
              }}
            >
              {t('view.pdf')}
            </a>
          </div>
          <button
            type="button"
            className="nav-toggle"
            aria-label="菜单"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
