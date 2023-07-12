import React from 'react';

const Files = () => {
  return (
    <div>
      <main role="main" className="container pt-2" id="drop-container" hidden>
        <div className="row">
          <div className="col-md-6 col-sm-12">

            <div id="drag-and-drop-zone" className="dm-uploader p-5 text-center">
              <h4 className="mb-5 mt-5 text-muted">Drag &amp; drop Files here</h4>

              <div className="btn btn-block mb-5">
                <span><i className="fas fa-arrow-alt-circle-right"></i>Click here to select files</span>
                <input type="file" title="Click to add Files" multiple="" />
              </div>
            </div>

            <div className="mt-2">
              <a href="#" className="btn btn-primary" id="btnApiStart">
                <i className="fa fa-play"></i> Start
              </a>
              <a href="#" className="btn btn-danger" id="btnApiCancel">
                <i className="fa fa-stop"></i> Stop
              </a>
            </div>
          </div>
          <div className="col-md-6 col-sm-12" style="resize: none">
            <div className="card h-100">
              <div className="card-header">
                File List
              </div>

              <ul className="list-unstyled p-2 d-flex flex-column col" id="files">
                <li className="text-muted text-center empty">No files uploaded.</li>
              </ul>
            </div>
          </div>
        </div>

        <script type="text/html" id="files-template">
          <li className="media">

            <div className="media-body mb-1">
              <p className="mb-2">
                <strong>%%filename%%</strong> - Status: <span className="text-muted">Waiting</span>
              </p>
              <div className="progress mb-2">
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                     role="progressbar"
                     style="width: 0"
                     aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                </div>
              </div>

              <p className="controls mb-2">
                <button className="btn btn-sm btn-primary start" role="button">Start</button>
                <button className="btn btn-sm btn-danger cancel" role="button"
                        disabled="disabled">Cancel
                </button>
              </p>
              <hr className="mt-1 mb-1"/>
            </div>
          </li>
        </script>

      </main>
    </div>
  );
};

export default Files;
