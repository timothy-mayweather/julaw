import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";
import CommonRegistration from "@/Shared/CommonRegistration";

const ExpenseTypes = () =>
  <CommonRegistration url='/expense-type' dataName='expenseTypes' bUrl='/branch-expense-type' context='ExpenseType' bContext='BranchExpenseType' btnText='View Or Edit Branch Expense Types' documentTitle='Expense Types' bDocumentTitle='Branch Expense Types' />;

const heading = "EXPENSE TYPES";
ExpenseTypes.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)

export default ExpenseTypes;
