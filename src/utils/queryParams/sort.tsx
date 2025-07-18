export default function parseSort(
  sorts: Array<{ id: string; desc: boolean }>
): string {
  let strSort = "";
  for (let index = 0; index < sorts.length; index++) {
    const sort = sorts[index];
    strSort += `${sort.id}${sort.desc ? ":desc" : ""}`;
    if (index < sorts.length - 1) {
      strSort += ",";
    }
    strSort.trim();
  }
  return strSort;
}
