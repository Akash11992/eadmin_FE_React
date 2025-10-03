import React from 'react';
import { Table, FormCheck } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faRupeeSign } from '@fortawesome/free-solid-svg-icons';

const VendorManagementTable = () => {
  return (
    <div className="table-responsive rounded-3 border bookmakerTable">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-white bg-danger">
              <FormCheck type="checkbox" />
            </th>
            <th className="text-white bg-danger">NAME</th>
            <th className="text-white bg-danger">EMAIL</th>
            <th className="text-white bg-danger">PHONE</th>
            <th className="text-white bg-danger">Categories</th>
            <th className="text-white bg-danger">Company</th>
            <th className="text-white bg-danger">GST Treatment</th>
            <th className="text-white bg-danger">Payables</th>
            <th className="text-white bg-danger">
              <FontAwesomeIcon icon={faSearch} />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-white bg-danger">
              <FormCheck type="checkbox" />
            </td>
            <td>Mark</td>
            <td>mark.s@gmail.com</td>
            <td>7845123612</td>
            <td>Electricity Bill</td>
            <td>Reliance</td>
            <td>Register Business-reguler</td>
            <td><FontAwesomeIcon icon={faRupeeSign} />0.00</td>
          </tr>
          
        </tbody>
      </Table>
    </div>
  );
};

export default VendorManagementTable;