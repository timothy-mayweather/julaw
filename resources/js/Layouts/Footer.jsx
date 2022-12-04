import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <strong>Copyright &copy; 2021-{new Date().getFullYear()} <span
        style={{fontFamily: "Orbitron,monospace", textAlign: "center"}}>Timothy Kibalama</span>. </strong>
      All rights reserved.
      <div className="float-right d-none d-sm-inline-block">
        <b>Version</b> 1.0
      </div>
    </footer>
  );
};

export default Footer;
