const PRODUCT_CATEGORIES = {
  men: [
    "sports-shoes",
    "formal-shoes",
    "sneakers",
    "sandals",
    "home-slippers",
  ],

  women: [
    "sports-shoes",
    "formal-shoes",
    "heels",
    "sneakers",
    "sandals",
    "home-slippers",
  ],

  kids: [
    "sports-shoes",
    "school-shoes",
    "sneakers",
    "sandals",
    "home-slippers",
  ],

  accessories: [
    "general",
  ],
};

const isValidProductCategory = (
  section,
  subcategory
) => {
  const normalizedSection =
    section?.toLowerCase();

  const normalizedSubcategory =
    subcategory?.toLowerCase();

  return (
    PRODUCT_CATEGORIES[
      normalizedSection
    ]?.includes(normalizedSubcategory) || false
  );
};

module.exports = {
  PRODUCT_CATEGORIES,
  isValidProductCategory,
};