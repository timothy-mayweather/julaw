import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";
import ProductType from "./ProductType";
import Product from "./Product";

const RegisterProducts = () => {
  return (
    <>
      <ProductType />
      <Product />
    </>
  );
};

const heading = "PRODUCTS";
RegisterProducts.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)
export default RegisterProducts;
