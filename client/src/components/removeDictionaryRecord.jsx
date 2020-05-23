import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { getIdColumnNameForDictionaryObject } from '../utils/helpers';
import { useEffect } from 'react';
import { useState } from 'react';
import { deleteRequest } from '../utils/httpService';

export const RemoveDictionaryRecord = ({
  selectedRow,
  url,
  setShouldFetchData,
  setSelectedRow,
}) => {
  const [idColumnName, setIdColumnName] = useState(null);
  const [idValue, setIdValue] = useState(null);

  useEffect(() => {
    if (selectedRow) {
      const idColumnName = getIdColumnNameForDictionaryObject(selectedRow);
      setIdColumnName(idColumnName);

      const idValue = selectedRow[idColumnName];
      setIdValue(idValue);
    }
  }, [selectedRow]);

  const removeRecord = async () => {
    try {
      await deleteRequest(`${url}/${idValue}`);
      setShouldFetchData(true);
      setSelectedRow(null);
    } catch (error) {
      console.log(error);
      alert(error.toString());
    }
  };

  return (
    <div className='row d-flex justify-content-center flex-column'>
      {!selectedRow && (
        <div className='mr-auto ml-auto mb-3 mt-3'>
          Оберіть рядок для видалення
        </div>
      )}
      {selectedRow && (idValue || idValue === 0) && idColumnName && (
        <>
          <InputGroup size='md' className='col-2 mr-auto ml-auto mb-3 mt-3'>
            <InputGroup.Prepend>
              <InputGroup.Text id='inputGroup-sizing-md'>
                Видалити {idColumnName}:
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label='Medium'
              aria-describedby='inputGroup-sizing-md'
              id='filter-text-box'
              placeholder='Оберіть рядок для видалення...'
              disabled
              value={idValue}
            />
          </InputGroup>
          <div className='col-1 m-auto'>
            <Button variant='danger' onClick={removeRecord}>
              Видалити
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
