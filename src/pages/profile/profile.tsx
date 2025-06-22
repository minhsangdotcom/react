import "./profile.css";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, Navigate } from "react-router-dom";

export default function profilePage() {
  const currentDate = new Date();
  const [startDate, setStartDate] = useState<Date>(new Date("1990-01-01"));
  const { user, setUser, isLoading } = useAuth();

  if (!isLoading && !user) {
    const location = useLocation();
    <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    user && (
      <div className="profile-page">
        <div className="profile-header">
          <div className="avatar-wrapper">
            <img className="avatar" src="" alt="Avatar" />
            <label className="edit-overlay">
              <img alt="Edit" />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={() => {
                  /* handle upload */
                }}
              />
            </label>
          </div>
          <div className="profile-info">
            <h2>
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="subheading">{user?.address}</p>
          </div>
        </div>

        <form className="profile-form">
          <div className="row">
            <div className="field">
              <label>First Name</label>
              <input
                name="firstName"
                value={user?.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input
                name="lastName"
                value={user?.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={user?.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input
                name="phone"
                value={user?.phoneNumber}
                onChange={(e) =>
                  setUser({ ...user, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Day of Birth</label>
              <DatePicker
                selected={user.dayOfBirth ?? startDate}
                onChange={(date) => setStartDate(date!)}
                dateFormat="dd-MM-yyyy"
                placeholderText="DD-MM-yyyy"
                minDate={new Date(currentDate.getFullYear() - 100, 0, 1)}
                maxDate={new Date(currentDate.getFullYear() - 18, 11, 31)}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
            <div className="field">
              <label>Province</label>
              <Select
                name="province"
                styles={customStyles}
                options={[
                  { value: "chocolate", label: "Chocolate" },
                  { value: "strawberry", label: "Strawberry" },
                  { value: "vanilla", label: "Vanilla" },
                ]}
              />
            </div>
            <div className="field">
              <label>District</label>
              <Select
                name="district"
                styles={customStyles}
                options={[
                  { value: "chocolate", label: "Chocolate" },
                  { value: "strawberry", label: "Strawberry" },
                  { value: "vanilla", label: "Vanilla" },
                ]}
              />
            </div>
            <div className="field">
              <label>Commune</label>
              <Select
                name="commune"
                styles={customStyles}
                options={[
                  { value: "chocolate", label: "Chocolate" },
                  { value: "strawberry", label: "Strawberry" },
                  { value: "vanilla", label: "Vanilla" },
                ]}
              />
            </div>
          </div>
          <div className="full-row">
            <label>Street</label>
            <textarea
              name="street"
              value={user?.userAddress?.street}
              onChange={(e) =>
                setUser({
                  ...user,
                  userAddress: { ...user.userAddress, street: e.target.value },
                })
              }
            />
          </div>

          <div className="btn-wrapper">
            <button className="save-btn" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    )
  );
}

const customStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: "0.5rem",
    borderColor: "#b4afaf",
    padding: "0.4rem",
    boxShadow: "none",
    background: "white",
    cursor: "pointer",
    "&:hover": { borderColor: "#31A2C6" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.5rem",
    overflow: "hidden",
  }),
  option: (base: any, state: any) => ({
    ...base,
    padding: "0.75rem 1rem",
    backgroundColor: state.isFocused ? "rgba(91,192,222,0.2)" : "white",
    color: "#333",
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({ ...base, color: "#333" }),
};
