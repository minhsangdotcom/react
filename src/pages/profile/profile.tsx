import "./profile.css";
import Select, { SingleValue } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useAuth } from "../../hooks/useAuth";
import LoadingPage from "../../components/loading";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { regionService } from "../../services/regions/regionService";
import { ICommune, IDistrict, IProvince } from "../../types/regions/IRegion";
import authService from "../../services/auth/authService";
import IUpdateProfileRequest from "../../types/user/IUpdateProfileRequest";
import { IUser } from "../../types/user/IUser";
import LoadingButton from "../../components/loadingButton";

import { Tooltip } from "react-tooltip";
type Region = {
  provinces: Array<IProvince>;
  districts: Array<IProvince>;
  communes: Array<IProvince>;
};

async function fetchDistrict(id: string) {
  return await regionService.listDistrict({
    filter: { provinceId: { $eq: id } },
  });
}

async function fetchCommune(id: string) {
  return await regionService.listCommune({
    filter: { districtId: { $eq: id } },
  });
}

const toRequest = (user: IUser): IUpdateProfileRequest => ({
  firstName: user?.firstName!,
  lastName: user?.lastName!,
  dayOfBirth: user?.dayOfBirth!,
  email: user?.email!,
  provinceId: user?.address?.provinceId!,
  districtId: user?.address?.districtId!,
  communeId: user?.address?.communeId!,
  province: user?.address?.province,
  district: user?.address?.district,
  commune: user?.address?.commune,
  street: user?.address?.street,
  phoneNumber: user?.phoneNumber!,
  avatar: user?.avatar!,
});

