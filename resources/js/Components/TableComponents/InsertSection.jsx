import React, {useState, useEffect} from 'react';

const InsertSection = ({context, btnText=null, table}) => {
  const key = 'insert-'+context
  const [showTable, setShowTable] = useState(remember.hasOwnProperty(key));

  useEffect(() => {
    showTable?remember.setItem(key, ''):remember.removeItem(key)
  }, [showTable]);

  const show = () =>setShowTable(!showTable)
  return (
    <div style={{marginBottom: "5px"}}>
      {showTable ? table(show):<button type="button" className={"btn btn-outline-primary"} onClick={show}>{btnText === null? "Add "+context: btnText}</button>}
    </div>
  );
}

export default InsertSection;
