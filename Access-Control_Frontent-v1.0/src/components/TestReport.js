import axios from "axios";
import { useEffect, useState } from "react";
import ExportExcel from "./Report/ExportExcel";
import RangeSelector from "./Report/RangeSelector";

const TestReport = () => {
  let [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(1);
  const url = process.env.REACT_APP_HTTP;

  const getReportData = async () => {
    setLoading(true);
    await axios
      .get(`${url}/report`)
      .then((res) => {
        if (res.status === 200) {
          setReportData(res.data);
          console.log(res.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getReportData();
  }, []);

  let dayRange = Array.from({ length: 31 }, (_, i) => i + 1).slice(
    range === 1 ? 0 : range === 2 ? 10 : range === 3 ? 20 : 30,
    range === 1 ? 10 : range === 2 ? 20 : range === 3 ? 30 : 31
  );

  if (loading) return <div>Loading</div>;

  return (
    <div>
      <div className="d-flex gap-3 justify-content-center my-2">
        <ExportExcel reportData={reportData} />
        <RangeSelector setRange={setRange} />
      </div>
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
                <td rowSpan={4} key={index} className="text-small text-center">
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
                  {[...Array(Math.abs(10 - dayRange?.length))].map((_, index) =>
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
              <td className="p-2">დეკრეტული შვებულება - ანაზღაურების გარეშე</td>
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
    </div>
  );
};

export default TestReport;
