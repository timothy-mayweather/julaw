import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";
import FuelProduct from "@/Pages/Dispensing/FuelProduct";
import Tank from "@/Pages/Dispensing/Tank";
import Pump from "@/Pages/Dispensing/Pump";
import Nozzle from "@/Pages/Dispensing/Nozzle";

const Dispensing = () => {
  return (
    <>
      <FuelProduct/>
      <Tank />
      <Pump />
      <Nozzle />
    </>
  );
};

const heading = "GAS DETAILS";
Dispensing.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)
export default Dispensing;
