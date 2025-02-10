const getEmployee = "SELECT * FROM Employee";
const getEmployeeById = "SELECT * FROM Employee WHERE EmpId = $1";
const addEmployee = "INSERT INTO Employee (EmpSurname, EmpName, EmpPatronymic, EmpPosition, EmpMail, EmpPassword) VALUES ($1, $2, $3, $4, $5, $6)";
const addTest = "INSERT INTO TypeTest (TypeTestName, TypeTestComp, TypeTestDesc, SoftTrue, Position) VALUES ($1, $2, $3, $4, $5)";
const addTest2 = "INSERT INTO TypeTest (TypeTestName, TypeTestComp, TypeTestDesc, SoftTrue) VALUES ($1, $2, $3, $4)";
const addQuestion = "INSERT INTO Question (TypeTestId, Question, VarA, VarB, VarC,VarD, Answer) VALUES ($1, $2, $3, $4, $5, $6, $7)";
const addFeedback = "INSERT INTO FeedbackFromRec (EmpId, Date, Comment, Grade) VALUES ($1, now()::timestamp, $2, $3)";
const updateEmployee = "UPDATE Employee SET EmpSurname = $1 WHERE EmployeeId = $2";
const removeEmployee = "DELETE FROM Employee WHERE EmpId = $1";
const get_test_info = "SELECT TypeTestID, TypeTestName, TypeTestDesc, Position FROM TypeTest WHERE Position = ($1) OR SoftTrue";
const get_test_info_by_id = "SELECT TypeTestName, TypeTestDesc FROM TypeTest WHERE TypeTestID = $1";
const insert_result = "INSERT INTO Results (TypeTestId, EmpID, Date, TestResult) VALUES ($1, $2, now()::timestamp, $3)";
const get_interview = "SELECT HrId, Date, Comment FROM Interview WHERE EmpId= $1";
const insert_interview = "INSERT INTO Interview (EmpId, HrId, Date, Comment) VALUES ($1, $2, current_date, $3)";

//VIEW
const employee_av_marks = "SELECT * FROM employee_av_marks";
const position_av_marks = "SELECT * FROM position_av_marks";

//FUNCTION
const checkMailEmployee = "SELECT c FROM Employee c WHERE c.EmpMail = $1";
const get_all_test_results = "SELECT * FROM get_all_test_results ($1)";
const get_last_test_results = "SELECT * FROM get_last_test_results ($1);";
const make_test = "SELECT * FROM make_test ($1)";
const recomendation = "SELECT * FROM recomendation($1, $2)";

module.exports = {
    getEmployee,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    removeEmployee,
    get_test_info,
    employee_av_marks,
    position_av_marks,
    checkMailEmployee,
    get_all_test_results,
    get_last_test_results,
    make_test,
    get_test_info_by_id,
    insert_result,
    recomendation,
    addTest,
    addQuestion,
    addTest2,
    addFeedback,
    get_interview,
    insert_interview
};

