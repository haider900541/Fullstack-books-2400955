import HomeClient from "@/components/shared/HomeClient";
import { getAllBanners } from "@/lib/actions/banner.actions";
import { getFilteredProducts } from "@/lib/actions/product.actions";
import { IBanner } from "@/lib/database/models/banner.model";
import { IProduct } from "@/lib/database/models/product.model";

const subcategories = [
  "Fresh Reads",
  "Spotlight Picks",
  "Top Sellers",
  "Hot Reads",
  "Collector’s Editions",
  "Special Releases",
  "Critically Acclaimed",
  "Bargain Books",
  "Quick Picks",
  "Clearance Corner",
  "Back by Popular Demand",
  "Steal of the Week",
  "Editor's Choice",
  "Weekly Spotlight",
  "Seasonal Favorites",
  "Staff Recommendations",
  "Perfect Gift Books",
  "Readers’ Choice",
];

export default async function Home() {
  const banners = await getAllBanners();

  const productsBySubcategory = await Promise.all(
    subcategories.map(async (subcategory) => {
      const { products } = await getFilteredProducts({
        subCategory: subcategory,
        limit: 10,
        page: 1,
      });

      return { subcategory, products: products as IProduct[] };
    })
  );

  return (
    <HomeClient
      banners={banners as IBanner[]}
      productsBySubcategory={productsBySubcategory}
    />
  );
}
