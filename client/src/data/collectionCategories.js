export const collectionCategories = {
  men: [
    {
      label: "Sports Shoes",
      value: "sports-shoes",
    },
    {
      label: "Formal Shoes",
      value: "formal-shoes",
    },
    {
      label: "Sandals",
      value: "sandals",
    },
    {
      label: "Home Slippers",
      value: "home-slippers",
    },
    {
      label: "Outside Slippers",
      value: "outside-slippers",
    },
    {
      label: "Sneakers",
      value: "sneakers",
    },
  ],

  women: [
    {
      label: "Sports Shoes",
      value: "sports-shoes",
    },
    {
      label: "Formal Shoes",
      value: "formal-shoes",
    },
    {
      label: "Sandals",
      value: "sandals",
    },
    {
      label: "Home Slippers",
      value: "home-slippers",
    },
    {
      label: "Fancy Slippers",
      value: "fancy-slippers",
      children: [
        {
          label: "Heels",
          value: "heels",
        },
        {
          label: "Flats",
          value: "flats",
        },
      ],
    },
    {
      label: "Outside Slippers",
      value: "outside-slippers",
    },
    {
      label: "Sneakers",
      value: "sneakers",
    },
  ],

  kids: [
    {
      label: "Sports Shoes",
      value: "sports-shoes",
    },
    {
      label: "School Shoes",
      value: "school-shoes",
    },
    {
      label: "Sandals",
      value: "sandals",
    },
    {
      label: "Slippers",
      value: "slippers",
    },
  ],
};


// Get a main category using its value
export const getCategoryByValue = (
  section,
  value
) => {
  const categories =
    collectionCategories[section] || [];

  return categories.find(
    (category) => category.value === value
  );
};


// Get parent category from a child category
// Example:
// "heels" -> Fancy Slippers
// "flats" -> Fancy Slippers
export const getParentCategoryByChildValue = (
  section,
  childValue
) => {
  const categories =
    collectionCategories[section] || [];

  return categories.find((category) =>
    category.children?.some(
      (child) => child.value === childValue
    )
  );
};


// Check whether a value is a child category
export const isChildCategory = (
  section,
  value
) => {
  const parent =
    getParentCategoryByChildValue(
      section,
      value
    );

  return Boolean(parent);
};