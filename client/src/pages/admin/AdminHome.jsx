import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

import API_BASE from "../../config/api.js";

const defaultHero = {
  badge: "FOOTWEAR FOR EVERY STEP",
  title: "STEP INTO",
  highlight: "STYLE.",
  description:
    "From everyday comfort to statement-making style, discover footwear designed for every journey, every occasion and every step.",
  primaryButton: {
    text: "SHOP MEN",
    link: "/products/men",
  },
  secondaryButton: {
    text: "SHOP WOMEN",
    link: "/products/women",
  },
  trustTitle: "50+ Years of Trust",
  trustDescription:
    "Serving generations with quality, comfort and customer belief.",
  stats: [
    {
      value: "50+",
      label: "Years of Trust",
    },
    {
      value: "10K+",
      label: "Happy Customers",
    },
    {
      value: "Premium",
      label: "Quality Footwear",
    },
  ],
  heroImage: {
    url: "",
    publicId: "",
  },
  isActive: true,
};

const emptyCollection = {
  sectionKey: "",
  title: "",
  subtitle: "",
  image: {
    url: "",
    publicId: "",
  },
  buttonText: "Explore Collection",
  buttonLink: "",
  products: [],
  order: 0,
  isActive: true,
};

const defaultManagedSections = {
  "shop-by-category": {
    sectionKey: "shop-by-category",
    title: "Shop By Category",
    subtitle: "Explore footwear for every member of the family.",
    buttonText: "Shop Now",
    buttonLink: "/products/men",
    order: 10,
    isActive: true,
    items: [
      { key: "men", title: "Men", subtitle: "Everyday style", buttonText: "Shop Men", buttonLink: "/products/men", order: 1, isActive: true, image: { url: "", publicId: "" } },
      { key: "women", title: "Women", subtitle: "Style that moves", buttonText: "Shop Women", buttonLink: "/products/women", order: 2, isActive: true, image: { url: "", publicId: "" } },
      { key: "kids", title: "Kids", subtitle: "Fun & comfort", buttonText: "Shop Kids", buttonLink: "/products/kids", order: 3, isActive: true, image: { url: "", publicId: "" } },
      { key: "accessories", title: "Accessories", subtitle: "Complete the look", buttonText: "Shop Accessories", buttonLink: "/products/accessories", order: 4, isActive: true, image: { url: "", publicId: "" } },
    ],
  },
  "every-moment": {
    sectionKey: "every-moment",
    title: "Step Into What Matters",
    subtitle: "Whether it's college, work, travel or play — we have the right pair to match your journey.",
    buttonText: "Explore More",
    buttonLink: "/products/men",
    order: 20,
    isActive: true,
    items: [
      { key: "college", title: "College", subtitle: "Stay Stylish", buttonText: "Explore", buttonLink: "/products/men/sneakers", order: 1, isActive: true, image: { url: "", publicId: "" } },
      { key: "work", title: "Work", subtitle: "Look Professional", buttonText: "Explore", buttonLink: "/products/men/formal-shoes", order: 2, isActive: true, image: { url: "", publicId: "" } },
      { key: "travel", title: "Travel", subtitle: "Go Further", buttonText: "Explore", buttonLink: "/products/men/sports-shoes", order: 3, isActive: true, image: { url: "", publicId: "" } },
      { key: "play", title: "Play", subtitle: "Keep Moving", buttonText: "Explore", buttonLink: "/products/men/sports-shoes", order: 4, isActive: true, image: { url: "", publicId: "" } },
    ],
  },
};

