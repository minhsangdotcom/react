export default interface IUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dayOfBirth?: Date;
  provinceId?: string;
  province?: string;
  districtId?: string;
  district?: string;
  communeId?: string | null;
  commune?: string | null;
  street?: string;
  avatar?: string;
}
