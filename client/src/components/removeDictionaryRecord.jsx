import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { getIdColumnNameForDictionaryObject } from '../utils/helpers';
import { useEffect } from 'react';
import { useState } from 'react';
import { deleteRequest } from '../utils/httpService';

export const RemoveDictionaryRecord = ({
  selectedRow,
  setShouldDeselectSelectedRows,
  url,
  setShouldFetchData,
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
    if (window.confirm('Ви впевнені що бажаєте видалити обраний рядок?')) {
      try {
        await deleteRequest(`${url}/${idValue}`);
        setShouldFetchData(true);
        setShouldDeselectSelectedRows(true);
        alert('Рядок успішно видалено');
      } catch (error) {
        console.log(error.response);
        alert('Помилка видалення');
        const message = error.response.data.message;
        alert(message ? message.sqlMessage : message.toString());
      }
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
          <div className='col-1 mr-auto ml-auto mb-3 mt-3'>
            <Button variant='danger' onClick={removeRecord}>
              Видалити
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
