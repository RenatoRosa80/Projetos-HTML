import { desc } from "drizzle-orm";
import Image from "next/image";

import Brands from "./_components/brands";
import CategoryDesktop from "./_components/category-desktop";
import Footer from "./_components/footer";
import Header from "./_components/header";
import ProductList from "./_components/product-list";
import CategorySelector from "./_components/category-selector";

import { db } from "./_db";
import { productTable } from "./_db/schema";

// Wrapper de imagem
const BannerImage = ({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    className="rounded-lg object-cover"
  />
);

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: { variants: true },
    orderBy: [desc(productTable.createdAt)],
    limit: 10,
  });

  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <Header />
      <div className="space-y-6 px-5">
        {/* Categorias Desktop */}
        <div className="mx-12 hidden px-8 md:block">
          <CategoryDesktop categories={categories} />
        </div>

        {/* Banner responsivo */}
        <picture>
          <source srcSet="/banner-desktop.png" media="(min-width: 768px)" />
          <Image
            src="/frame.png"
            alt="Banner"
            width={1200}
            height={600}
            className="h-auto w-full"
          />
        </picture>

        <Brands />

        {/* Categorias Mobile */}
        <div className="px-5 md:hidden">
          <CategorySelector
            categories={categories}
            onChange={(id) => {
              // aqui não dá para gerenciar estado no server,
              // mas você pode usar um ClientWrapper para passar o `id` ao ProductList
              console.log("Selecionou categoria", id);
            }}
          />
        </div>

        {/* Produtos com infinite scroll */}
        <ProductList
          products={products}
          title="Novos produtos"
        />

        {/* Banners extras Desktop */}
        <div className="hidden md:block">
          <div className="mx-6 flex p-5 px-5 gap-4">
            <div className="flex w-full flex-col gap-4">
              <BannerImage
                src="/NikeTherma.png"
                alt="Nike Therma"
                width={513}
                height={307}
              />
              <BannerImage
                src="/NikeThermaFit.png"
                alt="Nike Therma Fit"
                width={513}
                height={307}
              />
            </div>
            <BannerImage src="/Coat.png" alt="Coat" width={815} height={638} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
