export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "All Products",
    route: "/products",
  },
  {
    label: "About Us",
    route: "/about",
  },
  {
    label: "Contact Us",
    route: "/contact",
  },
];

export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: {
    adult: "",
    kids: "",
    infant: "",
  },
  isFree: false,
  url: "",
};
