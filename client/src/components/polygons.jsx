import React from 'react';
import { Popup, Polygon } from 'react-leaflet';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import { EmissionsChartModal } from './emissionsChartModal';

import './popup.css';

const initialState = {
  showEmissionsChartModal: false,
  emissionCalculations: [],
};

export const Polygons = ({
  polygons,
  setPolygonId,
  setIsEditPolygonMode,
  setShowPolygonModal,
}) => {
  const handleClick = (polygonId) => {
    setPolygonId(polygonId);
    setIsEditPolygonMode(true);
    setShowPolygonModal(true);
  };

  const [showEmissionsChartModal, setShowEmissionsChartModal] = React.useState(
    initialState.showEmissionsChartModal
  );

  return (
    <>
      {polygons.map(
        ({
          poligonId,
          polygonPoints,
          brushColorR,
          brushColorG,
          brushColorB,
          user_name,
          name,
          emissions,
        }) => (
          <Polygon
            key={poligonId}
            positions={polygonPoints}
            color={`rgba(${brushColorR}, ${brushColorG}, ${brushColorB}, 1)`}
          >
            <Popup maxWidth='auto'>
              <FontAwesomeIcon
                icon={faPencilAlt}
                onClick={() => handleClick(poligonId)}
                className='edit-pencil-icon'
              />
              <div className='mt-4 mb-2'>
                {name && (
                  <div>
                    <strong>Назва:</strong> {name}
                  </div>
                )}
                {user_name && (
                  <div>
                    <strong>Керівник який поставив:</strong> {user_name}
                  </div>
                )}
              </div>
              {emissions && emissions.length > 0 && (
                <>
                  <Table
                    striped
                    bordered
                    hover
                    size='sm'
                    className='emissions-table'
                  >
                    <thead>
                      <tr>
                        <th title='Хімічний елемент'>Хімічний елемент</th>
                        <th title='Середнє значення'>Середнє значення</th>
                        <th title='Максимальне значення'>
                          Максимальне значення
                        </th>
                        <th title='Рік'>Рік</th>
                        <th title='Місяць'>Місяць</th>
                        <th title='День'>День</th>
                        <th title='Одиниця виміру'>Одиниця виміру</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emissions.map(
                        (
                          {
                            short_name,
                            ValueAvg,
                            ValueMax,
                            Year,
                            Month,
                            day,
                            Measure,
                          },
                          key
                        ) => (
                          <tr key={key}>
                            <td title={short_name}>{short_name}</td>
                            <td title={ValueAvg}>{ValueAvg}</td>
                            <td title={ValueMax}>{ValueMax}</td>
                            <td title={Year}>{Year}</td>
                            <td title={Month}>{Month}</td>
                            <td title={day}>{day}</td>
                            <td title={Measure}>{Measure}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                  <Button
                    size='sm'
                    onClick={() => setShowEmissionsChartModal(true)}
                  >
                    Відобразити графіки викидів
                  </Button>
                </>
              )}
              <EmissionsChartModal
                id={poligonId}
                emissions={emissions}
                show={showEmissionsChartModal}
                onHide={() => setShowEmissionsChartModal(false)}
              />
            </Popup>
          </Polygon>
        )
      )}
    </>
  );
};
