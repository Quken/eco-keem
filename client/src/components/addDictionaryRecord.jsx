import React from 'react';
import { Button, Form } from 'react-bootstrap';

import { post } from '../utils/httpService';

const getInitialState = (columns) => {
  return columns
    .map(({ field }) => field)
    .reduce((o, key) => ({ ...o, [key]: '' }), {});
};

export const AddDictionaryRecord = ({ columns, url, setShouldFetchData }) => {
  const [formValues, setFormValues] = React.useState({});

  React.useEffect(() => {
    setFormValues(getInitialState(columns));
  }, [columns]);

  const setForm = (field, value) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const clearForm = () => {
    setFormValues(getInitialState(columns));
  };

  const addRecord = () => {
    const hasNoEmptyFields = Object.values(formValues).every((value) =>
      Boolean(value)
    );

    if (hasNoEmptyFields) {
      post(url, formValues)
        .then(() => {
          clearForm();
          setShouldFetchData(true);
          alert('Нові дані успішно додано');
        })
        .catch((error) => {
          console.log(error.response);
          alert('Помилка додавання');
          const message = error.response.data.message;
          alert(message ? message.sqlMessage : message.toString());
        });
    } else {
      window.alert('Будь ласка, заповніть усі поля');
    }
  };

  return (
    <>
      <Form
        style={{
          margin: '0 auto',
          width: '50%',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {columns &&
          columns.map(({ field }) => (
            <Form.Group style={{ padding: '0 10px', width: '50%' }} key={field}>
              <Form.Label>{field}</Form.Label>
              <Form.Control
                type='input'
                placeholder={`Введіть значення для ${field}`}
                value={formValues[field]}
                onChange={(e) => setForm(field, e.target.value)}
              />
            </Form.Group>
          ))}
      </Form>
      {columns.length > 0 && (
        <Button variant='primary' onClick={addRecord} className='mb-3'>
          Додати запис
        </Button>
      )}
    </>
  );
};
