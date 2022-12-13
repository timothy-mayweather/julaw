import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";
import Supplier from "./Supplier";
import Customer from "./Customer";
import Employee from "./Employee";
import EmployeeRole from "@/Pages/SuppliersCustomers/EmployeeRole";


const SuppliersCustomers = () => {

  return (
    <>
      <Supplier />
      <Customer />
      <EmployeeRole />
      <Employee />
    </>
  );
};

const heading = "SUPPLIERS & CUSTOMERS";
SuppliersCustomers.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)

export default SuppliersCustomers;
