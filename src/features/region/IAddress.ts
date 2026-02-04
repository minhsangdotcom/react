export interface Address {
  street: string;
  provinceId: string;
  province: string;
  districtId: string;
  district: string;
  communeId: string | null;
  commune: string | null;
}