export default function profilePage() {
  const currentDate = new Date();
  const { user, isLoading } = useAuth();

  const [startDate, setStartDate] = useState<Date>(new Date("1990-01-01"));
  const [currentLoading, setCurrentLoading] = useState<boolean>(false);
  const [region, setRegion] = useState<Region>({
    provinces: [],
    districts: [],
    communes: [],
  });
  const [userRequest, setUserRequest] = useState<IUpdateProfileRequest>({});

  const [avatar, setAvatar] = useState<File | null>(null);

  const pRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  console.log("🚀 ~ profilePage ~ isTruncated:", isTruncated);

  const fullAddress = getFullAddress(
    userRequest.street!,
    userRequest.commune!,
    userRequest.district!,
    userRequest.province!
  );

  const onChangeProvince = (
    e: SingleValue<{ value: string | undefined; label: string | undefined }>
  ) => {
    setUserRequest((pre) => ({
      ...pre,
      provinceId: e?.value,
      province: e?.label,
    }));

    fetchDistrict(e?.value!)
      .then((result) => {
        const districts = result.data?.results?.data as any as Array<IDistrict>;
        setRegion((pre) => ({ ...pre, districts }));
        setUserRequest((pre) => ({
          ...pre,
          districtId: districts[0]?.id,
          district: districts[0]?.fullName,
        }));
      })
      .catch((error) => {
        console.log("🚀 ~ profilePage ~ error:", error);
      });
  };

  const onChangeDistrict = (
    e: SingleValue<{ value: string | undefined; label: string | undefined }>
  ) => {
    setUserRequest((pre) => ({
      ...pre!,
      districtId: e?.value,
      district: e?.label,
    }));
    fetchCommune(e?.value!)
      .then((result) => {
        const communes = result.data?.results?.data as any as Array<ICommune>;
        setRegion((pre) => ({ ...pre, communes }));
        setUserRequest((pre) => ({
          ...pre,
          communeId: communes[0]?.id,
          commune: communes[0]?.fullName,
        }));
      })
      .catch((error) => {
        console.log("🚀 ~ profilePage ~ error:", error);
      });
  };
  const onChangeCommune = (
    e: SingleValue<{
      value: string | null | undefined;
      label: string | null | undefined;
    }>
  ) => {
    setUserRequest((pre) => ({
      ...pre!,
      communeId: e?.value,
      commune: e?.label,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    if (!img.type.startsWith("image/")) {
      return;
    }
    setAvatar(img);
    setUserRequest((pre) => ({ ...pre, avatar: URL.createObjectURL(img) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(userRequest).forEach(([key, val]) => {
      if (val == null) return;
      if (key === "avatar") return;

      formData.append(key, String(val));
    });

    if (avatar) {
      formData.append("avatar", avatar, avatar.name);
    }

    setCurrentLoading(true);
    var result = await authService.updateProfile(formData);

    if (result.isSuccess) {
      const data = result.data?.results;
      setUserRequest((pre) => ({
        ...pre,
        avatar: data?.avatar ? data?.avatar : "/images/default-avatar.png",
      }));
    }
    setCurrentLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    setUserRequest(toRequest(user));
    async function fetchRegionData() {
      setCurrentLoading(true);
      try {
        const provRes = await regionService.listProvince({});
        const provinces = (provRes.data?.results?.data ?? []) as IProvince[];

        setRegion((prev) => ({ ...prev, provinces }));

        let districts = [] as Array<IDistrict>;
        if (provinces.length > 0) {
          const firstProvinceId = user?.address?.provinceId ?? provinces[0].id;
          const distRes = await fetchDistrict(firstProvinceId);
          districts = (distRes.data?.results?.data ?? []) as IDistrict[];
          setRegion((prev) => ({ ...prev, districts }));
        }

        if (districts.length > 0) {
          const firstDistrictId = user?.address?.districtId ?? districts[0].id;
          const communeRes = await fetchCommune(firstDistrictId);
          const communes = (communeRes.data?.results?.data ?? []) as ICommune[];
          setRegion((prev) => ({ ...prev, communes }));
        }
      } catch (err) {
        console.error("Error fetching region data", err);
      } finally {
        setCurrentLoading(false);
      }
    }

    fetchRegionData();
  }, [user]);

  useEffect(() => {
    const el = pRef.current as HTMLParagraphElement | null;
    if (!el) return;

    const checkTruncation = () => {
      const truncated = el.scrollHeight > el.clientHeight;
      setIsTruncated(truncated);
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [fullAddress]);

  if (isLoading && currentLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="profile-page p-5 w-full md:w-6/10 lg:w-5/10">
      <div className="profile-header">
        <div className="relative flex-none">
          <img
            src={userRequest.avatar ?? "/images/default-avatar.png"}
            alt="Avatar"
            className="rounded-full w-30"
          />
          <label className="edit-icon absolute sm:bottom-0 sm:right-0 bg-blue-300 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center cursor-pointer shadow-md">
            <img
              src="/icons/edit-icon.png"
              alt="Edit"
              className="w-3 h-3 sm:w-4 sm:h-4 object-contain"
            />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="profile-info flex-1 min-w-0 pl-2 md:pl-1">
          <h2>
            {userRequest?.firstName} {userRequest?.lastName}
          </h2>
          <div className="subheading line-clamp-3 text-sm">
            <p
              data-tooltip-id="address-tooltip"
              ref={pRef}
              {...(isTruncated && {
                "data-tooltip-id": "address-tooltip",
                "data-tooltip-content": fullAddress,
              })}
            >
              {fullAddress && fullAddress}
            </p>
          </div>
          <Tooltip
            id="address-tooltip"
            place="top"
            className="address-tooltip whitespace-normal break-words max-w-xs rounded-lg shadow-lg"
            border={"1px solid #fff"}
            style={{
              zIndex: 9999,
              borderRadius: "14px",
            }}
          />
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label>First Name</label>
            <input
              name="firstName"
              value={userRequest?.firstName}
              onChange={(e) =>
                setUserRequest((pre) => ({ ...pre, firstName: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input
              name="lastName"
              value={userRequest?.lastName}
              onChange={(e) =>
                setUserRequest((pre) => ({ ...pre, lastName: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={userRequest?.email}
              onChange={(e) =>
                setUserRequest((pre) => ({ ...pre!, email: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input
              name="phone"
              value={user?.phoneNumber}
              onChange={(e) =>
                setUserRequest((pre) => ({
                  ...pre!,
                  phoneNumber: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Day of Birth</label>
            <DatePicker
              selected={user?.dayOfBirth ?? startDate}
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
              options={region.provinces?.map((x) => ({
                value: x.id,
                label: x.fullName,
              }))}
              value={{
                value: userRequest.provinceId,
                label: userRequest.province,
              }}
              onChange={onChangeProvince}
            />
          </div>
          <div className="field">
            <label>District</label>
            <Select
              name="district"
              styles={customStyles}
              options={region.districts?.map((x) => ({
                value: x.id,
                label: x.fullName,
              }))}
              value={{
                value: userRequest.districtId,
                label: userRequest.district,
              }}
              onChange={onChangeDistrict}
            />
          </div>
          <div className="field">
            <label>Commune</label>
            <Select
              name="commune"
              styles={customStyles}
              options={region.communes?.map((x) => ({
                value: x.id,
                label: x.fullName,
              }))}
              value={{
                value: userRequest.communeId,
                label: userRequest.commune,
              }}
              onChange={onChangeCommune}
            />
          </div>
        </div>
        <div className="full-row">
          <label>Street</label>
          <textarea
            name="street"
            value={userRequest.street}
            onChange={(e) =>
              setUserRequest((pre) => ({ ...pre!, street: e.target.value }))
            }
          />
        </div>

        <div className="btn-wrapper">
          <LoadingButton
            loading={currentLoading}
            text="Save Changes"
            type="submit"
            className="save-btn"
          />
        </div>
      </form>
    </div>
  );
}

const getFullAddress = (
  street: string,
  commune: string,
  district: string,
  province: string
) => [street, commune, district, province].join(", ");

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
