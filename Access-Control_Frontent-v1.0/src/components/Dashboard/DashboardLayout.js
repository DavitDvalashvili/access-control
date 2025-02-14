import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Table } from "react-bootstrap";
import { useStore } from "../../App";

const DashboardLayout = () => {
  const { HTTP } = useStore();

  const [dashboardData, setDashboardData] = useState({
    tardinessEmp: { tardinessEmpCount: 0, empList: [] },
    earlyLeaveEmp: { earlyLeaveEmpCount: 0, empList: [] },
    notIncomed: { notIncomedCount: 0, empList: [] },
    incomed: { incomedCount: 0, empList: [] },
  });

  const [detailInfo, setDetailInfo] = useState([]);
  const [detailInfoModal, setDetailInfoModal] = useState(false);
  const selectDetailInfo = (d) => {
    setDetailInfo(d);
    setDetailInfoModal(true);
  };
  const removeDetailInfo = () => {
    setDetailInfo([]);
    setDetailInfoModal(false);
  };

  const getDashboardStatistic = async () => {
    await axios
      .get(`${HTTP}/dashboardstatistic`)
      .then((res) => {
        if (res.status >= 200 && res.status <= 226) {
          setDashboardData(res.data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    getDashboardStatistic();
  }, []);

  const sizeProportion = (id) => {
    const donut = document.getElementById(id);
    // console.log((dashboardData.incomed.incomedCount / (dashboardData.incomed.incomedCount + dashboardData.notIncomed.notIncomedCount)) * 100);
    return donut
      ? window.getComputedStyle(donut || null)?.getPropertyValue("width")
      : 0;
  };

  return (
    <Col className="p-3 d-flex bpg-arial bg-red">
      <Col className="p-2">
        <Col className="fs-4 py-1 border-0 border-bottom mb-3">
          დღევანდელი მონაცემები
        </Col>
        <Col className="d-flex gap-3">
          <Col className="py-2 px-3 d-flex shadow-sm col-4 rounded-4">
            <Col className="col-9">
              <Col className="fs-5 border-0 border-bottom-0">თანამშრომლები</Col>
              <Col className="mt-2 ms-2 d-flex flex-column gap-1">
                <Col>
                  სულ:{" "}
                  {dashboardData.incomed.incomedCount +
                    dashboardData.notIncomed.notIncomedCount}{" "}
                  <Button
                    variant="link"
                    className="p-0 ms-2"
                    style={{ textDecoration: "none", fontSize: "0.9rem" }}
                    onClick={() =>
                      selectDetailInfo(
                        dashboardData.incomed.empList.concat(
                          dashboardData.notIncomed.empList
                        )
                      )
                    }
                  >
                    ვრცლად
                  </Button>
                </Col>
                <Col>
                  შემოსული: {dashboardData.incomed.incomedCount}{" "}
                  <Button
                    variant="link"
                    className="p-0 ms-2"
                    style={{ textDecoration: "none", fontSize: "0.9rem" }}
                    onClick={() =>
                      selectDetailInfo(dashboardData.incomed.empList)
                    }
                  >
                    ვრცლად
                  </Button>
                </Col>
                <Col>
                  შემოსასვლელი: {dashboardData.notIncomed.notIncomedCount}{" "}
                  <Button
                    variant="link"
                    className="p-0 ms-2"
                    style={{ textDecoration: "none", fontSize: "0.9rem" }}
                    onClick={() =>
                      selectDetailInfo(dashboardData.notIncomed.empList)
                    }
                  >
                    ვრცლად
                  </Button>
                </Col>
              </Col>
            </Col>
            <Col className="position-relative">
              <Col
                id="currentEvent"
                className="position-absolute progress-bar"
                style={{
                  height: sizeProportion("currentEvent"),
                  background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(rgb(115, 204, 103) ${
                    (dashboardData.incomed.incomedCount /
                      (dashboardData.incomed.incomedCount +
                        dashboardData.notIncomed.notIncomedCount)) *
                    100
                  }%, rgba(0, 0, 0, 0.1) 0)`,
                }}
              >
                <Col
                  className="position-absolute text-center"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%) rotate(-180deg)",
                  }}
                >
                  {/* <Col className='text-success'><b>{((dashboardData.incomed.incomedCount / (dashboardData.incomed.incomedCount + dashboardData.notIncomed.notIncomedCount)) * 100).toFixed(2)}%</b></Col> */}
                  <Col className="text-success">
                    {dashboardData.incomed.incomedCount}/
                    {dashboardData.incomed.incomedCount +
                      dashboardData.notIncomed.notIncomedCount}
                  </Col>
                </Col>
              </Col>
            </Col>
          </Col>
          <Col className="py-2 px-3 shadow-sm col-3 rounded-4">
            <Col className="fs-5 border-0 border-bottom">თანამშრომლები</Col>
            <Col className="mt-2 ms-2 d-flex flex-column gap-1">
              <Col>
                დაგვიანებით შემოსული:{" "}
                {dashboardData.tardinessEmp.tardinessEmpCount}{" "}
                <Button
                  variant="link"
                  className="p-0 ms-2"
                  style={{ textDecoration: "none", fontSize: "0.9rem" }}
                  onClick={() =>
                    selectDetailInfo(dashboardData.tardinessEmp.empList)
                  }
                >
                  ვრცლად
                </Button>
              </Col>
              <Col>
                ადრე გასული: {dashboardData.earlyLeaveEmp.earlyLeaveEmpCount}{" "}
                <Button
                  variant="link"
                  className="p-0 ms-2"
                  style={{ textDecoration: "none", fontSize: "0.9rem" }}
                  onClick={() =>
                    selectDetailInfo(dashboardData.earlyLeaveEmp.empList)
                  }
                >
                  ვრცლად
                </Button>
              </Col>
            </Col>
          </Col>
          {/* <Col className="py-2 px-3 shadow-sm col rounded-4">
                        <Col className="fs-5 border-0 border-bottom">თანამშრომლები</Col>
                        <Col className="mt-2 d-flex flex-column gap-1">
                            <Col>ჯამში: 200</Col>
                            <Col>შემოსული: 160</Col>
                            <Col>დაგვიანებით შემოსული: 5</Col>
                            <Col>ადრე გასული: 20</Col>
                        </Col>
                    </Col> */}
        </Col>
      </Col>
      {detailInfoModal && (
        <DashboardDetailInfo
          detailInfo={detailInfo}
          detailInfoModal={detailInfoModal}
          removeDetailInfo={removeDetailInfo}
        />
      )}
    </Col>
  );
};

const DashboardDetailInfo = ({
  detailInfo = [],
  detailInfoModal,
  removeDetailInfo,
}) => {
  return (
    <Modal
      show={detailInfoModal}
      size="xl"
      className="bpg-arial"
      backdrop="static"
    >
      <Modal.Header className="border-0">
        <Modal.Title>დეტალური ინფორმაცია</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="overflow-y-auto overflow-v"
        style={{ maxHeight: "75vh" }}
      >
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>სახელი</th>
              <th>გვარი</th>
              <th>ელ-ფოსტა</th>
              <th>ტელეფონი</th>
              <th>ბარათი</th>
            </tr>
          </thead>
          <tbody>
            {detailInfo.map((d, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{d.FirstName}</td>
                  <td>{d.LastName}</td>
                  <td>{d.Email}</td>
                  <td>{d.PhoneNumber}</td>
                  <td>{d.CardUID}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="dark" onClick={removeDetailInfo}>
          დახურვა
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DashboardLayout;
