import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Form } from 'react-bootstrap';

import { post, get, put } from '../utils/httpService';
import { POLYGON_URL } from '../utils/constants';

import { VerticallyCenteredModal } from './modal';
import { SubmitForm } from './submitForm';
import { useEffect } from 'react';

const initialState = {
  form: {
    brushColor: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
    lineThickness: 1,
    name: '',
    type: 'poligon',
    description: '',
  },
};

export const AddPolygonModal = ({
  onHide,
  show,
  coordinates,
  setShouldFetchData,
  setNewPolygonCoordinates,
  user,
  isEditPolygonMode,
  setIsEditPolygonMode,
  polygonId,
  setPolygonId,
}) => {
  const [lineThickness, setLineThickness] = useState(
    initialState.form.lineThickness
  );
  const [color, setColor] = useState(initialState.form.brushColor);
  const [name, setName] = useState(initialState.form.name);
  const [description, setDescription] = useState(initialState.form.description);

  const clearForm = () => {
    setLineThickness(initialState.form.lineThickness);
    setColor(initialState.form.brushColor);
    setName(initialState.form.name);
    setDescription(initialState.form.description);
  };

  useEffect(() => {
    if (polygonId && isEditPolygonMode) {
      get(`${POLYGON_URL}/${polygonId}`).then(({ data }) => {
        setLineThickness(data.line_thickness);
        setColor({
          r: data.brush_color_r,
          g: data.bruch_color_g,
          b: data.brush_color_b,
          a: data.brush_alfa,
        });
        setName(data.name);
        setDescription(data.description);
      });
    }
  }, [polygonId, isEditPolygonMode]);

  const addPolygon = (emission) => {
    post(POLYGON_URL, {
      brush_color_r: color.r,
      bruch_color_g: color.g,
      brush_color_b: color.b,
      brush_alfa: color.a,
      line_collor_r: color.r,
      line_color_g: color.g,
      line_color_b: color.b,
      line_alfa: color.a,
      line_thickness: Number(lineThickness),
      name,
      id_of_user: Number(user.id_of_user),
      id_of_expert: Number(user.id_of_expert),
      type: initialState.form.type,
      description,
      points: coordinates.map((point, index) => ({
        latitude: point.lat,
        longitude: point.lng,
        order123: index + 1,
      })),
      emission,
    })
      .then(() => {
        clearForm();
        onHide();
        setNewPolygonCoordinates([]);
        setShouldFetchData(true);
      })
      .catch(() => {
        setNewPolygonCoordinates([]);
        setShouldFetchData(false);
      });
  };

  const editPolygon = (emission) => {
    put(`${POLYGON_URL}/${polygonId}`, {
      brush_color_r: color.r,
      bruch_color_g: color.g,
      brush_color_b: color.b,
      brush_alfa: color.a,
      line_collor_r: color.r,
      line_color_g: color.g,
      line_color_b: color.b,
      line_alfa: color.a,
      line_thickness: Number(lineThickness),
      name,
      description,
      emission,
    })
      .then(() => {
        clearForm();
        onHide();
        setNewPolygonCoordinates([]);
        setShouldFetchData(true);
        setIsEditPolygonMode(false);
        setPolygonId(null);
      })
      .catch(() => {
        setIsEditPolygonMode(false);
        setPolygonId(null);
        setNewPolygonCoordinates([]);
        setShouldFetchData(false);
      });
  };

  const hide = () => {
    if (!isEditPolygonMode) {
      clearForm();
    }
    onHide();
  };

  return (
    <VerticallyCenteredModal
      size='lg'
      show={show}
      onHide={() => hide()}
      header='Додати або редагувати полігон'
    >
      <Form>
        <Form.Group>
          <Form.Label>
            Choose color of the polygon and line thickness
          </Form.Label>
          <Form.Control
            type='number'
            value={lineThickness}
            onChange={(e) => setLineThickness(e.target.value)}
          />
          <br />
          <SketchPicker
            color={color}
            onChangeComplete={({ rgb }) => setColor(rgb)}
          />
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
        {isEditPolygonMode ? (
          <SubmitForm onSave={editPolygon} />
        ) : (
          <SubmitForm onSave={addPolygon} />
        )}
      </Form>
    </VerticallyCenteredModal>
  );
};
