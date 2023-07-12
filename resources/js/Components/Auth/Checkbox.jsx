export default function Checkbox({ name, value, handleChange}) {
    return (
        <input
            type="checkbox"
            name={name}
            value={value}
            className="form-check-input"
            onChange={(e) => handleChange(e)}
        />
    );
}
