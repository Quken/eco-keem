import React, { useEffect, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { URL_FROM_TABLE_NAME_MAP } from '../utils/maps';
import { get } from '../utils/httpService';

import { AddDictionaryRecord } from './addDictionaryRecord';

const mapColumns = (columns) => {
  return columns.map((columnName) => ({
    headerName: columnName,
    field: columnName,
    sortable: true,
    filter: true,
  }));
};

export const Dictionary = ({ user, tableName }) => {
  const url = URL_FROM_TABLE_NAME_MAP.get(tableName.toLowerCase());

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [shouldFetchData, setShouldFetchData] = useState(true);

  useEffect(() => {
    if (shouldFetchData) {
      get(url).then(({ data }) => {
        const mappedColumns = mapColumns(Object.keys(data[0]));
        setColumns(mappedColumns);
        setRows(Object.values(data));
      });

      setShouldFetchData(false);
    }
  }, [url, shouldFetchData]);
  return (
    <>
      {user && user.id_of_expert === 0 && (
        <AddDictionaryRecord
          columns={columns}
          url={url}
          setShouldFetchData={setShouldFetchData}
        />
      )}
      <div
        style={{ height: '500px', width: '100%' }}
        className='ag-theme-alpine'
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rows}
          rowSelection='single'
        />
      </div>
    </>
  );
};
