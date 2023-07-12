import Navbar from "@/Layouts/Navbar";
import Sidebar from "@/Layouts/Sidebar";
import Footer from "@/Layouts/Footer";
import {Head} from "@inertiajs/inertia-react";
import {useState} from "react";


export default function Main({title, children}) {
  useState(title);
  const [dataDate, setDataDate] = useState(getToday);
  window.axios.defaults['data'] = {...window.axios.defaults['data'], ['data_date']:changeDate(dataDate)}

  return (
    <>
      <Head title={title}/>
      <div className="wrapper">
        <Navbar info={{ date:dataDate, setDate:(date)=>{setDataDate(date)} }}/>
        <Sidebar />
        <div className="content-wrapper">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}
