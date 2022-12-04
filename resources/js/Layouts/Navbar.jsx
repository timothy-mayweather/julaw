import DateInput from "@/Components/FormComponents/DateInput";

const Navbar = ({info}) => {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="@/layouts/Navbar#" role="button"><i className="fas fa-bars"></i></a>
        </li>
      </ul>
      <form className="form-inline ml-3" id="user-nav-form">
        <div className="input-group input-group-sm">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="far fa-calendar-alt"></i>
            </span>
          </div>
          <DateInput id="datepicker" value={info.date} handleChange={info.setDate}/>
          <div className="input-group-prepend shift-field" hidden>
        <span className="input-group-text bg-gradient-white border-transparent">
          Shift:
        </span>
          </div>
          <input className="form-control form-control-navbar col-2 shift-field" type="number"  name="shift" id="shift" title="choose shift" style={{fontWeight: "bold", cursor: "pointer", color: "green", border: "1px solid #ced4da"}} required hidden />
        </div>
      </form>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" data-widget="control-sidebar" data-slide="true" href="@/layouts/Navbar#" role="button">
            <i className="fas fa-th-large"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
