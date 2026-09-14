import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext.jsx";

import API_BASE from "../../src/config/api.js";

function ProfilePage() {
  const navigate = useNavigate();

  const {
    token,
    isAuthenticated,
    login,
  } = useContext(AuthContext);

  // ===============================
  // PROFILE STATE
  // ===============================
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });

  // ===============================
  // ADDRESS STATE
  // ===============================
  const [addresses, setAddresses] = useState([]);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  // If null = adding new address
  // If contains ID = editing existing address
  const [editingAddressId, setEditingAddressId] =
    useState(null);

  // ===============================
  // LOADING STATES
  // ===============================
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] =
    useState(false);

  const [addressLoading, setAddressLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ===============================
  // REDIRECT IF NOT LOGGED IN
  // ===============================
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(
          "/profile"
        )}`,
        {
          replace: true,
        }
      );
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  // ===============================
  // GET PROFILE + ADDRESSES
  // ===============================
  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const getProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/users/profile`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to load profile"
          );
        }

        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          gender: data.user.gender || "",
        });

        setAddresses(
          data.user.addresses || []
        );
      } catch (error) {
        console.error(
          "Get profile error:",
          error
        );

        setError(
          error.message ||
            "Something went wrong while loading your profile"
        );
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [
    isAuthenticated,
    token,
  ]);

  // ===============================
  // PROFILE INPUT CHANGE
  // ===============================
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setProfile(
      (currentProfile) => ({
        ...currentProfile,
        [name]: value,
      })
    );
  };

  // ===============================
  // ADDRESS INPUT CHANGE
  // ===============================
  const handleAddressChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setAddressForm(
      (currentAddress) => ({
        ...currentAddress,
        [name]: value,
      })
    );
  };

  // ===============================
  // RESET ADDRESS FORM
  // ===============================
  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });

    setEditingAddressId(null);
  };

  // ===============================
  // UPDATE PROFILE
  // ===============================
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/users/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: profile.name,
            phone: profile.phone,
            gender: profile.gender,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to update profile"
        );
      }

      setProfile({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        gender: data.user.gender || "",
      });

      // Update AuthContext
      login(
        data.user,
        token
      );

      setSuccess(
        "Profile updated successfully"
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while updating your profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // ADD NEW ADDRESS
  // ===============================
  const handleAddAddress = async (
    event
  ) => {
    event.preventDefault();

    try {
      setAddressLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/users/addresses`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            addressForm
          ),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to add address"
        );
      }

      setAddresses(
        (currentAddresses) => [
          ...currentAddresses,
          data.address,
        ]
      );

      resetAddressForm();

      setShowAddressForm(false);

      setSuccess(
        "Address added successfully"
      );
    } catch (error) {
      console.error(
        "Add address error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while adding the address"
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // ===============================
  // START EDITING ADDRESS
  // ===============================
  const handleEditAddress = (
    address
  ) => {
    setEditingAddressId(
      address._id
    );

    setAddressForm({
      fullName:
        address.fullName || "",

      phone:
        address.phone || "",

      addressLine1:
        address.addressLine1 || "",

      addressLine2:
        address.addressLine2 || "",

      city:
        address.city || "",

      state:
        address.state || "",

      pincode:
        address.pincode || "",

      country:
        address.country || "India",
    });

    setShowAddressForm(true);

    setError("");
    setSuccess("");

    // Scroll to address form
    window.scrollTo({
      top: 500,
      behavior: "smooth",
    });
  };

  // ===============================
  // UPDATE ADDRESS
  // ===============================
  const handleUpdateAddress = async (
    event
  ) => {
    event.preventDefault();

    if (!editingAddressId) {
      return;
    }

    try {
      setAddressLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/users/addresses/${editingAddressId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            addressForm
          ),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to update address"
        );
      }

      // Update address immediately
      // without reloading page
      setAddresses(
        (currentAddresses) =>
          currentAddresses.map(
            (address) =>
              address._id ===
              editingAddressId
                ? {
                    ...address,
                    ...data.address,
                  }
                : address
          )
      );

      resetAddressForm();

      setShowAddressForm(false);

      setSuccess(
        "Address updated successfully"
      );
    } catch (error) {
      console.error(
        "Update address error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while updating the address"
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // ===============================
  // SET DEFAULT ADDRESS
  // ===============================
  const handleSetDefaultAddress =
    async (addressId) => {
      try {
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `${API_BASE}/api/users/addresses/${addressId}/default`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to set default address"
          );
        }

        setAddresses(
          (currentAddresses) =>
            currentAddresses.map(
              (address) => ({
                ...address,
                isDefault:
                  address._id ===
                  addressId,
              })
            )
        );

        setSuccess(
          "Default address updated successfully"
        );
      } catch (error) {
        console.error(
          "Set default address error:",
          error
        );

        setError(
          error.message ||
            "Something went wrong while updating the default address"
        );
      }
    };

  // ===============================
  // DELETE ADDRESS
  // ===============================
  const handleDeleteAddress =
    async (addressId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this address?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `${API_BASE}/api/users/addresses/${addressId}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to delete address"
          );
        }

        setAddresses(
          (currentAddresses) =>
            currentAddresses.filter(
              (address) =>
                address._id !==
                addressId
            )
        );

        // If user deletes the
        // address currently being edited
        if (
          editingAddressId ===
          addressId
        ) {
          resetAddressForm();
          setShowAddressForm(false);
        }

        setSuccess(
          "Address deleted successfully"
        );
      } catch (error) {
        console.error(
          "Delete address error:",
          error
        );

        setError(
          error.message ||
            "Something went wrong while deleting the address"
        );
      }
    };

  // ===============================
  // LOADING SCREEN
  // ===============================
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-zinc-600">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* ===============================
            HEADING
        =============================== */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">
            ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Manage your personal information and delivery addresses.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ===============================
            PROFILE FORM
        =============================== */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-xl font-bold text-zinc-900">
            Personal Information
          </h2>

          {/* NAME */}
          <div className="mt-6">
            <label className="text-sm font-medium text-zinc-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* EMAIL */}
          <div className="mt-5">
            <label className="text-sm font-medium text-zinc-700">
              Email Address
            </label>

            <input
              type="email"
              value={profile.email}
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-500"
            />

            <p className="mt-2 text-xs text-zinc-500">
              Email address cannot be changed.
            </p>
          </div>

          {/* PHONE */}
          <div className="mt-5">
            <label className="text-sm font-medium text-zinc-700">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* GENDER */}
          <div className="mt-5">
            <label className="text-sm font-medium text-zinc-700">
              Gender
            </label>

            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            >
              <option value="">
                Select gender
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>

          {/* SAVE PROFILE */}
          <button
            type="submit"
            disabled={saving}
            className="mt-8 w-full rounded-xl bg-zinc-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </form>

        {/* ===============================
            MY ADDRESSES
        =============================== */}
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">
                My Addresses
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Manage your delivery addresses.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (showAddressForm) {
                  resetAddressForm();
                  setShowAddressForm(false);
                } else {
                  resetAddressForm();
                  setShowAddressForm(true);
                }

                setError("");
                setSuccess("");
              }}
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-700"
            >
              {showAddressForm
                ? "Close"
                : "+ Add New Address"}
            </button>
          </div>

          {/* ===============================
              ADD / EDIT ADDRESS FORM
          =============================== */}
          {showAddressForm && (
            <form
              onSubmit={
                editingAddressId
                  ? handleUpdateAddress
                  : handleAddAddress
              }
              className="mt-6 border-t border-zinc-200 pt-6"
            >
              <h3 className="text-lg font-bold text-zinc-900">
                {editingAddressId
                  ? "Edit Address"
                  : "Add New Address"}
              </h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                {/* FULL NAME */}
                <div>
                  <label className="text-sm font-medium text-zinc-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={addressForm.fullName}
                    onChange={
                      handleAddressChange
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="text-sm font-medium text-zinc-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={
                      handleAddressChange
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              {/* ADDRESS LINE 1 */}
              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-700">
                  Address Line 1
                </label>

                <input
                  type="text"
                  name="addressLine1"
                  value={
                    addressForm.addressLine1
                  }
                  onChange={
                    handleAddressChange
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                />
              </div>

              {/* ADDRESS LINE 2 */}
              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-700">
                  Address Line 2 (Optional)
                </label>

                <input
                  type="text"
                  name="addressLine2"
                  value={
                    addressForm.addressLine2
                  }
                  onChange={
                    handleAddressChange
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                />
              </div>

              {/* CITY / STATE / PINCODE */}
              <div className="mt-5 grid gap-5 sm:grid-cols-3">

                <div>
                  <label className="text-sm font-medium text-zinc-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={
                      addressForm.city
                    }
                    onChange={
                      handleAddressChange
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={
                      addressForm.state
                    }
                    onChange={
                      handleAddressChange
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={
                      addressForm.pincode
                    }
                    onChange={
                      handleAddressChange
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  type="submit"
                  disabled={
                    addressLoading
                  }
                  className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
                >
                  {addressLoading
                    ? editingAddressId
                      ? "Updating..."
                      : "Adding..."
                    : editingAddressId
                    ? "Update Address"
                    : "Save Address"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetAddressForm();
                    setShowAddressForm(false);
                  }}
                  className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ===============================
              ADDRESS LIST
          =============================== */}
          <div className="mt-6 space-y-4">
            {addresses.length === 0 ? (
              <div className="rounded-xl bg-zinc-50 p-5 text-center text-sm text-zinc-500">
                No saved addresses yet.
              </div>
            ) : (
              addresses.map(
                (address) => (
                  <div
                    key={address._id}
                    className="rounded-xl border border-zinc-200 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">

                      {/* ADDRESS DETAILS */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-zinc-900">
                            {
                              address.fullName
                            }
                          </h3>

                          {address.isDefault && (
                            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                          {
                            address.addressLine1
                          }

                          {address.addressLine2 &&
                            `, ${address.addressLine2}`}

                          <br />

                          {address.city},{" "}
                          {address.state} -{" "}
                          {address.pincode}

                          <br />

                          {address.country ||
                            "India"}

                          <br />

                          Phone:{" "}
                          {address.phone}
                        </p>
                      </div>

                      {/* ADDRESS ACTIONS */}
                      <div className="flex flex-wrap gap-2">

                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEditAddress(
                              address
                            )
                          }
                          className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                        >
                          Edit
                        </button>

                        {/* SET DEFAULT */}
                        {!address.isDefault && (
                          <button
                            type="button"
                            onClick={() =>
                              handleSetDefaultAddress(
                                address._id
                              )
                            }
                            className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                          >
                            Set as Default
                          </button>
                        )}

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteAddress(
                              address._id
                            )
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;