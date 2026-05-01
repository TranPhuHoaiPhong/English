// leaveData.js

export const leaveRequestsData = [
  // ===== SICK =====
  {
    key: "1",
    employee: { name: "Nguyễn Văn A", department: "IT" },
    leaveType: "SICK",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    reason: "Sốt",
    status: "PENDING",
    proofStatus: null,
    medicalProof:
      "https://img.yumpu.com/33084973/1/500x640/medical-certificate-department-of-transport.jpg",
    proofDueDate: "2026-05-04"
  },
  {
    key: "2",
    employee: { name: "Trần Thị B", department: "HR" },
    leaveType: "SICK",
    startDate: "2026-05-01",
    endDate: "2026-05-02",
    reason: "Đau bụng",
    status: "APPROVED",
    proofStatus: "SUBMITTING",
    medicalProof: null,
    proofDueDate: "2099-01-01"
  },
  {
    key: "3",
    employee: { name: "Lê Văn C", department: "IT" },
    leaveType: "SICK",
    startDate: "2026-04-01",
    endDate: "2026-04-02",
    reason: "Cảm",
    status: "APPROVED",
    proofStatus: "SUBMITTING",
    medicalProof: null,
    proofDueDate: "2026-04-03"
  },
  {
    key: "4",
    employee: { name: "Phạm Văn D", department: "IT" },
    leaveType: "SICK",
    startDate: "2026-05-01",
    endDate: "2026-05-02",
    reason: "Sốt",
    status: "APPROVED",
    proofStatus: "SUBMITTED",
    medicalProof:
      "https://img.yumpu.com/33084973/1/500x640/medical-certificate-department-of-transport.jpg",
    proofDueDate: "2026-05-04"
  },

  // ===== ANNUAL =====
  {
    key: "5",
    employee: { name: "Hoàng Văn E", department: "IT" },
    leaveType: "ANNUAL",
    startDate: "2026-06-01",
    endDate: "2026-06-05",
    reason: "Du lịch",
    status: "PENDING"
  },

  // ===== UNPAID =====
  {
    key: "6",
    employee: { name: "Nguyễn Văn F", department: "HR" },
    leaveType: "UNPAID",
    startDate: "2026-05-10",
    endDate: "2026-05-12",
    reason: "Việc riêng",
    status: "PENDING"
  },

  // ===== OTHER =====
  {
    key: "7",
    employee: { name: "Trần Văn G", department: "IT" },
    leaveType: "OTHER",
    startDate: "2026-05-15",
    endDate: "2026-05-16",
    reason: "Công việc cá nhân",
    status: "APPROVED"
  }
];