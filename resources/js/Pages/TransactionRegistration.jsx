import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";
import CommonRegistration from "@/Shared/CommonRegistration";

const TransactionTypes = () =>
  <CommonRegistration url='/transaction-type' dataName='transactionTypes' bUrl='/branch-transaction-type' context='TransactionType' bContext='BranchTransactionType' btnText='View Or Edit Branch Transaction Types' documentTitle='Transaction Types' bDocumentTitle='Branch Transaction Types' />

const heading = "TRANSACTION TYPES";
TransactionTypes.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)

export default TransactionTypes;
