import axios from "axios";
import { useEffect, useState } from "react";
import ExportExcel from "./Report/ExportExcel";
import RangeSelector from "./Report/RangeSelector";
import { Spinner, Dropdown, Col } from "react-bootstrap";
import { useStore } from "../App";

const Report = () => {
  let [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [months, setMonths] = useState([]);
  const [range, setRange] = useState(1);
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
  const url = process.env.REACT_APP_HTTP;
  const { HTTP } = useStore();

  const getReportData = async () => {
    if (selectedUnit?.StructureUnitID == null || selectedMonth.monthID == null)
      return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${url}/report/?StructureUnitID=${selectedUnit.StructureUnitID}&StructureUnitName=${selectedUnit.StructureUnitName}&startDate=${selectedMonth.startDate}&endDate=${selectedMonth.endDate}`
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
  }, [selectedUnit.StructureUnitID, selectedMonth.monthID]);

  let dayRange = Array.from({ length: 31 }, (_, i) => i + 1).slice(
    range === 1 ? 0 : range === 2 ? 10 : range === 3 ? 20 : 30,
    range === 1 ? 10 : range === 2 ? 20 : range === 3 ? 30 : 31
  );

  console.log(reportData);

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

  const getMonth = async () => {
    await axios
      .get(`${HTTP}/getMonths`)
      .then((res) => {
        if (res.status == 200) {
          setMonths(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  console.log(selectedUnit);

  useEffect(() => {
    getStructureUnit();
    getMonth();
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
                <td colSpan={16} className="text-left  text-small py-1 pl-1">
                  01/02/2024
                </td>
              </tr>
              <tr className=" background-table fw-bold text-white ">
                <td colSpan={3} className="text-center py-1">
                  საანგარიშო პერიოდი
                </td>
                <td colSpan={16} className="text-left  text-small py-1 pl-1">
                  {`${reportData.StartDate}-${reportData.EndDate}`}
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
              {reportData.Holders.map((holder, index) => {
                let dayRange = holder.WorkingInformation.FullDays?.slice(
                  range === 1 ? 0 : range === 2 ? 10 : range === 3 ? 20 : 30,
                  range === 1 ? 10 : range === 2 ? 20 : range === 3 ? 30 : 31
                );

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
                    {dayRange?.map((day, index) => (
                      <td
                        key={index}
                        className="text-small small_size lighter-secondary py-1"
                      >
                        {day.WorkingHours}
                      </td>
                    ))}
                    {[...Array(Math.abs(10 - dayRange?.length))].map(
                      (_, index) =>
                        dayRange?.length !== 10 ? (
                          <td
                            key={index}
                            className="text-small small_size lighter-secondary py-1"
                          ></td>
                        ) : null
                    )}
                    <td className="text-small small_size lighter-secondary py-1">
                      {holder.WorkingInformation.WorkingDaysSUM}
                    </td>
                    <td className="text-small small_size lighter-secondary py-1">
                      {holder.WorkingInformation.WorkingHoursSum}
                    </td>
                    <td className="text-small small_size lighter-secondary py-1">
                      {holder.WorkingInformation.OverTime}
                    </td>
                    <td className="text-small small_size lighter-secondary py-1"></td>
                    <td className="text-small small_size lighter-secondary py-1">
                      {holder.WorkingInformation.WorkInHolidaysHours}
                    </td>
                    <td className="text-small small_size lighter-secondary py-1"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
