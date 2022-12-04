import React from 'react';
import ApplicationLogo from '@/Components/Auth/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';

export default function Guest({ children }) {
  return (
    <div className="container">
      <div className="row justify-content-center my-5">
        <div className="col-sm-12 col-md-8 col-lg-5 my-5">
          <div className="d-flex justify-content-center mb-3">
            <Link href="/">
              <ApplicationLogo width="82" />
            </Link>
          </div>

          <div className="card shadow-sm px-3">
            <div className="card-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
