import React from 'react';
import {InertiaLink} from "@inertiajs/inertia-react";

const NavList = ({liClass="", href, aClass, iClass, word}) => {
  return (
    <li className={"nav-item "+liClass}>
      <InertiaLink href={href} id={'link-'+href} className={"nav-link "+aClass}>
        <i className={"nav-icon "+iClass}></i>
        <p>
          {word}
        </p>
      </InertiaLink>
    </li>
  )
}

export default NavList;
