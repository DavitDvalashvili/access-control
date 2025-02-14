import { Dropdown } from "react-bootstrap";
import { useState } from "react";

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
        აირჩიე დღეები
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item eventKey="1">დღეები 1-10</Dropdown.Item>
        <Dropdown.Item eventKey="2">დღეები 11-20</Dropdown.Item>
        <Dropdown.Item eventKey="3">დღეები 21-30</Dropdown.Item>
        <Dropdown.Item eventKey="4">დღეები 31</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RangeSelector;
