export const performanceRowDataEmpty = [
  {goalDesc: 'Leadership Competence', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
  {goalDesc: 'Openness to Employee', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
  {goalDesc: 'Social Behaviour to Employee', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
  {goalDesc: 'Attitude towards Client', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
  {goalDesc: 'Communication Skills', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
  {goalDesc: 'Integrity to Company', targetValue: 0, actualValue: 0, bonus: 0, sid: 0}
];

export const salesmenColumnDefs = [
  {field: '_id', headerName: 'SID', sortable: true, flex: 1},
  {field: 'employeeId', headerName: 'EmployeeId', sortable: true, flex: 1},
  {field: 'firstName', headerName: 'First Name', sortable: true, flex: 1},
  {field: 'lastName', headerName: 'Last Name', sortable: true, flex: 1},
  {field: 'dob', headerName: 'Date of Birth', sortable: true, flex: 1},
  {field: 'department', headerName: 'Department', sortable: true, flex: 1},
];

export const performanceColumnDefs = [
  {
    field: 'goalDesc',
    headerName: 'Goal',
    sortable: true,
    editable: false,
    autoHeight: true,
    wrapText: true,
    flex: 1
  },
  {
    field: 'actualValue',
    headerName: 'Actual Value',
    sortable: true,
    editable: true,
    flex: 1
  },
  {
    field: 'targetValue',
    headerName: 'Target Value',
    sortable: true,
    editable: true,
    flex: 1
  },
  {
    field: 'bonus',
    headerName: 'Bonus',
    sortable: true,
    editable: false,
    flex: 1
  },
];
export const ordersColumnDefs = [
  {field: 'product', headerName: 'Product', sortable: true, flex: 1},
  {field: 'customerName', headerName: 'Customer', sortable: true, autoHeight: true, wrapText: true, flex: 1},
  {field: 'clientRanking', headerName: 'Client Ranking', sortable: true, flex: 1},
  {field: 'items', headerName: 'Items', sortable: true, flex: 1},
  {
    field: 'bonus',
    headerName: 'Bonus',
    sortable: true,
    editable: false,
    flex: 1
  },
];
