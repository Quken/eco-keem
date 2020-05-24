import React, { useEffect, useState } from 'react';

import { InputGroup, FormControl } from 'react-bootstrap';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { URL_FROM_TABLE_NAME_MAP } from '../utils/maps';
import { get } from '../utils/httpService';

import { AddDictionaryRecord } from './addDictionaryRecord';
import { DictionaryModes } from './dictionaryModes';
import { DICTIONARY_MODES } from '../utils/constants';
import { RemoveDictionaryRecord } from './removeDictionaryRecord';
import { EditDictionaryRecord } from './editDictionaryRecord';

import './dictionary.css';

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

  const [gridOptions, setGridOptions] = useState({});

  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [shouldDeselectSelectedRows, setShouldDeselectSelectedRows] = useState(
    false
  );

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

  useEffect(() => {
    if (shouldDeselectSelectedRows && gridOptions.api) {
      setSelectedRow(null);
      gridOptions.api.deselectAll();
      onFilterTextBoxChanged('');

      setShouldDeselectSelectedRows(false);
    }
  }, [shouldDeselectSelectedRows, gridOptions.api]);

  useEffect(() => {
    setShouldDeselectSelectedRows(true);
  }, [selectedMode]);

  const onFilterTextBoxChanged = (inputText) => {
    gridOptions.api.setQuickFilter(inputText);
  };

  const onGridReady = (gridOptions) => {
    setGridOptions(gridOptions);
  };

  const onRowSelected = () => {
    const selectedNodes = gridOptions.api.getSelectedNodes();
    const selectedData = selectedNodes.map(({ data }) => data);

    setSelectedRow(selectedData[0]);
  };

  return (
    <>
      <div className='container d-flex justify-content-space-between mt-4 mb-4 dictionary'>
        <div className='col-3 text-left dictionary__modes'>
          <div className='mb-2'>Оберіть опцію</div>
          <DictionaryModes
            setSelectedMode={setSelectedMode}
            user={user}
            className='text-align-left'
          />
        </div>
        <div
          className='col-9'
          style={{
            backgroundColor: '#e1ebf3',
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
        >
          {selectedMode === DICTIONARY_MODES.search && (
            <div className='row'>
              <InputGroup size='md' className='col-9 m-auto'>
                <InputGroup.Prepend>
                  <InputGroup.Text id='inputGroup-sizing-md'>
                    Пошук:
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  aria-label='Medium'
                  aria-describedby='inputGroup-sizing-md'
                  id='filter-text-box'
                  placeholder='Введіть пошукові дані...'
                  onInput={({ target }) => onFilterTextBoxChanged(target.value)}
                />
              </InputGroup>
            </div>
          )}
          {user &&
            user.id_of_expert === 0 &&
            selectedMode === DICTIONARY_MODES.add && (
              <AddDictionaryRecord
                columns={columns}
                url={url}
                setShouldFetchData={setShouldFetchData}
              />
            )}
          {user &&
            user.id_of_expert === 0 &&
            selectedMode === DICTIONARY_MODES.edit && (
              <EditDictionaryRecord
                columns={columns}
                url={url}
                setShouldFetchData={setShouldFetchData}
                selectedRow={selectedRow}
                setShouldDeselectSelectedRows={setShouldDeselectSelectedRows}
              />
            )}
          {user &&
            user.id_of_expert === 0 &&
            selectedMode === DICTIONARY_MODES.delete && (
              <RemoveDictionaryRecord
                selectedRow={selectedRow}
                url={url}
                setShouldFetchData={setShouldFetchData}
                setShouldDeselectSelectedRows={setShouldDeselectSelectedRows}
              />
            )}
        </div>
      </div>
      <div
        style={{ height: '500px', width: '99%' }}
        className='ag-theme-alpine'
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rows}
          rowSelection='single'
          onGridReady={onGridReady}
          onRowSelected={onRowSelected}
        />
      </div>
    </>
  );
};
