import { ShopHeader } from "../components/shop/ShopHeader";
import { Hero3D } from "../components/shop/Hero3D";
import {
  CategoryTiles,
  ShopSection,
  ValuesStrip,
} from "../components/shop/ShopSection";
import { JohanaSection } from "../components/shop/JohanaSection";
import { ProductSheet } from "../components/shop/ProductSheet";
import { CartDrawer } from "../components/shop/CartDrawer";
import { ShopFooter } from "../components/shop/ShopFooter";
import { SkillsSection } from "../components/SkillsSection";
import { PartnersSection } from "../components/PartnersSection";
import { ContactSection } from "../components/ContactSection";

export const Home = () => {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <ShopHeader />

      <main>
        <Hero3D />
        <ValuesStrip />
        <CategoryTiles />
        <ShopSection />
        <JohanaSection />
        <SkillsSection />
        <PartnersSection />
        <ContactSection />
      </main>

      <ShopFooter />

      <ProductSheet />
      <CartDrawer />
    </div>
  );
};
