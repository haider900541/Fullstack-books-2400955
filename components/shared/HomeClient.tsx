"use client";

import { motion } from "framer-motion";
import BannerCarousel from "@/components/shared/BannerCarousel";
import ProductSlider from "@/components/shared/ProductSlider";
import { IBanner } from "@/lib/database/models/banner.model";
import { IProduct } from "@/lib/database/models/product.model";

interface HomeClientProps {
  banners: IBanner[];
  productsBySubcategory: { subcategory: string; products: IProduct[] }[];
}

export default function HomeClient({
  banners,
  productsBySubcategory,
}: HomeClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-12"
    >
      {/* ===== Banners ===== */}
      <section id="banners" className="relative overflow-hidden">
        {banners?.length > 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <BannerCarousel banners={banners} />
          </motion.div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No banners found.
          </div>
        )}
      </section>

      {/* ===== Product Rows by Subcategory ===== */}
      <section id="products" className="space-y-16">
        {productsBySubcategory.map(
          ({ subcategory, products }, index) =>
            products.length > 0 && (
              <motion.div
                key={subcategory}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="my-10 w-full"
              >
                <div className="flex justify-between items-center px-4 mb-6">
                  <a
                    href={`/products?subCategory=${encodeURIComponent(
                      subcategory
                    )}`}
                    className="group relative inline-block text-2xl font-bold tracking-tight text-gray-800 dark:text-white"
                  >
                    {subcategory}
                    <motion.span
                      layoutId={`underline-${subcategory}`}
                      className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 group-hover:w-full"
                    />
                  </a>

                  <a
                    href={`/products?subCategory=${encodeURIComponent(
                      subcategory
                    )}`}
                    className="text-sm font-medium text-blue-500 hover:text-purple-500 transition-colors duration-300"
                  >
                    View All →
                  </a>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className="px-4"
                >
                  <ProductSlider products={products} />
                </motion.div>
              </motion.div>
            )
        )}
      </section>
    </motion.div>
  );
}
