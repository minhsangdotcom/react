enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}

const genderOptions = Object.values(Gender)
  .filter((v) => typeof v === "number")
  .map((v) => ({
    value: Gender[v as Gender],
    label: Gender[v as Gender],
  }));

export { genderOptions, Gender };
