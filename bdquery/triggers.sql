CREATE OR REPLACE FUNCTION position_id()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT PositionId from Position where lower(PositionName) = lower(NEW.EmpPosition)) is null THEN
        RAISE EXCEPTION 'Должности с названием EmpPosition % нет в базе', NEW.EmpPosition;
    END IF;
	NEW.PositionId = (SELECT PositionId from Position where lower(PositionName) = lower(NEW.EmpPosition));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_position_id
BEFORE INSERT OR UPDATE ON Employee
FOR EACH ROW
EXECUTE FUNCTION position_id();

CREATE OR REPLACE FUNCTION check_hr_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Проверяем, является ли работник HR
    IF (SELECT EmpPosition from Employee where Employee.EmpId = New.HRID)!= 'HR' THEN
        RAISE EXCEPTION 'Работник с HRID % не является HR', NEW.HRID;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_hr_before_insert
BEFORE INSERT OR UPDATE ON Interview
FOR EACH ROW
EXECUTE FUNCTION check_hr_status();