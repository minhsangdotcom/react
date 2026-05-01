export const getCSSVariable = (variableName: string): string => {
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
    return value || "white";
  } catch (error) {
    console.warn(`CSS variable ${variableName} not found`);
    return "white";
  }
};