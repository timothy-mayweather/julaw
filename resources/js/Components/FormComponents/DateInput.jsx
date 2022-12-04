import {useEffect} from "react";

const DateInput = (
  {
    className="",
    required=true,
    value,
    name,
    handleChange,
    row,
    dataId,
    placeholder=null,
    title=null,
    id,
    type = 'modal',
  }) => {

  useEffect(()=> {
      const datepicker = MCDatepicker.create({
        el: '#' + id,
        dateFormat: 'DD/MM/YYYY',
        selectedDate: new Date(),
        autoClose: true,
        closeOnBlur: true,
        bodyType: type
      });
      datepicker.onSelect((date, formattedDate)=>handleChange(formattedDate));
    }
  )

  return (
    <input
      type="text"
      id={id}
      title={title??"choose date"}
      name={name??"datepicker"}
      className={"form-control "+className}
      defaultValue={value}
      required={required}
      placeholder={placeholder??"choose date"}
      onChange={handleChange}
      data-row={row}
      data-id={dataId}
      data-old-value={value}
      style={{cursor:'pointer'}}
    />
  );
}

export default DateInput;
