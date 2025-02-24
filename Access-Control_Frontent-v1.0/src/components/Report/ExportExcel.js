import XLSX from "xlsx-js-style";
import userData from "./../../data.json";
import { Button } from "react-bootstrap";
import { RiFileExcelLine } from "react-icons/ri";

const ExportExcel = ({ reportData }) => {
  const handleExport = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
      { s: { r: 0, c: 3 }, e: { r: 0, c: 39 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
      { s: { r: 1, c: 3 }, e: { r: 1, c: 39 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
      { s: { r: 2, c: 3 }, e: { r: 2, c: 39 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },
      { s: { r: 3, c: 3 }, e: { r: 3, c: 39 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } },
      { s: { r: 4, c: 3 }, e: { r: 4, c: 4 } },
      { s: { r: 4, c: 5 }, e: { r: 4, c: 39 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 2 } },
      { s: { r: 5, c: 3 }, e: { r: 5, c: 4 } },
      { s: { r: 5, c: 5 }, e: { r: 5, c: 39 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 39 } },
      { s: { r: 7, c: 0 }, e: { r: 12, c: 0 } },
      { s: { r: 7, c: 1 }, e: { r: 12, c: 1 } },
      { s: { r: 7, c: 2 }, e: { r: 12, c: 2 } },
      { s: { r: 7, c: 3 }, e: { r: 7, c: 33 } },
      { s: { r: 7, c: 34 }, e: { r: 7, c: 39 } },
      { s: { r: 8, c: 34 }, e: { r: 12, c: 34 } },
      { s: { r: 8, c: 35 }, e: { r: 8, c: 39 } },
      { s: { r: 9, c: 35 }, e: { r: 12, c: 35 } },
      { s: { r: 9, c: 36 }, e: { r: 9, c: 39 } },
      { s: { r: 10, c: 36 }, e: { r: 12, c: 36 } },
      { s: { r: 10, c: 37 }, e: { r: 12, c: 37 } },
      { s: { r: 10, c: 38 }, e: { r: 12, c: 38 } },
      { s: { r: 10, c: 39 }, e: { r: 12, c: 39 } },
      { s: { r: 13, c: 3 }, e: { r: 13, c: 33 } },
      {
        s: { r: 16 + reportData.Holders.length, c: 0 },
        e: { r: 17 + reportData.Holders.length, c: 2 },
      },
      {
        s: { r: 16 + reportData.Holders.length, c: 3 },
        e: { r: 16 + reportData.Holders.length, c: 6 },
      },
      {
        s: { r: 17 + reportData.Holders.length, c: 3 },
        e: { r: 17 + reportData.Holders.length, c: 6 },
      },
      {
        s: { r: 16 + reportData.Holders.length, c: 8 },
        e: { r: 16 + reportData.Holders.length, c: 9 },
      },
      {
        s: { r: 17 + reportData.Holders.length, c: 8 },
        e: { r: 17 + reportData.Holders.length, c: 9 },
      },
      {
        s: { r: 19 + reportData.Holders.length, c: 0 },
        e: { r: 20 + reportData.Holders.length, c: 2 },
      },
      {
        s: { r: 19 + reportData.Holders.length, c: 3 },
        e: { r: 19 + reportData.Holders.length, c: 6 },
      },
      {
        s: { r: 20 + reportData.Holders.length, c: 3 },
        e: { r: 20 + reportData.Holders.length, c: 6 },
      },
      {
        s: { r: 19 + reportData.Holders.length, c: 8 },
        e: { r: 19 + reportData.Holders.length, c: 9 },
      },
      {
        s: { r: 20 + reportData.Holders.length, c: 8 },
        e: { r: 20 + reportData.Holders.length, c: 9 },
      },
      {
        s: { r: 23 + reportData.Holders.length, c: 0 },
        e: { r: 23 + reportData.Holders.length, c: 1 },
      },
    ];

    for (let col = 3; col <= 33; col++) {
      merges.push({ s: { r: 8, c: col }, e: { r: 12, c: col } });
    }

    const baseData = [
      ["", "", "", "სამუშაო დროის აღრიცხვის ფორმა", ...Array(36).fill(null)],
      [
        "ორგანიზაციის დასახელება",
        "",
        "",
        `${reportData.organisationName}`,
        ...Array(36).fill(null),
      ],
      [
        "საიდენტიფიკაციო კოდი",
        "",
        "",
        `${reportData.identificationNumber}`,
        ...Array(36).fill(null),
      ],
      [
        "სტრუქტურული ერთეული",
        "",
        "",
        `${reportData.StructureUnitName}`,
        ...Array(36).fill(null),
      ],
      [
        "შედგენის თარიღი",
        "",
        "",
        `${new Date().toJSON().slice(0, 10)}`,
        ...Array(36).fill(null),
      ],
      [
        "საანგარიშო პერიოდი",
        "",
        "",
        `${reportData.StartDate.toString()} - ${reportData.EndDate.toString()}`,
        ...Array(36).fill(null),
      ],
      [...Array(39).fill(null)],
      [
        "სახელი, გვარი",
        "პირადი ნომერი/ტაბელის ნომერი",
        "თანამდებობა  (სპეციალობა, პროფესია)",
        "აღნიშვნები სამუშაოზე გამოცხადების/არგამოცხადების შესახებ თარიღების მიხედვით თვის განმავლობაში",
        ...Array(30).fill(null),
        "სულ ნამუშევარი თვის განმავლობაში",
        ...Array(5).fill(null),
      ],
      [
        ...Array(3).fill(null),
        ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
        "დღე",
        "საათი",
        ...Array(4).fill(null),
      ],
      [...Array(35).fill(null), "ჯამი", "მათ შორის", ...Array(3).fill(null)],
      [
        ...Array(36).fill(null),
        "ზეგანაკვეთური",
        "ღამე",
        "დასვენება/ უქმე დღეებში ნამუშევარი საათების ჯამური რაოდენობა (თვე) ",
        "სხვა (საჭიროების შემთხვევაში)",
      ],
      [...Array(39).fill(null)],
      [...Array(39).fill(null)],
      [
        ...["1", "2", "3", "4"],
        ...Array(30).fill(null),
        ...["5", "6", "7", "8", "9", "10"],
      ],
    ];

    for (let holder of reportData.Holders) {
      const userRow = [
        holder.FullName,
        holder.PersonalNumber,
        holder.Position,
        ...holder.WorkingInformation.FullDays.map(
          (day) => `${day.WorkingHours} `
        ),
        [
          ...Array(Math.abs(31 - holder.WorkingInformation.FullDays.length)),
        ].map((_, index) => ""),
        holder.WorkingInformation.WorkingDaysSUM,
        holder.WorkingInformation.WorkingHoursSum,
        holder.WorkingInformation.OverTime,
        " ",
        holder.WorkingInformation.WorkInHolidaysHours,
        " ",
      ];
      baseData.push(userRow);
    }

    const additionalData = [
      [],
      [],
      ["ორგანიზაციის/სტრუქტურული ქვედანაყოფის ხელმძღვანელი"],
      ["", "", "", "გვარი, სახელი", "", "", "", "", "ხელმოწერა"],
      [],
      ["ორგანიზაციის/სტრუქტურული ქვედანაყოფის ხელმძღვანელი"],
      ["", "", "", "გვარი, სახელი", "", "", "", "", "ხელმოწერა"],
      [],
      [],
      ["პირობითი აღნიშვნები"],
      ["დ", "დასვენება / უქმე დღეები"],
      ["ა/შ", "ანაზღაურებადი შვებულება"],
      ["უ/შ", "ანაზღაურების გარეშე შვებულება"],
      ["დ/შ-ა", "დეკრეტული შვებულება - ანაზღაურებადი"],
      ["დ/შ-უ", "დეკრეტული შვებულება - ანაზღაურების გარეშე"],
      ["ს/ფ", "საავადმყოფო ფურცელი"],
      ["გ", "გაცდენა"],
    ];

    // Combine baseData with additionalData
    const data = [...baseData, ...additionalData];

    // Add the data to the worksheet first
    XLSX.utils.sheet_add_aoa(worksheet, data);

    // Apply merges to the worksheet
    worksheet["!merges"] = merges;

    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      ...Array(31).fill({ wch: 10 }),
      ...Array(6).fill({ wch: 12 }),
    ];

    // Get size of sheet
    const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "");
    const rowCount = range.e.r;
    const columnCount = range.e.c;

    // Add formatting by looping through data in sheet
    for (let row = 0; row <= rowCount; row++) {
      for (let col = 0; col <= columnCount; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });

        // Check if the cell exists before applying styles
        if (!worksheet[cellRef]) {
          worksheet[cellRef] = { v: "" };
        }

        // Add this format to every cell
        worksheet[cellRef].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          font: {
            sz: 10,
          },
        };

        // Helper function to check if a cell meets the condition
        const isCellInBorderRange = (col, row, userDataLength) => {
          return (
            (col <= 39 && row <= 14 + userDataLength) ||
            (col <= 6 &&
              row >= 16 + userDataLength &&
              row <= 17 + userDataLength) ||
            (col <= 6 &&
              row >= 19 + userDataLength &&
              row <= 20 + userDataLength) ||
            (col >= 8 &&
              col <= 9 &&
              row >= 16 + userDataLength &&
              row <= 17 + userDataLength) ||
            (col >= 8 &&
              col <= 9 &&
              row >= 19 + userDataLength &&
              row <= 20 + userDataLength) ||
            (col <= 1 &&
              row >= 23 + userDataLength &&
              row <= 32 + userDataLength)
          );
        };

        // Applying border if cell is in range
        if (isCellInBorderRange(col, row, reportData.Holders.length)) {
          worksheet[cellRef].s = {
            ...worksheet[cellRef].s,
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }

        if (
          (col <= 39 && row <= 12) ||
          (col <= 1 &&
            row >= 15 + reportData.Holders.length &&
            row <= 16 + reportData.Holders.length) ||
          (col <= 1 &&
            row >= 18 + reportData.Holders.length &&
            row <= 19 + reportData.Holders.length)
        ) {
          worksheet[cellRef].s = {
            ...worksheet[cellRef].s,
            font: {
              bold: true,
            },
          };
        }
      }
    }

    // Create the workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "სამუშაო აღრიცხვის ფორმა"
    );

    // Export the file
    XLSX.writeFile(workbook, "სამუშაო აღრიცხვის ფორმა.xlsx");
  };

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      className="d-flex align-items-center gap-2 justify-content-center"
    >
      <RiFileExcelLine />
      <span>ექსელის ჩამოტვირთვა</span>
    </Button>
  );
};

export default ExportExcel;
