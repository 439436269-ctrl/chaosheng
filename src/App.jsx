import { LangProvider } from './i18n.jsx';
import { CatalogProvider } from './catalog.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import NewArrivals from './components/NewArrivals.jsx';
import Categories from './components/Categories.jsx';
import ProductsSection from './components/ProductsSection.jsx';
import Documents from './components/Documents.jsx';
import Gallery from './components/Gallery.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ProductDrawer from './components/ProductDrawer.jsx';
import { useCatalog } from './catalog.jsx';

function Site() {
  const { pickCat } = useCatalog();
  return (
    <>
      {/* AI 生成标注位于 index.html body 顶部（静态，首屏即显），此处勿重复添加 */}
      <Nav />
      <Hero />
      <NewArrivals />
      <Categories onPick={pickCat} />
      <ProductsSection />
      <Documents />
      <Gallery />
      <About />
      <Contact />
      <Footer />
      <ProductDrawer />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <CatalogProvider>
        <Site />
      </CatalogProvider>
    </LangProvider>
  );
}
