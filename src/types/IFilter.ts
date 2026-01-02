export default interface IFilter {
  id: string;
  value: Array<string> | string;
  operator: string;
  variant: string;
  filterId: string;
}
