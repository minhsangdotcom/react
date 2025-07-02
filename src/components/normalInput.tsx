import "./normalInput.css";
export default function NormalInput({
  value,
  onChange,
  label,
  type,
  name,
  isRequired,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  type: string;
  name: string;
  isRequired: boolean;
}) {
  return (
    <div className="form-group">
      <label htmlFor="email">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        className="form-input"
        onChange={onChange}
        required={isRequired}
      />
    </div>
  );
}
