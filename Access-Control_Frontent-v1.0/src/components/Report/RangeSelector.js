import { Dropdown } from "react-bootstrap";
import { useState } from "react";

let range = [
  { key: 1, name: "დღეები 1-10" },
  { key: 2, name: "დღეები 11-20" },
  { key: 3, name: "დღეები 21-30" },
  { key: 4, name: "დღეები 31" },
];

// eslint-disable-next-line react/prop-types
const RangeSelector = ({ setRange }) => {
  const [selectedRange, setSelectedRange] = useState(1);
  const handleSelect = (eventKey) => {
    setSelectedRange(Number(eventKey));
    setRange(Number(eventKey));
  };

  return (
    <Dropdown
      id="dropdown-basic-button"
      title={selectedRange}
      onSelect={handleSelect}
    >
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {range.filter((e) => e.key == selectedRange)[0].name
          ? range.filter((e) => e.key == selectedRange)[0].name
          : "აირჩიე დღეები"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {range.map((e) => (
          <Dropdown.Item eventKey={e.key} key={e.key}>
            {e.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RangeSelector;
