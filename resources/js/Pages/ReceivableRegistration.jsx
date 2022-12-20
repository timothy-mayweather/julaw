import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";
import CommonRegistration from "@/Shared/CommonRegistration";

const ReceivableTypes = () =>
  <CommonRegistration url='/receivable-type' dataName='receivableTypes' bUrl='/branch-receivable-type' context='ReceivableType' bContext='BranchReceivableType' btnText='View Or Edit Branch Receivable Types' documentTitle='Receivable Types' bDocumentTitle='Branch Receivable Types' />;

const heading = "RECEIVABLE TYPES";
ReceivableTypes.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)

export default ReceivableTypes;
