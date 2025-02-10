CREATE OR REPLACE VIEW position_av_marks
AS
SELECT EmpPosition, ROUND( AVG(AvSoftResult),2) AS AvSoftResult,
ROUND(AVG(AvHardResult),2) AS AvHardResult
FROM employee_av_marks
GROUP BY EmpPosition
ORDER BY EmpPosition;

CREATE OR REPLACE VIEW employee_av_marks
AS
SELECT 
    e.EmpId, 
    e.EmpSurname, 
    e.EmpName, 
    e.EmpPatronymic, 
    e.EmpPosition,
    ROUND(AVG(CASE WHEN tt.SoftTrue = true THEN r.TestResult END), 2) AS AvSoftResult,
    ROUND(AVG(CASE WHEN tt.SoftTrue = false THEN r.TestResult END), 2) AS AvHardResult
FROM 
    Employee e
LEFT JOIN 
    (
        SELECT 
            r.EmpID, 
            r.TypeTestId, 
            r.TestResult,
            r.Date
        FROM 
            Results r
        INNER JOIN 
            (
                SELECT 
                    EmpID, 
                    TypeTestId, 
                    MAX(Date) AS LastDate
                FROM 
                    Results
                GROUP BY 
                    EmpID, TypeTestId
            ) AS last_results 
        ON 
            r.EmpID = last_results.EmpID 
            AND r.TypeTestId = last_results.TypeTestId 
            AND r.Date = last_results.LastDate
    ) AS r ON e.EmpID = r.EmpID
LEFT JOIN 
    TypeTest tt ON r.TypeTestId = tt.TypeTestId
GROUP BY 
    e.EmpId, e.EmpSurname, e.EmpName, e.EmpPatronymic, e.EmpPosition
ORDER BY 
    e.EmpPosition, e.EmpSurname, e.EmpName, e.EmpPatronymic;


