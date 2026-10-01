import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import './styles/base.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/shell.css';
import './styles/catalog.css';
import './styles/about.css';
import './styles/contact.css';
import './styles/footer.css';
import './styles/drawer.css';
import './styles/gallery.css';
import './styles/new.css';
import './styles/docs.css';
import './styles/pdf.css';
import './styles/responsive.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
