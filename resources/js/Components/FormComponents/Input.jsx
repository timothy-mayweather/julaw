const Input = (
  {
    type,
    className="",
    required=true,
    value,
    name,
    handleChange,
    row,
    dataId,
    defaultValue,
    hidden=false,
    style,
    placeholder,
    disabled
  }) => {

  const validator = (type)=>{
    switch (type) {
      case 'int':
        return (ev)=>{
          let str="";
          for (let i of ev.target.value) if (i.valueOf() >= 0) str += i;
          ev.target.value = str;
        }
      case 'float':
        return (ev)=>{
          let str="", dot=false;
          for (let i of ev.target.value) if (i.valueOf()>=0) str+=i; else if(i==='.'&&!dot){ str+=i; dot=true;}
          ev.target.value = str;
        }
      case 'lower':
        return (ev)=>{ev.target.value = ev.target.value.toLowerCase()}
      case 'upper':
        return (ev)=>{ev.target.value = ev.target.value.toUpperCase()}
      default:
        return null
    }
  }

  const onInput = validator(type);

  return (
    <input
      type="text"
      style={style}
      name={name}
      onInput={onInput}
      className={"form-control "+className}
      defaultValue={defaultValue}
      value={value}
      required={required}
      onChange={(e)=>handleChange(e)}
      data-row={row}
      data-id={dataId}
      data-old-value={defaultValue}
      hidden={hidden}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

export default Input;
