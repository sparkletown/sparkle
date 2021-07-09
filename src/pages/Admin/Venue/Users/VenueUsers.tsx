// import React, { useEffect, useState } from "react";
import React from "react";
// import { useWorldUsersById } from "hooks/users";
import "./VenueUsers.scss";
// import Table from "react-bootstrap/Table";
// import Form from "react-bootstrap/Form";
// import { downloadGeneratedCSVFile } from "utils/csv";
// import { WorldUsersProvider } from "hooks/users/useWorldUsers";

// Reducer
// import { useVenueId } from "hooks/useVenueId";
// const worldUsers = [
//   {
//     partyName: "ermiahp",
//     realName: "Ermia Hassanpour",
//     companyDepartment: "SparkleSpace",
//   },
//   {
//     partyName: "sami",
//     realName: "Sam Hassanpour",
//     companyDepartment: "SparkleSpace",
//   },
// ];

const VenueUsers: React.FC = () => {
  // const venueId = useVenueId() ?? "";
  // const { worldUsersById } = useWorldUsersById();
  // console.log('ermia');
  // console.log(worldUsersById);

  // const [headers, setHeaders] = useState<Array<string>>([]);
  // const [headersSelected, setHeadersSelected] = useState<Array<string>>([]);

  // let headers: string[] = [];

  // useEffect(() => {
  //   // getUsersHeaders();
  // },[worldUsers]);

  // const getUsersHeaders = () => {
  //   // headers = ;
  //   setHeaders(Object.keys(worldUsers[0]));
  // };

  const renderPageHeader = () => {
    return <h4>Users Reports</h4>;
  };

  // const renderUserTable = () => {
  //   return (
  //     <Table striped bordered hover>
  //       <thead>
  //         <tr>
  //           <th>#</th>
  //           <th>Party Name</th>
  //           <th>Full Name</th>
  //           <th>Department</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {worldUsers.map((user, index) => {
  //           return (
  //             <tr key={index}>
  //               <td>{index + 1}</td>
  //               <td>{user.partyName || ""}</td>
  //               <td>{user.realName || "Not set"}</td>
  //               <td>{user.companyDepartment || "Not set"}</td>
  //             </tr>
  //           );
  //         })}
  //       </tbody>
  //     </Table>
  //   );
  // };

  // const downloadCSV = () => {
  //   downloadGeneratedCSVFile(worldUsers, headers);
  // };

  // const renderDownloadBox = () => {
  //   return <button onClick={() => downloadCSV()}>Download </button>;
  // };

  // const updateSelectedHeaders = (selected: string) => {
  //   if (headersSelected.includes(selected)) {
  //     headersSelected.splice(headersSelected.indexOf(selected), 1);
  //     setHeadersSelected([...headersSelected]);
  //   } else {
  //     setHeadersSelected([...headersSelected, selected]);
  //   }
  // };

  // const renderFieldFilter = () => {
  //   return (
  //     <div className=" venue-users-detail-filter-box">
  //       {headers.map((header) => (
  //         <Form.Check
  //           key={header}
  //           type="switch"
  //           id={header}
  //           label={header}
  //           checked={headersSelected.includes(header)}
  //           onChange={() => updateSelectedHeaders(header)}
  //         />
  //       ))}
  //       {renderDownloadBox()}
  //     </div>
  //   );
  // };

  return (
    <div className="venue-users-detail">
      {renderPageHeader()}
      {/* {renderFieldFilter()}
      {renderUserTable()} */}
    </div>
  );
};

export default VenueUsers;
