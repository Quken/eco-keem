import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { post } from '../utils/httpService';

export const AddDictionaryRecord = ({ columns, url, setShouldFetchData }) => {
  const [formValues, setFormValues] = React.useState({});

  React.useEffect(() => {
    const initialState = columns
      .map(({ field }) => field)
      .reduce((o, key) => ({ ...o, [key]: undefined }), {});
    setFormValues(initialState);
  }, [columns]);

  const setForm = (field, value) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const addRecord = () => {
    const hasNoEmptyFields = Object.values(formValues).every((value) =>
      Boolean(value)
    );
    if (hasNoEmptyFields) {
      post(url, formValues)
        .then(() => setShouldFetchData(true))
        .catch((error) => {
          console.log(error);
          alert(error.toString());
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
                value={formValues.field}
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
