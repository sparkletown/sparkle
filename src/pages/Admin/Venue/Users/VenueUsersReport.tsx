import React, { useEffect, useCallback, useState } from "react";
import { useWorldUsers } from "hooks/users";
import "./VenueUsersReport.scss";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { downloadGeneratedCSVFile } from "utils/csv";
import { User } from "types/User";
import { WithId } from "utils/id";

const VenueUsersReport: React.FC = () => {
  const { worldUsers } = useWorldUsers();

  const [headers, setHeaders] = useState<Array<string>>([]);
  const [headersSelected, setHeadersSelected] = useState<Array<string>>([]);
  const [customFieldValue, setCustomFieldValue] = useState("");

  const userIsComplete = useCallback((user: WithId<User>) => {
    return user.partyName && user.pictureUrl;
  }, []);

  const getUsersHeaders = useCallback(() => {
    let index = 0;
    while (index < worldUsers.length) {
      if (userIsComplete(worldUsers[index])) {
        setHeaders(Object.keys(worldUsers[index]));
        return;
      } else {
        index++;
      }
    }
  }, [worldUsers, userIsComplete]);

  useEffect(() => {
    getUsersHeaders();
  }, [worldUsers, getUsersHeaders]);

  const renderPageHeader = () => {
    return <h4>Users Reports</h4>;
  };

  const renderUserTable = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Party Name</th>
            <th>Full Name</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {/* when I try to use WithId<User> as realName are not added in it, it shows erro, so that's why I need any */}
          {/* eslint-disable-next-line*/}
          {worldUsers.map((user: any, index) => {
            return (
              userIsComplete(user) && (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.partyName || "Not"}</td>
                  <td>{user.realName || "Not set"}</td>
                  <td>{user.companyDepartment || "Not set"}</td>
                </tr>
              )
            );
          })}
        </tbody>
      </Table>
    );
  };

  const downloadCSV = useCallback(() => {
    downloadGeneratedCSVFile(worldUsers, headersSelected);
  }, [worldUsers, headersSelected]);

  const renderDownloadBtn = () => {
    return (
      <button
        className="btn btn-primary download-btn"
        onClick={() => downloadCSV()}
      >
        Download{" "}
      </button>
    );
  };

  const updateSelectedHeaders = useCallback(
    (selected: string) => {
      if (headersSelected.includes(selected)) {
        headersSelected.splice(headersSelected.indexOf(selected), 1);
        setHeadersSelected([...headersSelected]);
      } else {
        setHeadersSelected([...headersSelected, selected]);
      }
    },
    [headersSelected]
  );

  const addCustomField = useCallback(() => {
    if (!headers.includes(customFieldValue)) {
      setHeaders([...headers, customFieldValue]);
    }
  }, [customFieldValue, headers]);

  const updateCustomFieldValue = useCallback(
    (field: string) => {
      setCustomFieldValue(field);
    },
    [setCustomFieldValue]
  );

  const renderFoundedHeaders = () => {
    return (
      <div className="venue-users-detail-filter-box-headers">
        {headers.map((header) => (
          <div
            className="venue-users-detail-filter-box-headers-item"
            key={header}
          >
            <Form.Check
              type="switch"
              id={header}
              label={header}
              checked={headersSelected.includes(header)}
              onChange={() => updateSelectedHeaders(header)}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderCustomHeaders = () => {
    return (
      <div className="venue-users-detail-filter-box-custom-field">
        <label>Add custom field:</label>
        <input
          onChange={(event) => updateCustomFieldValue(event.target.value)}
        />
        <button className="btn btn-primary" onClick={() => addCustomField()}>
          Add field
        </button>
      </div>
    );
  };

  const renderFieldFilter = () => {
    return (
      <div className=" venue-users-detail-filter-box">
        {renderFoundedHeaders()}
        {renderCustomHeaders()}
        {renderDownloadBtn()}
      </div>
    );
  };

  return (
    <div className="venue-users-detail">
      {renderPageHeader()}
      {renderFieldFilter()}
      {renderUserTable()}
    </div>
  );
};

export default VenueUsersReport;
