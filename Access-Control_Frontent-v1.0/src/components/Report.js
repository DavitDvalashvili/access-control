import axios from "axios";
import { useEffect, useState } from "react";
import ExportExcel from "./Report/ExportExcel";
import RangeSelector from "./Report/RangeSelector";
import { Spinner, Dropdown, Col } from "react-bootstrap";
import { useStore } from "../App";

let years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

const Report = () => {
  let [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState(getMonths(selectedYear));
  const [range, setRange] = useState(2);
  const [structureUnits, setStructureUnits] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState({
    StructureUnitID: null,
    StructureUnitName: "",
  });
  const [selectedMonth, setSelectedMonth] = useState({
    monthID: null,
    monthName: "",
    startDate: "",
    endDate: "",
  });
  const { HTTP } = useStore();

  const getReportData = async () => {
    if (selectedUnit?.StructureUnitID == null || selectedMonth.monthID == null)
      return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${HTTP}/report/?StructureUnitID=${selectedUnit.StructureUnitID}&StructureUnitName=${selectedUnit.StructureUnitName}&startDate=${selectedMonth.startDate}&endDate=${selectedMonth.endDate}`
      );

      if (res.status === 200) {
        setReportData(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReportData();
  }, [selectedUnit.StructureUnitID, selectedMonth]);

  let dayRange = Array.from({ length: 31 }, (_, i) => i + 1).slice(
    range === 1 ? 0 : range === 2 ? 10 : range === 3 ? 20 : 30,
    range === 1 ? 10 : range === 2 ? 20 : range === 3 ? 30 : 31
  );

  const getStructureUnit = async () => {
    await axios
      .get(`${HTTP}/getStructureUnit`)
      .then((res) => {
        if (res.status == 200) {
          setStructureUnits(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setMonths(getMonths(selectedYear));
  }, [selectedYear]);

  const handleSelectUnit = (eventKey) => {
    setSelectedUnit({
      ...selectedUnit,
      StructureUnitID: eventKey,
      StructureUnitName:
        structureUnits.find((unit) => unit.StructureUnitID == eventKey)
          ?.StructureUnitName || "",
    });
  };

  const handleMonth = (eventKey) => {
    setSelectedMonth({
      ...selectedMonth,
      monthID: eventKey,
      monthName:
        months.find((month) => month.monthID == eventKey)?.monthName || "",
      startDate: months.find((month) => month.monthID == eventKey)?.startDate,
      endDate: months.find((month) => month.monthID == eventKey)?.endDate,
    });
  };

  const handleYear = (eventKey) => {
    setSelectedYear(years[eventKey]);
  };

  useEffect(() => {
    getStructureUnit();
  }, []);

  return (
    <Col className="bpg-arial">
      <Col>
        <Col className="d-flex gap-3 justify-content-center my-2 mx-auto ">
          {reportData && <ExportExcel reportData={reportData} />}
          {reportData && <RangeSelector setRange={setRange} />}
          <Dropdown
            title="სტრუქტურული ერთეული"
            onSelect={handleSelectUnit}
            style={{ width: "300px" }}
          >
            <Dropdown.Toggle variant="secondary" className="w-100">
              {selectedUnit.StructureUnitID
                ? selectedUnit.StructureUnitName
                : "სტრუქტურული ერთეული"}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              {structureUnits.map((structureUnit) => (
                <Dropdown.Item
                  eventKey={structureUnit.StructureUnitID}
                  key={structureUnit.StructureUnitID}
                >
                  {structureUnit.StructureUnitName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            title="თვე"
            onSelect={handleMonth}
            style={{ width: "300px" }}
          >
            <Dropdown.Toggle variant="secondary" className="w-100">
              {selectedMonth.monthID ? selectedMonth.monthName : "აირჩიე თვე"}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              {months.map((month) => (
                <Dropdown.Item eventKey={month.monthID} key={month.monthID}>
                  {month.monthName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            title="წელი"
            onSelect={handleYear}
            style={{ width: "150px" }}
          >
            <Dropdown.Toggle variant="secondary" className="w-100">
              {selectedYear ? selectedYear : "აირჩიე წელი"}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              {years.map((year, index) => (
                <Dropdown.Item eventKey={index} key={index}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Col>

      {reportData == null && !loading && (
        <Col className="mt-3 text-center fw-bold" style={{ fontSize: "18px" }}>
          გთხოვთ აირჩიეთ სტრუქტურული ერთეილი და თვე
        </Col>
      )}
      {loading && (
        <Col className="mt-3 text-center fw-bold">
          <Spinner
            className="mx-auto mt-3"
            animation="border"
            variant="primary"
          />
        </Col>
      )}
      {reportData && !loading && (
        <div className="px-5 mx-0 ">
          <table
            className="col-12"
            style={{
              border: "1px solid black",
            }}
          >
            <tbody>
              <tr className="text-center">
                <td
                  colSpan={19}
                  className="background-table fw-bold text-white py-1"
                >
                  სამუშაო დროის აღრიცხვა
                </td>
              </tr>
              <tr className="text-center background-table fw-bold text-white ">
                <td colSpan={3} className=" py-1"></td>
                <td colSpan={16} className=" py-1">
                  {reportData.organisationName}
                </td>
              </tr>
              <tr className="text-center background-table fw-bold text-white">
                <td colSpan={3} className=" py-1">
                  საიდენტიფიკაციო კოდი
                </td>
                <td colSpan={16} className=" py-1">
                  {reportData.identificationNumber}
                </td>
              </tr>
              <tr className="text-center background-table fw-bold text-white">
                <td colSpan={3} className=" py-1">
                  სტრუქტურული ერთეული
                </td>
                <td colSpan={16} className=" py-1">
                  {reportData.StructureUnitName}
                </td>
              </tr>
              <tr className=" background-table fw-bold text-white">
                <td colSpan={3} className="text-center py-1">
                  შედგენის თარიღი
                </td>
                <td
                  colSpan={16}
                  className="text-left  text-small px-1 py-1 pl-1"
                >
                  {new Date().toISOString().split("T")[0]}
                </td>
              </tr>
              <tr className=" background-table fw-bold text-white ">
                <td colSpan={3} className="text-center py-1">
                  საანგარიშო პერიოდი
                </td>
                <td
                  colSpan={16}
                  className="text-left  text-small px-1 py-1 pl-1"
                >
                  {`${reportData.StartDate} / ${reportData.EndDate}`}
                </td>
              </tr>
              <tr className="text-center background-table text-white">
                <td rowSpan={5} className="col-1 text-small ">
                  გვარი, სახელი
                </td>
                <td rowSpan={5} className="col-1 text-small ">
                  პირადი ნომერი/ტაბელის ნომერი
                </td>
                <td rowSpan={5} className="col-1 text-small ">
                  თანამდებობა (სპეციალობა, პროფესია)
                </td>
                <td colSpan={10} className="text-small ">
                  აღნიშვნები სამუშაოზე გამოცხადების/არგამოცხადების შესახებ
                  თარიღების მიხედვით თვის განმავლობაში
                </td>
                <td colSpan={6} className="col-2 text-small ">
                  სულ ნამუშევარი თვის განმავლობაში
                </td>
              </tr>
              <tr className="background-table text-white">
                {dayRange.map((day, index) => (
                  <td
                    rowSpan={4}
                    key={index}
                    className="text-small text-center"
                  >
                    {day}
                  </td>
                ))}
                {[...Array(Math.abs(10 - dayRange.length))].map((_, index) =>
                  dayRange.length !== 10 ? (
                    <td
                      rowSpan={4}
                      key={index}
                      className="text-small text-center"
                    ></td>
                  ) : null
                )}
              </tr>
              <tr className="text-center background-table text-white">
                <td rowSpan={3} className="text-small">
                  დღე
                </td>
                <td colSpan={5} className="text-small">
                  საათი
                </td>
              </tr>
              <tr className="text-center background-table text-white">
                <td rowSpan={2} className="text-small">
                  ჯამი
                </td>
                <td colSpan={4} className="text-small">
                  მათ შორის
                </td>
              </tr>
              <tr className="text-center background-table text-white">
                <td className="text-small">ზეგანა კვეთური</td>
                <td className="text-small">ღამე</td>
                <td className="text-small">
                  დასვენების დღეებში ნამუშევარი საათების რაოდენობა
                </td>
                <td className="text-small">სხვა (საჭიროების შემთხვევაში)</td>
              </tr>
              {reportData.Holders &&
                reportData.Holders.map((holder, index) => {
                  let dayRange = (() => {
                    const daysArray = Array(10).fill("");
                    const rangeStart =
                      range == 1 ? 1 : range == 2 ? 11 : range == 3 ? 21 : 31;
                    const rangeEnd = rangeStart + 9;

                    holder.WorkingInformation.FullDays?.forEach((day) => {
                      if (day.Day >= rangeStart && day.Day <= rangeEnd) {
                        daysArray[day.Day - rangeStart] = day.WorkingHours
                          ? `${day.WorkingHours} `
                          : "";
                      }
                    });
                    return daysArray;
                  })();
                  return (
                    <tr key={index} className="text-center   ">
                      <td className="text-small small_size lighter-secondary py-1">
                        {holder.FullName}
                      </td>
                      <td className="text-small small_size lighter-secondary py-1">
                        {holder.PersonalNumber}
                      </td>
                      <td className="text-small small_size lighter-secondary py-1">
                        {holder.Position}
                      </td>
                      {dayRange?.map((hours, index) => (
                        <td
                          key={index}
                          className="text-small small_size lighter-secondary py-1"
                        >
                          {hours}
                        </td>
                      ))}
                      <td className="text-small small_size lighter-secondary py-1">
                        {holder.WorkingInformation.WorkingDaysSUM}
                      </td>
                      <td className="text-small small_size lighter-secondary py-1">
                        {holder.WorkingInformation.WorkingHoursSum
                          ? holder.WorkingInformation.WorkingHoursSum.toFixed(2)
                          : ""}
                      </td>
                      <td className="text-small small_size lighter-secondary py-1">
                        {holder.WorkingInformation.OverTime
                          ? holder.WorkingInformation.OverTime.toFixed(2)
                          : ""}
                      </td>
                      <td className="text-small small_size lighter-secondary py-1"></td>
                      <td className="text-small small_size lighter-secondary py-1">
                        {holder.WorkingInformation.WorkInHolidaysHours
                          ? holder.WorkingInformation.WorkInHolidaysHours.toFixed(
                              2
                            )
                          : ""}
                      </td>
                      <td className="text-small small_size lighter-secondary py-1"></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!reportData.Holders && (
            <Col className="text-center mt-2 ">
              სტრუქტურულ ერთეულში თანამშრომლები არ არის რეგისტრირებული
            </Col>
          )}
          <table className="my-5">
            <tbody className="text-small">
              <tr>
                <td
                  colSpan={2}
                  className="text-center background-table fw-bold p-2 text-white"
                >
                  პირობითი აღნიშვნები
                </td>
              </tr>
              <tr className="text-center lighter-secondary">
                <td className="p-2">დ</td>
                <td className="p-2">დასვენება / უქმე დღეები</td>
              </tr>
              <tr className="text-center lighter-secondary">
                <td className="p-2">ა/შ</td>
                <td className="p-2">ანაზღაურებადი შვებულება</td>
              </tr>
              <tr className="text-center lighter-secondary">
                <td className="p-2">დ/შ-ა</td>
                <td className="p-2">ადეკრეტული შვებულება - ანაზღაურებადი</td>
              </tr>
              <tr className="text-center lighter-secondary">
                <td className="p-2">დ/შ-უ</td>
                <td className="p-2">
                  დეკრეტული შვებულება - ანაზღაურების გარეშე
                </td>
              </tr>
              <tr className="text-center lighter-secondary">
                <td className="p-2">ს/ფ</td>
                <td className="p-2">საავადმყოფო ფურცელი</td>
              </tr>
              <tr className="text-center lighter-secondary">
                <td className="p-2">გ</td>
                <td className="p-2">გაცდენა</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Col>
  );
};

export default Report;

const getMonths = (year) => {
  const months = [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი",
  ];

  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

  return months.map((monthName, index) => {
    const monthID = index + 1;
    const startDate = `${year}-${monthID.toString().padStart(2, "0")}-01`;
    const endDate = `${year}-${monthID
      .toString()
      .padStart(2, "0")}-${daysInMonth(monthID, year)}`;

    return { monthID, monthName, startDate, endDate };
  });
};
