import React from 'react';
import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";

const heading = "Dips";

const Dips = () => {
  return (
    <div style={{marginBottom: "5px"}}>
      <button type="button" className="btn btn-outline-primary" id="addDipBtn">Add Dip</button>
      <table id="addDipTable" className="table table-bordered table-hover table-responsive form-table registry-table" hidden></table>
    </div>
  );
};

Dips.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)

export default Dips;
