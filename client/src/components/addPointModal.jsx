import React, { useEffect, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

import { TYPE_OF_OBJECT_URL, OWNER_TYPES_URL } from '../utils/constants';
import { post, get, put } from '../utils/httpService';
import { POINT_URL } from '../utils/constants';

import { VerticallyCenteredModal } from './modal';
import { SubmitForm } from './submitForm';

import './submitForm.css';

const initialState = {
  form: {
    name: '',
    description: '',
    type: {
      id: 0,
      name: '',
    },
    ownerType: {
      id: 0,
      type: '',
    },
  },
};

const emptyState = {
  typeOfObject: `Оберіть тип об'єкту`,
  ownerType: `Оберіть форму власності`,
};

export const AddPointModal = ({
  onHide,
  show,
  coordinates,
  setShouldFetchData,
  isEditPointMode,
  setIsEditPointMode,
  pointId,
  setPointId,
  user,
}) => {
  const [name, setName] = useState(initialState.form.name);
  const [description, setDescription] = useState(initialState.form.description);
  const [type, setType] = useState(initialState.form.type);
  const [ownerType, setOwnerType] = useState(initialState.form.ownerType);
  const [types, setTypes] = useState([]);
  const [ownerTypes, setOwnerTypes] = useState([]);

  const clearForm = () => {
    setName(initialState.form.name);
    setDescription(initialState.form.description);
    setType(initialState.form.type);
    setOwnerType(initialState.form.ownerType);
  };

  const addPoint = (emission) => {
    post(POINT_URL, {
      Name_object: name,
      description,
      type: type.id,
      coordinates,
      emission,
      id_of_user: user.id_of_user,
      owner_type_id: ownerType.id,
    })
      .then(() => {
        clearForm();
        onHide();
        setShouldFetchData(true);
      })
      .catch(() => setShouldFetchData(false));
  };

  const editPoint = (emission) => {
    put(`${POINT_URL}/${pointId}`, {
      Name_object: name,
      description,
      type: type.id,
      owner_type_id: ownerType.id,
      emission,
    })
      .then(() => {
        clearForm();
        onHide();
        setShouldFetchData(true);
        setIsEditPointMode(false);
        setPointId(null);
      })
      .catch(() => {
        setShouldFetchData(false);
        setIsEditPointMode(false);
        setPointId(null);
      });
  };

  const hide = () => {
    if (!isEditPointMode) {
      clearForm();
    }
    onHide();
  };

  useEffect(() => {
    get(TYPE_OF_OBJECT_URL).then(({ data }) => {
      setTypes(data);
    });
    get(OWNER_TYPES_URL).then(({ data }) => {
      setOwnerTypes(data);
    });
  }, []);

  useEffect(() => {
    if (isEditPointMode && pointId) {
      get(`${POINT_URL}/${pointId}`).then(({ data }) => {
        const type = types.find(({ id }) => id === data.type);
        const ownerType = ownerTypes.find(
          ({ id }) => id === data.owner_type.id
        );
        if (type) {
          setType(type);
        }
        if (ownerType) {
          setOwnerType(ownerType);
        }
        setName(data.Name_object);
        setDescription(data.description);
      });
    }
  }, [pointId, isEditPointMode]);

  return (
    <VerticallyCenteredModal
      size='lg'
      show={show}
      onHide={() => hide()}
      header='Додати або редагувати точку'
    >
      <Form>
        <Form.Group>
          <Dropdown>
            <Dropdown.Toggle size='sm' variant='success'>
              {type.name || emptyState.typeOfObject}
            </Dropdown.Toggle>

            <Dropdown.Menu className='form-dropdown'>
              {types.length &&
                types.map((typeOfObject) => (
                  <Dropdown.Item
                    key={typeOfObject.id}
                    active={typeOfObject === type}
                    onClick={() => setType(typeOfObject)}
                  >
                    {typeOfObject.name}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        <Form.Group>
          <Dropdown>
            <Dropdown.Toggle size='sm' variant='success'>
              {ownerType.type || emptyState.ownerType}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {ownerTypes.length &&
                ownerTypes.map((type) => (
                  <Dropdown.Item
                    key={type.id}
                    active={type === ownerType}
                    onClick={() => setOwnerType(type)}
                  >
                    {type.type}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        <Form.Group>
          <Form.Label>Enter name</Form.Label>
          <Form.Control
            type='input'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Enter description</Form.Label>
          <Form.Control
            as='textarea'
            rows='3'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        {isEditPointMode ? (
          <SubmitForm onSave={editPoint} />
        ) : (
          <SubmitForm onSave={addPoint} />
        )}
      </Form>
    </VerticallyCenteredModal>
  );
};
