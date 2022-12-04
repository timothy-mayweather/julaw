import React, {useState} from 'react';

const NavTree = ({liClass="", href, aClass, iClass, word, children=null}) => {
  const [listClass, setListClass] = useState(liClass);
  const onClick = () =>{
    event.preventDefault();
    listClass !== "menu-open"? setListClass("menu-open"): setListClass("")
  }

  return (
    <li className={"nav-item has-treeview "+listClass}>
      <a href={href} className={"nav-link side-main-link "+aClass} onClick={onClick}>
        <i className={"nav-icon "+iClass}></i>
        <p>
          {word}
        </p>
      </a>
      {children}
    </li>
  )
}

export default NavTree;
