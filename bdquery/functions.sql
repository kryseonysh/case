CREATE OR REPLACE FUNCTION get_last_test_results(emp_id INT)
RETURNS TABLE (
    TypeTestId INT,
    TypeTestName VARCHAR(60),
	SoftTrue boolean,
    TestDate TIMESTAMP,
    TestResult DECIMAL(3, 0)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tt.TypeTestId,
        tt.TypeTestComp,
		tt.SoftTrue,
        r.Date AS TestDate,
        r.TestResult
    FROM 
        Results r
    JOIN 
        TypeTest tt ON r.TypeTestId = tt.TypeTestId
    WHERE 
        r.EmpID = emp_id
        AND r.Date = (
            SELECT MAX(r2.Date)
            FROM Results r2
            WHERE r2.EmpID = emp_id AND r2.TypeTestId = r.TypeTestId
        )
	ORDER BY TypeTestId;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_last_test_results(4);
SELECT * FROM get_last_test_results(1);

CREATE OR REPLACE FUNCTION get_all_test_results(emp_id INT)
RETURNS TABLE (
    TypeTestName VARCHAR(60),
    TestDate TIMESTAMP,
    TestResult DECIMAL(3, 0)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tt.TypeTestName,
        r.Date AS TestDate,
        r.TestResult
    FROM 
        Results r
    JOIN 
        TypeTest tt ON r.TypeTestId = tt.TypeTestId
    WHERE 
        r.EmpID = emp_id
    ORDER BY 
        r.Date DESC; 
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_all_test_results (4);



CREATE OR REPLACE FUNCTION make_test(test INT)
RETURNS TABLE (
  TestID INT,
  Question TEXT,
  VarA TEXT,
  VarB TEXT,
  VarC TEXT,
  VarD TEXT,
  Answer Varchar(1)
) AS $$
BEGIN
    RETURN QUERY
  SELECT * FROM Question 
  WHERE Question.TypeTestID = test
  ORDER BY RANDOM() 
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM make_test(1);

SELECT now()::timestamp;


CREATE OR REPLACE FUNCTION recomendation(testid INT, result int)
RETURNS TABLE (
    Rec text
) AS $$
BEGIN
	IF result<50 THEN
		RETURN QUERY SELECT Recomendation1 FROM Recomendation r WHERE r.typetestid = testid; 
	END IF;

	IF (result>=50 AND result<80) THEN
		RETURN QUERY SELECT Recomendation2 FROM Recomendation r WHERE r.typetestid = testid; 
	END IF;

	IF (result>=80 AND result<=100) THEN
		RETURN QUERY SELECT Recomendation3 FROM Recomendation r WHERE r.typetestid = testid; 
	END IF;

END;
$$ LANGUAGE plpgsql;
SELECT * FROM recomendation(1, 50);
SELECT * FROM get_all_test_results (4);