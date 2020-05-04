import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { get } from '../utils/httpService';
import { EXPERTS_URL } from '../utils/constants';

import './filtration.css';

export const Filtration = ({ user, setFilteredItems }) => {
  let filtrationForm;
  const [existingExperts, setExistingExperts] = useState([]);

  useEffect(() => {
    get(EXPERTS_URL).then(({ data }) => {
      setExistingExperts(data);
    });
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    const { expertCheckbox: expertCheckboxes, myCheckbox } = filtrationForm;
    const selectedExperts = Array.from(expertCheckboxes)
      .filter(({ checked }) => checked)
      .map(({ value }) => existingExperts.find(
        ({ id_of_expert }) => +id_of_expert === +value
      ));

    if (myCheckbox && myCheckbox.checked) {
      setFilteredItems({ isMyObjectsSelectionChecked: true, items: [...selectedExperts, user] });
    }
    else {
      setFilteredItems({ isMyObjectsSelectionChecked: false, items: selectedExperts });
    }
  };

  return (
    <Form
      onSubmit={submitHandler}
      className="filtration-form d-flex justify-content-center flex-column"
      ref={(form) => (filtrationForm = form)}
    >
      <Form.Group>
        <Form.Label>
          <b>Оберіть експерта</b>
        </Form.Label>
        {existingExperts.length &&
          existingExperts.map((expert) => (
            <Form.Check
              label={expert.expert_name}
              type="checkbox"
              value={expert.id_of_expert}
              key={expert.id_of_expert}
              name="expertCheckbox"
            />
          ))}
        {user && (
          <Form.Check
            label="Мої об'єкти"
            type="checkbox"
            value={user.id_of_user}
            key={user.id_of_user}
            name="myCheckbox"
          />
        )}
      </Form.Group>

      <Button variant="primary" type="submit" className="text-center">
        Застосувати
      </Button>
    </Form>
  );
};
