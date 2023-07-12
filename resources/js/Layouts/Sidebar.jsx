import {Inertia} from "@inertiajs/inertia";
import NavList from "@/Components/NavList";
import NavTree from "@/Components/NavTree";
import {InertiaLink, usePage} from "@inertiajs/inertia-react";
import React from "react";


const activateLinks = (url) => {

  let element = document.getElementById('link-'+url)

  const activeMainLinks = __('.nav-link side-main-link active');
  const activeLinks = __('.nav-link side-link active');
  if (activeMainLinks.length>0) {
    const str = activeMainLinks[0].className;
    activeMainLinks[0].className = str.replace('active','');
  }
  if (activeLinks.length>0) {
    const str = activeLinks[0].className;
    activeLinks[0].className = str.replace('active','');
  }

  //activating clicked link and its parentNode link
  element.className += ' active';

  if (!element.className.includes('side-main-link'))
    element.closest('.has-treeview').querySelector(".side-main-link").className += ' active';
}

Inertia.on('navigate', (event) => {
  let url = event.detail.page.url.replace('/','');
  activateLinks(url);
})

const Sidebar = () => {
  const user = usePage().props.auth.user;
  const branch = usePage().props.auth.branch
  const b$_ = ""+branch.id;
  const user_role = user.manager==="Yes"?"manager":"attendant";
  const user_name = user.name;
  const branch_name = branch.name;

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src={"interface/admin/dist/img/avatar3.png"} className="img-circle elevation-2" alt="User Image" />
          </div>
          <div className="info">
            <span className="d-block" style={{color: "white"}}>{user_name}</span>
            <span className="d-block" style={{color: "white"}}>{branch_name} branch</span>
            <InertiaLink href={route('logout')} method="post" as="button" className="anchor-button" style={{color: "white"}}>
              <i className="fas fa-sign-out"></i>Log Out
            </InertiaLink>
          </div>
        </div>

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <NavList href="dashboard" aClass="side-main-link" iClass="fas fa-home" word="Dashboard" />

            <NavTree href="user_form" aClass="active" iClass="fas fa-pen-alt" word={<>Records<i className="right fas fa-angle-left"></i></>}>
              <ul className="nav nav-treeview">
                <NavList href="store-files" aClass="side-link active" iClass="fas fa-file-alt" word="Files"/>
                <NavList href="meters" aClass="side-link" iClass="fas fa-list-ol" word="Meters"/>
                <NavList href="dips" aClass="side-link" iClass="far fa-sort-amount-down-alt" word="Dips"/>
                <NavList href="sales" aClass="side-link" iClass="fas fa-sack-dollar" word="Sales"/>
                <NavList href="receivables" aClass="side-link" iClass="fas fa-hand-holding-usd" word="Receivables"/>
                <NavList href="transactions" aClass="side-link" iClass="fas fa-money-check-alt" word="Transactions"/>
                <NavList href="debts" aClass="side-link" iClass="fas fa-user-minus" word="Debts"/>
                <NavList href="prepaid" aClass="side-link" iClass="fas fa-user-plus" word="Prepaid"/>
                <NavList href="expenses" aClass="side-link" iClass="fas fa-money-bill" word="Expenses"/>
                <NavList href="inventory" aClass="side-link" iClass="fas fa-boxes" word="Inventory"/>
                <NavList href="summary" aClass="side-link" iClass="fas fa-signature" word="Summary"/>
                <NavList href="report" aClass="side-link" iClass="fas fa-file" word="Report"/>
              </ul>
            </NavTree>
            <NavTree href="registry" iClass="fas fa-file-signature" word={<>Registry<i className="right fas fa-angle-left"></i></>}>
              <ul className="nav nav-treeview">
                <NavList href="permissions-reg" aClass="side-link" iClass="fas fa-key" word="Permissions"/>
                <NavList href="dispensing-reg" aClass="side-link" iClass="fas fa-gas-pump" word="Gas Details"/>
                <NavList href="products-reg" aClass="side-link" iClass="fas fa-cubes" word="Products"/>
                <NavList href="suppliers-customers-reg" aClass="side-link" iClass="fas fa-users" word="Suppliers & Customers"/>
                <NavList href="expense-reg" aClass="side-link" iClass="fas fa-money-bill" word="Expense Types"/>
                <NavList href="receivable-reg" aClass="side-link" iClass="fas fa-money-bill-wave" word="Receivable Types"/>
                <NavList href="transaction-reg" aClass="side-link" iClass="fas fa-money-check" word="Transaction Types"/>
              </ul>
            </NavTree>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
