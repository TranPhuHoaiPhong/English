import { useState } from "react";
import { leaveRequestsData } from "../../services/Admin/LeaveRequests";
import removeVietnameseTones from "../../utils/removeVietnameseTones";
import LeaveFilter from "../../components/Admin/LeaveRequest/LeaveFilter";
import LeaveTable from "../../components/Admin/LeaveRequest/LeaveTable";

function LeavePage() {
  const [filter, setFilter] = useState("ANNUAL");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(leaveRequestsData);

  const filteredData = data.filter((item) => {
      const matchFilter =
        filter === "ALL" ||
        item.leaveType === filter;

      const keyword =
        removeVietnameseTones(
          searchText.toLowerCase()
        );

      const matchSearch =
        removeVietnameseTones(
          item.employee.name.toLowerCase()
        ).includes(keyword);

      return (
        matchFilter &&
        matchSearch
      );
    }
  );

  const handleApprove = (record) => {
    setData((prev) =>
      prev.map((item) => {

        if (item.key !== record.key)
          return item;

        if (
          item.leaveType === "SICK" &&
          !item.medicalProof
        ) {
          return {
            ...item,
            status: "APPROVED",
            proofStatus: "SUBMITTING"
          };
        }

        return {
          ...item,
          status: "APPROVED"
        };
      })
    );
  };

  const handleReject = (record) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === record.key
          ? {
              ...item,
              status: "REJECTED"
            }
          : item
      )
    );
  };

  const approveProof = (record) => {

    setData((prev) =>
      prev.map((item) =>
        item.key === record.key
          ? {
              ...item,
              proofStatus: "APPROVED"
            }
          : item
      )
    );
  };

  const rejectProof = (record) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === record.key
          ? {
              ...item,
              proofStatus: "REJECTED"
            }
          : item
      )
    );
  };

  return (
    <>
      <LeaveFilter
        filter={filter}
        setFilter={setFilter}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <LeaveTable
        filteredData={filteredData}
        handleApprove={handleApprove}
        handleReject={handleReject}
        approveProof={approveProof}
        rejectProof={rejectProof}
      />
    </>
  );
}

export default LeavePage;