function AdminHome() {
  const { token } = useContext(AuthContext);

  const [hero, setHero] = useState(defaultHero);
  const [collections, setCollections] = useState([]);
  const [managedSections, setManagedSections] = useState({});
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const [savingId, setSavingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editingHero, setEditingHero] = useState(false);
  const [editingManagedKey, setEditingManagedKey] = useState(null);
  const [managedForm, setManagedForm] = useState(null);
  const [savingManagedKey, setSavingManagedKey] = useState(null);
  const [uploadingManagedKey, setUploadingManagedKey] = useState(null);

  const [form, setForm] = useState(emptyCollection);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [heroResponse, sectionsResponse, productsResponse] =
        await Promise.all([
          fetch(`${API_BASE}/api/hero-section/admin`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_BASE}/api/home-sections/admin/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_BASE}/api/products/admin/all?limit=100`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const heroData = await heroResponse.json();
      const sectionsData = await sectionsResponse.json();
      const productsData = await productsResponse.json();

      if (heroData.success && heroData.hero) {
        setHero({
          ...defaultHero,
          ...heroData.hero,
          primaryButton: {
            ...defaultHero.primaryButton,
            ...(heroData.hero.primaryButton || {}),
          },
          secondaryButton: {
            ...defaultHero.secondaryButton,
            ...(heroData.hero.secondaryButton || {}),
          },
          heroImage: {
            ...defaultHero.heroImage,
            ...(heroData.hero.heroImage || {}),
          },
          stats:
            heroData.hero.stats?.length > 0
              ? heroData.hero.stats
              : defaultHero.stats,
        });
      }

      if (sectionsData.success) {
        const allSections = sectionsData.sections || [];
        const managed = {};

        Object.keys(defaultManagedSections).forEach((key) => {
          const existing = allSections.find(
            (section) => section.sectionKey === key
          );

          managed[key] = existing
            ? normalizeManagedSection(existing, key)
            : null;
        });

        setManagedSections(managed);
        setCollections(
          allSections.filter(
            (section) =>
              !Object.prototype.hasOwnProperty.call(
                defaultManagedSections,
                section.sectionKey
              )
          )
        );
      }

      if (productsData.success) {
        setProducts(productsData.products || []);
      }
    } catch (error) {
      console.error("Error loading homepage data:", error);

      setMessage({
        type: "error",
        text: "Unable to load homepage data.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     HERO
  ========================================================= */

  const cancelHeroEditing = () => {
    setEditingHero(false);
    setMessage({
      type: "",
      text: "",
    });
  };

  const handleHeroChange = (event) => {
    const { name, value } = event.target;

    setHero((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleHeroButtonChange = (button, field, value) => {
    setHero((previous) => ({
      ...previous,
      [button]: {
        ...previous[button],
        [field]: value,
      },
    }));
  };

  const handleHeroStatChange = (index, field, value) => {
    setHero((previous) => ({
      ...previous,
      stats: previous.stats.map((stat, statIndex) =>
        statIndex === index
          ? {
              ...stat,
              [field]: value,
            }
          : stat
      ),
    }));
  };

  const uploadHeroImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingHero(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      const uploadForm = new FormData();

      uploadForm.append("file", file);
      uploadForm.append("folder", "popular-footwear/home/hero");

      const response = await fetch(`${API_BASE}/api/admin/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Hero image upload failed.");
      }

      setHero((previous) => ({
        ...previous,
        heroImage: {
          url: data.media.url,
          publicId: data.media.publicId,
        },
      }));

      setMessage({
        type: "success",
        text: "Hero image uploaded. Click Save Hero to apply it.",
      });
    } catch (error) {
      console.error("Hero image upload error:", error);

      setMessage({
        type: "error",
        text: error.message || "Hero image upload failed.",
      });
    } finally {
      setUploadingHero(false);
      event.target.value = "";
    }
  };

  const saveHero = async (event) => {
    event.preventDefault();

    setSavingHero(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      const response = await fetch(`${API_BASE}/api/hero-section/admin`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          badge: hero.badge.trim(),
          title: hero.title.trim(),
          highlight: hero.highlight.trim(),
          description: hero.description.trim(),

          primaryButton: {
            text: hero.primaryButton.text.trim(),
            link: hero.primaryButton.link.trim(),
          },

          secondaryButton: {
            text: hero.secondaryButton.text.trim(),
            link: hero.secondaryButton.link.trim(),
          },

          trustTitle: hero.trustTitle.trim(),
          trustDescription: hero.trustDescription.trim(),

          stats: hero.stats.map((stat) => ({
            value: stat.value.trim(),
            label: stat.label.trim(),
          })),

          heroImage: hero.heroImage,

          isActive: hero.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save Hero section.");
      }

      setHero(data.hero);
      setEditingHero(false);

      setMessage({
        type: "success",
        text: "Hero section saved successfully.",
      });
    } catch (error) {
      console.error("Hero save error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to save Hero section.",
      });
    } finally {
      setSavingHero(false);
    }
  };

  /* =========================================================
     MANAGED HOMEPAGE SECTIONS
  ========================================================= */

  const normalizeManagedSection = (section, sectionKey) => {
    const defaults = defaultManagedSections[sectionKey];

    return {
      ...defaults,
      ...section,
      image: {
        url: section?.image?.url || defaults.image?.url || "",
        publicId:
          section?.image?.publicId || defaults.image?.publicId || "",
      },
      items:
        Array.isArray(section?.items) && section.items.length > 0
          ? section.items
              .map((item, index) => {
                const fallback =
                  defaults.items.find((entry) => entry.key === item.key) ||
                  defaults.items[index] ||
                  {};

                return {
                  ...fallback,
                  ...item,
                  image: {
                    url: item?.image?.url || fallback.image?.url || "",
                    publicId:
                      item?.image?.publicId ||
                      fallback.image?.publicId ||
                      "",
                  },
                  order: item?.order ?? fallback.order ?? index + 1,
                  isActive: item?.isActive !== false,
                };
              })
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : defaults.items,
    };
  };

  const startEditingManaged = (sectionKey) => {
    const section = managedSections[sectionKey];
    const source = section || defaultManagedSections[sectionKey];

    setEditingManagedKey(sectionKey);
    setManagedForm(normalizeManagedSection(source, sectionKey));
    setMessage({ type: "", text: "" });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelManagedEditing = () => {
    setEditingManagedKey(null);
    setManagedForm(null);
    setMessage({ type: "", text: "" });
  };

  const handleManagedSectionChange = (event) => {
    const { name, value } = event.target;

    setManagedForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleManagedItemChange = (index, field, value) => {
    setManagedForm((previous) => ({
      ...previous,
      items: previous.items.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      ),
    }));
  };

  const toggleManagedItem = (index) => {
    setManagedForm((previous) => ({
      ...previous,
      items: previous.items.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, isActive: !item.isActive }
          : item
      ),
    }));
  };

  const uploadManagedItemImage = async (event, sectionKey, itemKey) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const uploadKey = `${sectionKey}:${itemKey}`;
    setUploadingManagedKey(uploadKey);
    setMessage({ type: "", text: "" });

    try {
      const uploadForm = new FormData();

      uploadForm.append("file", file);
      uploadForm.append(
        "folder",
        `popular-footwear/home/${sectionKey}/${itemKey}`
      );

      const response = await fetch(`${API_BASE}/api/admin/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Poster upload failed.");
      }

      setManagedForm((previous) => ({
        ...previous,
        items: previous.items.map((item) =>
          item.key === itemKey
            ? {
                ...item,
                image: {
                  url: data.media.url,
                  publicId: data.media.publicId,
                },
              }
            : item
        ),
      }));

      setMessage({
        type: "success",
        text: `${itemKey} poster uploaded. Click Save Section to apply it.`,
      });
    } catch (error) {
      console.error("Managed section image upload error:", error);

      setMessage({
        type: "error",
        text: error.message || "Poster upload failed.",
      });
    } finally {
      setUploadingManagedKey(null);
      event.target.value = "";
    }
  };

  const createManagedSection = async (sectionKey) => {
    const defaults = defaultManagedSections[sectionKey];

    try {
      setSavingManagedKey(sectionKey);
      setMessage({ type: "", text: "" });

      const payload = {
        sectionKey: defaults.sectionKey,
        title: defaults.title,
        subtitle: defaults.subtitle,
        image: { url: "", publicId: "" },
        buttonText: defaults.buttonText,
        buttonLink: defaults.buttonLink,
        products: [],
        items: defaults.items,
        order: defaults.order,
        isActive: defaults.isActive,
      };

      const response = await fetch(`${API_BASE}/api/home-sections`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create homepage section.");
      }

      await fetchData();
      startEditingManaged(sectionKey);

      setMessage({
        type: "success",
        text: "Section created. Add your posters and save the section.",
      });
    } catch (error) {
      console.error("Create managed section error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to create homepage section.",
      });
    } finally {
      setSavingManagedKey(null);
    }
  };

  const saveManagedSection = async (event) => {
    event.preventDefault();

    if (!editingManagedKey || !managedForm) {
      return;
    }

    if (!managedForm.title.trim()) {
      setMessage({
        type: "error",
        text: "Section title is required.",
      });
      return;
    }

    setSavingManagedKey(editingManagedKey);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        title: managedForm.title.trim(),
        subtitle: managedForm.subtitle.trim(),
        image: managedForm.image,
        buttonText: managedForm.buttonText.trim(),
        buttonLink: managedForm.buttonLink.trim(),
        items: managedForm.items.map((item, index) => ({
          key: item.key,
          title: item.title.trim(),
          subtitle: item.subtitle?.trim() || "",
          image: item.image || { url: "", publicId: "" },
          buttonText: item.buttonText?.trim() || "",
          buttonLink: item.buttonLink?.trim() || "",
          order: Number(item.order) || index + 1,
          isActive: item.isActive !== false,
        })),
        order: Number(managedForm.order) || 0,
        isActive: managedForm.isActive !== false,
      };

      const sectionId = managedSections[editingManagedKey]?._id;

      if (!sectionId) {
        throw new Error("Section not found. Please create it first.");
      }

      const response = await fetch(
        `${API_BASE}/api/home-sections/${sectionId}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save homepage section.");
      }

      await fetchData();

      setEditingManagedKey(null);
      setManagedForm(null);

      setMessage({
        type: "success",
        text: "Homepage section saved successfully.",
      });
    } catch (error) {
      console.error("Save managed section error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to save homepage section.",
      });
    } finally {
      setSavingManagedKey(null);
    }
  };

  const toggleManagedSection = async (sectionKey) => {
    const section = managedSections[sectionKey];

    if (!section) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/home-sections/${section._id}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            isActive: !section.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update visibility.");
      }

      await fetchData();

      setMessage({
        type: "success",
        text: section.isActive
          ? "Section hidden from the homepage."
          : "Section is now visible on the homepage.",
      });
    } catch (error) {
      console.error("Managed section visibility error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to update visibility.",
      });
    }
  };

  const deleteManagedSection = async (sectionKey) => {
    const section = managedSections[sectionKey];

    if (!section) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the "${section.title}" homepage section?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/home-sections/${section._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete section.");
      }

      if (editingManagedKey === sectionKey) {
        cancelManagedEditing();
      }

      await fetchData();

      setMessage({
        type: "success",
        text: "Homepage section removed successfully.",
      });
    } catch (error) {
      console.error("Delete managed section error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to delete homepage section.",
      });
    }
  };

  /* =========================================================
     COLLECTIONS
  ========================================================= */

  const startEditing = (collection) => {
    setEditingId(collection._id);

    setForm({
      sectionKey: collection.sectionKey || "",
      title: collection.title || "",
      subtitle: collection.subtitle || "",
      image: {
        url: collection.image?.url || "",
        publicId: collection.image?.publicId || "",
      },
      buttonText: collection.buttonText || "Explore Collection",
      buttonLink: collection.buttonLink || "",
      products:
        collection.products?.map((product) =>
          typeof product === "string" ? product : product._id
        ) || [],
      order: collection.order ?? 0,
      isActive: collection.isActive !== false,
    });

    setMessage({
      type: "",
      text: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm(emptyCollection);

    setMessage({
      type: "",
      text: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProductToggle = (productId) => {
    setForm((previous) => {
      const exists = previous.products.includes(productId);

      return {
        ...previous,
        products: exists
          ? previous.products.filter((id) => id !== productId)
          : [...previous.products, productId],
      };
    });
  };

  const uploadImage = async (event, collectionId) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingId(collectionId);

    setMessage({
      type: "",
      text: "",
    });

    try {
      const uploadForm = new FormData();

      uploadForm.append("file", file);
      uploadForm.append(
        "folder",
        `popular-footwear/home/collections/${collectionId}`
      );

      const response = await fetch(`${API_BASE}/api/admin/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Image upload failed.");
      }

      setForm((previous) => ({
        ...previous,
        image: {
          url: data.media.url,
          publicId: data.media.publicId,
        },
      }));

      setMessage({
        type: "success",
        text: "Image uploaded successfully. Save the collection to apply it.",
      });
    } catch (error) {
      console.error("Image upload error:", error);

      setMessage({
        type: "error",
        text: error.message || "Image upload failed.",
      });
    } finally {
      setUploadingId(null);
      event.target.value = "";
    }
  };

  const saveCollection = async (event) => {
    event.preventDefault();

    if (!editingId) {
      return;
    }

    if (!form.title.trim()) {
      setMessage({
        type: "error",
        text: "Collection title is required.",
      });

      return;
    }

    setSavingId(editingId);

    setMessage({
      type: "",
      text: "",
    });

    try {
      const response = await fetch(
        `${API_BASE}/api/home-sections/${editingId}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            title: form.title.trim(),
            subtitle: form.subtitle.trim(),
            image: form.image,
            buttonText: form.buttonText.trim(),
            buttonLink: form.buttonLink.trim(),
            products: form.products,
            order: Number(form.order) || 0,
            isActive: form.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save collection.");
      }

      setMessage({
        type: "success",
        text: "Collection saved successfully.",
      });

      await fetchData();

      setEditingId(null);
      setForm(emptyCollection);
    } catch (error) {
      console.error("Save collection error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to save collection.",
      });
    } finally {
      setSavingId(null);
    }
  };

  const createCollection = async () => {
    const sectionNumber = collections.length + 1;

    const payload = {
      ...emptyCollection,
      sectionKey: `collection-${Date.now()}`,
      title: `New Collection ${sectionNumber}`,
      subtitle:
        "Discover footwear designed for comfort, confidence and every journey.",
      buttonText: "Explore Collection",
      buttonLink: "/products/men",
      order: sectionNumber,
    };

    try {
      setMessage({
        type: "",
        text: "",
      });

      const response = await fetch(`${API_BASE}/api/home-sections`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create collection.");
      }

      await fetchData();

      startEditing(data.section);

      setMessage({
        type: "success",
        text: "Collection created. Add its image and details below.",
      });
    } catch (error) {
      console.error("Create collection error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to create collection.",
      });
    }
  };

  const deleteCollection = async (collection) => {
    const confirmed = window.confirm(
      `Delete "${collection.title}" from the homepage?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/home-sections/${collection._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete collection.");
      }

      if (editingId === collection._id) {
        cancelEditing();
      }

      await fetchData();

      setMessage({
        type: "success",
        text: "Collection removed successfully.",
      });
    } catch (error) {
      console.error("Delete collection error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to delete collection.",
      });
    }
  };

  const toggleActive = async (collection) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/home-sections/${collection._id}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            isActive: !collection.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update visibility.");
      }

      await fetchData();

      setMessage({
        type: "success",
        text: collection.isActive
          ? "Collection hidden from the homepage."
          : "Collection is now visible on the homepage.",
      });
    } catch (error) {
      console.error("Visibility update error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to update visibility.",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full min-w-0">
        <PageHeader onCreate={createCollection} />

        <div className="mt-8 flex min-h-[350px] items-center justify-center rounded-3xl border border-zinc-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-red-600" />

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Loading homepage
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <PageHeader onCreate={createCollection} />

      {/* ================= MESSAGE ================= */}
      {message.text && (
        <div
          className={`mt-6 rounded-2xl border px-5 py-4 text-sm font-semibold ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* =================================================
          HERO SECTION
      ================================================= */}
      <section className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
              Main Storefront
            </p>
            <h2 className="mt-1 font-['Outfit'] text-2xl font-extrabold tracking-tight text-zinc-950">
              Hero Section
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Control the main visual and messaging customers see first.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`rounded-full px-4 py-2 text-xs font-bold ${
                hero.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {hero.isActive ? "Hero Active" : "Hero Hidden"}
            </div>

            {!editingHero ? (
              <button
                type="button"
                onClick={() => {
                  setEditingHero(true);
                  setMessage({ type: "", text: "" });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
              >
                Edit Hero
              </button>
            ) : (
              <button
                type="button"
                onClick={cancelHeroEditing}
                className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {!editingHero ? (
          <div className="p-6 lg:p-8">
            <div className="grid gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-700">
                {hero.heroImage?.url ? (
                  <img
                    src={hero.heroImage.url}
                    alt="Hero preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-5 text-center text-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl">
                      ↑
                    </div>
                    <p className="mt-3 text-sm font-bold">No Hero Image</p>
                    <p className="mt-1 text-[11px] leading-5 text-white/50">
                      Upload an image from Edit Hero.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Current Hero Content
                  </p>
                  <h3 className="mt-2 font-['Outfit'] text-3xl font-extrabold tracking-tight text-zinc-950">
                    {hero.title}{" "}
                    <span className="text-red-600">{hero.highlight}</span>
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
                    {hero.description}
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-zinc-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                      Badge
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-zinc-900">
                      {hero.badge || "Not set"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                      Trust
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-zinc-900">
                      {hero.trustTitle || "Not set"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                      Statistics
                    </p>
                    <p className="mt-1 text-sm font-bold text-zinc-900">
                      {hero.stats?.length || 0} configured
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-600">
                    {hero.primaryButton?.text || "Primary CTA"}
                  </span>
                  <span className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-600">
                    {hero.secondaryButton?.text || "Secondary CTA"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
        <form onSubmit={saveHero} className="p-6 lg:p-8">

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

            {/* ================= IMAGE ================= */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                Hero Image
              </label>

              <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-700">

                {hero.heroImage?.url ? (
                  <img
                    src={hero.heroImage.url}
                    alt="Hero preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur">
                      ↑
                    </div>

                    <p className="mt-5 font-['Outfit'] text-xl font-bold">
                      No Hero Image
                    </p>

                    <p className="mt-2 max-w-sm text-xs leading-5 text-white/50">
                      Upload a premium footwear image to replace the current
                      CSS-based Hero visual.
                    </p>
                  </div>
                )}

                <label className="absolute bottom-4 left-4 right-4 flex cursor-pointer items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-zinc-950 shadow-xl transition hover:bg-red-600 hover:text-white">

                  {uploadingHero
                    ? "Uploading..."
                    : hero.heroImage?.url
                    ? "Replace Hero Image"
                    : "Upload Hero Image"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                    className="hidden"
                    onChange={uploadHeroImage}
                    disabled={uploadingHero}
                  />
                </label>
              </div>

              <p className="mt-3 text-xs leading-5 text-zinc-400">
                Recommended: a high-quality footwear image with enough
                negative space for the Hero composition.
              </p>
            </div>

            {/* ================= TEXT ================= */}
            <div className="space-y-5">

              {/* BADGE */}
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Badge
                </label>

                <input
                  type="text"
                  name="badge"
                  value={hero.badge}
                  onChange={handleHeroChange}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              {/* TITLE */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Main Heading
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={hero.title}
                    onChange={handleHeroChange}
                    className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Highlight Heading
                  </label>

                  <input
                    type="text"
                    name="highlight"
                    value={hero.highlight}
                    onChange={handleHeroChange}
                    className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Description
                </label>

                <textarea
                  name="description"
                  value={hero.description}
                  onChange={handleHeroChange}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              {/* BUTTONS */}
              <div className="rounded-2xl bg-zinc-50 p-5">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Call To Action
                </p>

                <div className="mt-4 grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                      Primary Button
                    </label>

                    <input
                      type="text"
                      value={hero.primaryButton.text}
                      onChange={(event) =>
                        handleHeroButtonChange(
                          "primaryButton",
                          "text",
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />

                    <input
                      type="text"
                      value={hero.primaryButton.link}
                      onChange={(event) =>
                        handleHeroButtonChange(
                          "primaryButton",
                          "link",
                          event.target.value
                        )
                      }
                      placeholder="/products/men"
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                      Secondary Button
                    </label>

                    <input
                      type="text"
                      value={hero.secondaryButton.text}
                      onChange={(event) =>
                        handleHeroButtonChange(
                          "secondaryButton",
                          "text",
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />

                    <input
                      type="text"
                      value={hero.secondaryButton.link}
                      onChange={(event) =>
                        handleHeroButtonChange(
                          "secondaryButton",
                          "link",
                          event.target.value
                        )
                      }
                      placeholder="/products/women"
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* ACTIVE */}
              <button
                type="button"
                onClick={() =>
                  setHero((previous) => ({
                    ...previous,
                    isActive: !previous.isActive,
                  }))
                }
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold transition ${
                  hero.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-zinc-200 bg-zinc-50 text-zinc-500"
                }`}
              >
                <span>
                  {hero.isActive
                    ? "Hero is visible on storefront"
                    : "Hero is hidden from storefront"}
                </span>

                <span
                  className={`h-5 w-9 rounded-full p-1 transition ${
                    hero.isActive ? "bg-emerald-500" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`block h-3 w-3 rounded-full bg-white transition ${
                      hero.isActive ? "translate-x-4" : ""
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* ================= TRUST ================= */}
          <div className="mt-10 border-t border-zinc-100 pt-8">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                Trust Message
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Customize the 50+ years message displayed below the Hero CTA.
              </p>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                  Trust Title
                </label>

                <input
                  type="text"
                  name="trustTitle"
                  value={hero.trustTitle}
                  onChange={handleHeroChange}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                  Trust Description
                </label>

                <input
                  type="text"
                  name="trustDescription"
                  value={hero.trustDescription}
                  onChange={handleHeroChange}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
              </div>
            </div>
          </div>

          {/* ================= STATS ================= */}
          <div className="mt-10 border-t border-zinc-100 pt-8">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                Hero Statistics
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                These appear underneath the trust message.
              </p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">

              {hero.stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Statistic {index + 1}
                  </p>

                  <input
                    type="text"
                    value={stat.value}
                    onChange={(event) =>
                      handleHeroStatChange(
                        index,
                        "value",
                        event.target.value
                      )
                    }
                    placeholder="50+"
                    className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />

                  <input
                    type="text"
                    value={stat.label}
                    onChange={(event) =>
                      handleHeroStatChange(
                        index,
                        "label",
                        event.target.value
                      )
                    }
                    placeholder="Years of Trust"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SAVE HERO */}
          <div className="mt-8 flex justify-end border-t border-zinc-100 pt-6">
            <button
              type="submit"
              disabled={savingHero || uploadingHero}
              className="rounded-xl bg-red-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingHero ? "Saving Hero..." : "Save Hero"}
            </button>
          </div>
        </form>
        </div>
        )}
      </section>

      {/* =================================================
          MANAGED SECTION EDITOR
      ================================================= */}
      {editingManagedKey && managedForm && (
        <ManagedSectionEditor
          section={managedForm}
          sectionKey={editingManagedKey}
          saving={savingManagedKey === editingManagedKey}
          uploadingKey={uploadingManagedKey}
          onChange={handleManagedSectionChange}
          onItemChange={handleManagedItemChange}
          onToggleItem={toggleManagedItem}
          onUpload={uploadManagedItemImage}
          onCancel={cancelManagedEditing}
          onSave={saveManagedSection}
        />
      )}

      {/* =================================================
          COLLECTION EDITOR
      ================================================= */}
      {editingId && (
        <section className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
                Collection Editor
              </p>

              <h2 className="mt-1 font-['Outfit'] text-2xl font-extrabold tracking-tight text-zinc-950">
                Edit Homepage Collection
              </h2>
            </div>

            <button
              type="button"
              onClick={cancelEditing}
              className="w-fit rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={saveCollection} className="p-6 lg:p-8">

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

              {/* IMAGE */}
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Collection Image
                </label>

                <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100">

                  {form.image?.url ? (
                    <img
                      src={form.image.url}
                      alt={form.title || "Collection preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                        ↑
                      </div>

                      <p className="mt-4 text-sm font-bold text-zinc-800">
                        No image selected
                      </p>

                      <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500">
                        Upload a high-quality footwear image for this
                        collection.
                      </p>
                    </div>
                  )}

                  <label className="absolute bottom-4 left-4 right-4 flex cursor-pointer items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-red-600">

                    {uploadingId === editingId
                      ? "Uploading..."
                      : form.image?.url
                      ? "Replace Image"
                      : "Upload Image"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                      className="hidden"
                      onChange={(event) =>
                        uploadImage(event, editingId)
                      }
                      disabled={uploadingId === editingId}
                    />
                  </label>
                </div>

                <p className="mt-3 text-xs leading-5 text-zinc-400">
                  JPG, PNG, WEBP, AVIF or GIF. Maximum 10 MB.
                </p>
              </div>

              {/* DETAILS */}
              <div className="space-y-5">

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Most Popular"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Subtitle
                  </label>

                  <textarea
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe this collection..."
                    className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Button Text
                    </label>

                    <input
                      type="text"
                      name="buttonText"
                      value={form.buttonText}
                      onChange={handleChange}
                      placeholder="Explore Collection"
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Button Link
                    </label>

                    <input
                      type="text"
                      name="buttonLink"
                      value={form.buttonLink}
                      onChange={handleChange}
                      placeholder="/collection/most-popular"
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Display Order
                    </label>

                    <input
                      type="number"
                      name="order"
                      min="0"
                      value={form.order}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Visibility
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          isActive: !previous.isActive,
                        }))
                      }
                      className={`mt-2 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        form.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-zinc-200 bg-zinc-50 text-zinc-500"
                      }`}
                    >
                      <span>
                        {form.isActive ? "Visible" : "Hidden"}
                      </span>

                      <span
                        className={`h-5 w-9 rounded-full p-1 transition ${
                          form.isActive ? "bg-emerald-500" : "bg-zinc-300"
                        }`}
                      >
                        <span
                          className={`block h-3 w-3 rounded-full bg-white transition ${
                            form.isActive ? "translate-x-4" : ""
                          }`}
                        />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="mt-10 border-t border-zinc-100 pt-8">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Collection Products
                  </label>

                  <p className="mt-1 text-xs text-zinc-400">
                    Select the products that belong to this homepage
                    collection.
                  </p>
                </div>

                <span className="text-xs font-bold text-red-600">
                  {form.products.length} selected
                </span>
              </div>

              {products.length > 0 ? (
                <div className="mt-4 grid max-h-[360px] gap-3 overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-2 xl:grid-cols-3">

                  {products.map((product) => {
                    const selected = form.products.includes(product._id);

                    const productImage =
                      product.variants?.[0]?.images?.[0]?.url || "";

                    return (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => handleProductToggle(product._id)}
                        className={`flex items-center gap-3 rounded-xl border bg-white p-3 text-left transition ${
                          selected
                            ? "border-red-500 ring-2 ring-red-500/10"
                            : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] font-bold text-zinc-400">
                              NO IMG
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-zinc-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                            {product.section || "Product"}
                          </p>
                        </div>

                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                            selected
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-zinc-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-10 text-center">
                  <p className="text-sm font-bold text-zinc-700">
                    No products available yet.
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    Add products from the Products section first.
                  </p>
                </div>
              )}
            </div>

            {/* SAVE */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  savingId === editingId ||
                  uploadingId === editingId
                }
                className="rounded-xl bg-red-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingId === editingId
                  ? "Saving..."
                  : "Save Collection"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =================================================
          MANAGED HOMEPAGE SECTIONS
      ================================================= */}
      <section className="mt-8">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
            Homepage Posters
          </p>
          <h2 className="mt-1 font-['Outfit'] text-2xl font-extrabold tracking-tight text-zinc-950">
            Shop By Category & Every Moment
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Upload and manage the poster for each card directly from the admin
            panel. These sections are connected to the storefront.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {Object.keys(defaultManagedSections).map((sectionKey) => (
            <ManagedSectionCard
              key={sectionKey}
              section={managedSections[sectionKey]}
              defaults={defaultManagedSections[sectionKey]}
              onEdit={() => startEditingManaged(sectionKey)}
              onCreate={() => createManagedSection(sectionKey)}
              onToggle={() => toggleManagedSection(sectionKey)}
              onDelete={() => deleteManagedSection(sectionKey)}
              creating={savingManagedKey === sectionKey && !editingManagedKey}
            />
          ))}
        </div>
      </section>

      {/* =================================================
          COLLECTIONS
      ================================================= */}
      <section className="mt-8">

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
              Homepage Content
            </p>

            <h2 className="mt-1 font-['Outfit'] text-2xl font-extrabold tracking-tight text-zinc-950">
              Top Collections
            </h2>
          </div>

          <span className="hidden text-xs font-semibold text-zinc-400 sm:block">
            {collections.length} collection
            {collections.length === 1 ? "" : "s"}
          </span>
        </div>

        {collections.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-2xl">
              ▣
            </div>

            <h3 className="mt-5 font-['Outfit'] text-xl font-bold text-zinc-900">
              No homepage collections yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Create your first collection and control exactly what appears
              in the homepage collection section.
            </p>

            <button
              type="button"
              onClick={createCollection}
              className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
            >
              Create Collection
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection, index) => (
              <CollectionAdminCard
                key={collection._id}
                collection={collection}
                index={index}
                onEdit={() => startEditing(collection)}
                onDelete={() => deleteCollection(collection)}
                onToggle={() => toggleActive(collection)}
              />
            ))}
          </div>
        )}
      </section>

      {/* INFO */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600">
            i
          </div>

          <div>
            <p className="text-sm font-bold text-zinc-900">
              Homepage content is now manageable
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Hero content and collection content are stored separately,
              allowing you to update the storefront without modifying React
              components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader({ onCreate }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
          Storefront CMS
        </p>

        <h1 className="mt-2 font-['Outfit'] text-3xl font-extrabold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
          Home Page
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Control the Hero, homepage imagery and collection content from one
          place.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 sm:w-fit"
      >
        <span className="text-lg leading-none">+</span>
        Add Collection
      </button>
    </div>
  );
}

/* =========================================================
   MANAGED SECTION CARD
========================================================= */

function ManagedSectionCard({
  section,
  defaults,
  onEdit,
  onCreate,
  onToggle,
  onDelete,
  creating,
}) {
  const items = section?.items || defaults.items;
  const configuredImages = items.filter((item) => item.image?.url).length;

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-600">
                {section ? "Configured" : "Not Configured"}
              </span>
              {section && (
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    section.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {section.isActive ? "Live" : "Hidden"}
                </span>
              )}
            </div>

            <h3 className="mt-3 font-['Outfit'] text-xl font-extrabold text-zinc-950 sm:text-2xl">
              {defaults.title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {defaults.subtitle}
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
              Posters
            </p>
            <p className="mt-1 text-lg font-extrabold text-zinc-950">
              {configuredImages}/{items.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-5">
        {items.map((item) => (
          <div
            key={item.key}
            className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
          >
            <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
              {item.image?.url ? (
                <img
                  src={item.image.url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <span className="px-2 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                    No Poster
                  </span>
                </div>
              )}
            </div>

            <div className="p-2.5 sm:p-3">
              <p className="truncate text-xs font-bold text-zinc-900">
                {item.title}
              </p>
              <p className="mt-1 truncate text-[10px] text-zinc-400">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-zinc-100 p-4 sm:flex sm:justify-end">
        {section ? (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl bg-zinc-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-red-600 sm:px-5"
            >
              Edit Posters
            </button>

            <button
              type="button"
              onClick={onToggle}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50"
            >
              {section.isActive ? "Hide" : "Show"}
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="col-span-2 rounded-xl px-4 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-50 sm:col-span-1"
            >
              Delete
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onCreate}
            disabled={creating}
            className="col-span-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1"
          >
            {creating ? "Creating..." : "Create Section"}
          </button>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   MANAGED SECTION EDITOR
========================================================= */

function ManagedSectionEditor({
  section,
  sectionKey,
  saving,
  uploadingKey,
  onChange,
  onItemChange,
  onToggleItem,
  onUpload,
  onCancel,
  onSave,
}) {
  const sectionLabel =
    sectionKey === "shop-by-category"
      ? "Shop By Category"
      : "Step Into What Matters";

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-zinc-100 px-5 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
              Poster Editor
            </p>
            <h2 className="mt-1 font-['Outfit'] text-2xl font-extrabold tracking-tight text-zinc-950">
              {sectionLabel}
            </h2>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Upload a separate poster for every homepage card.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={onSave} className="p-5 sm:p-6 lg:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
              Section Title
            </label>
            <input
              type="text"
              name="title"
              value={section.title}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
              Section Button
            </label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                type="text"
                name="buttonText"
                value={section.buttonText}
                onChange={onChange}
                placeholder="Explore More"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              />
              <input
                type="text"
                name="buttonLink"
                value={section.buttonLink}
                onChange={onChange}
                placeholder="/products/men"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
            Section Description
          </label>
          <textarea
            name="subtitle"
            value={section.subtitle}
            onChange={onChange}
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-6 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
              Storefront Visibility
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Hide the complete section without deleting its posters.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onChange({
                target: {
                  name: "isActive",
                  value: !section.isActive,
                },
              })
            }
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold sm:w-48 ${
              section.isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-zinc-200 bg-white text-zinc-500"
            }`}
          >
            <span>{section.isActive ? "Visible" : "Hidden"}</span>
            <span
              className={`h-5 w-9 rounded-full p-1 ${
                section.isActive ? "bg-emerald-500" : "bg-zinc-300"
              }`}
            >
              <span
                className={`block h-3 w-3 rounded-full bg-white transition ${
                  section.isActive ? "translate-x-4" : ""
                }`}
              />
            </span>
          </button>
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                Homepage Posters
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Recommended: portrait lifestyle/footwear artwork with the
                subject clearly visible.
              </p>
            </div>
            <span className="text-xs font-bold text-red-600">
              {section.items.filter((item) => item.image?.url).length}/
              {section.items.length} uploaded
            </span>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {section.items.map((item, index) => {
              const uploadKey = `${sectionKey}:${item.key}`;

              return (
                <div
                  key={item.key}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                          ↑
                        </div>
                        <p className="mt-3 text-xs font-bold text-zinc-700">
                          No Poster
                        </p>
                      </div>
                    )}

                    <label className="absolute bottom-3 left-3 right-3 flex cursor-pointer items-center justify-center rounded-xl bg-zinc-950 px-3 py-3 text-xs font-bold text-white shadow-xl transition hover:bg-red-600">
                      {uploadingKey === uploadKey
                        ? "Uploading..."
                        : item.image?.url
                        ? "Replace Poster"
                        : "Upload Poster"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                        className="hidden"
                        onChange={(event) =>
                          onUpload(event, sectionKey, item.key)
                        }
                        disabled={uploadingKey === uploadKey}
                      />
                    </label>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                        Card {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => onToggleItem(index)}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {item.isActive ? "Live" : "Hidden"}
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.title}
                      onChange={(event) =>
                        onItemChange(index, "title", event.target.value)
                      }
                      placeholder="Card title"
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm font-bold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />

                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(event) =>
                        onItemChange(index, "subtitle", event.target.value)
                      }
                      placeholder="Card subtitle"
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-xs outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />

                    <input
                      type="text"
                      value={item.buttonLink}
                      onChange={(event) =>
                        onItemChange(index, "buttonLink", event.target.value)
                      }
                      placeholder="/products/men"
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-xs outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-red-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Saving Section..." : "Save Section"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* =========================================================
   COLLECTION ADMIN CARD
========================================================= */

function CollectionAdminCard({
  collection,
  index,
  onEdit,
  onDelete,
  onToggle,
}) {
  const image = collection.image?.url || "";

  const productCount = collection.products?.length || 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">

        {image ? (
          <img
            src={image}
            alt={collection.title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="text-3xl text-zinc-300">▣</div>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
              No Image
            </p>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-lg bg-zinc-950/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          0{index + 1}
        </div>

        <div
          className={`absolute right-4 top-4 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur ${
            collection.isActive
              ? "bg-emerald-500/90 text-white"
              : "bg-zinc-950/75 text-white"
          }`}
        >
          {collection.isActive ? "Live" : "Hidden"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-['Outfit'] text-xl font-extrabold text-zinc-950">
              {collection.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
              {collection.subtitle ||
                "No collection description has been added yet."}
            </p>
          </div>

          <span className="shrink-0 rounded-lg bg-zinc-100 px-2.5 py-1.5 text-[10px] font-bold text-zinc-500">
            #{collection.order ?? 0}
          </span>
        </div>

        {/* META */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-zinc-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
              Products
            </p>

            <p className="mt-1 text-sm font-bold text-zinc-900">
              {productCount}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
              Button
            </p>

            <p className="mt-1 truncate text-sm font-bold text-zinc-900">
              {collection.buttonText || "Explore"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-5 grid grid-cols-2 gap-2">

          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl bg-zinc-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-red-600"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
          >
            {collection.isActive ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="mt-2 w-full rounded-xl px-4 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-50"
        >
          Delete Collection
        </button>
      </div>
    </article>
  );
}

export default AdminHome;