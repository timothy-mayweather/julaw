import React from 'react';
import Main from "@/Layouts/Main";

const RecordsForm = ({heading, children}) => {
  return (
    <form id="records-form">
      <br />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">{heading}</h3>
                </div>
                <div className="card-body">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
};

RecordsForm.layout = page => <Main children={page} title="Records"/>

export default RecordsForm;
