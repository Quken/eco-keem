import React, { useContext } from 'react';
import { Table } from 'react-bootstrap';

import { get } from '../utils/httpService';
import { EMISSIONS_CALCULATIONS_URL } from '../utils/constants';

import { findAverageForEmissionCalculations, findMaxForEmissionCalculations, formatEmissionsLineChart } from '../utils/helpers';

import { VerticallyCenteredModal } from './modal';
import { Chart } from './chart';
import { DateRangePickerView } from './dateRangePicker';
import { EmissionLineChart } from "./emissionsLineChart";

import './emissionsChartModal.css';
import { EnvironmentsInfoContext } from './context/environmentsInfoContext';

const valuesPrecision = 2;
const emptyState = 'Немає даних';

export const EmissionsChartModal = ({
  id,
  isPoint,
  onHide,
  show,
  emissions,
}) => {
  const { environmentsInfo } = useContext(EnvironmentsInfoContext);
  const param = isPoint ? 'idPoi' : 'idPolygon';
  const [emissionCalculations, setEmissionCalculations] = React.useState([]);

  React.useEffect(() => {
    getEmissionCalculations(id);
  }, [id]);

  const getEmissionCalculations = (id) => {
    const idEnvironment = environmentsInfo.selected.id;

    get(
      `${EMISSIONS_CALCULATIONS_URL}?idEnvironment=${idEnvironment}&${param}=${id}`
    ).then(({ data }) => setEmissionCalculations(data));
  };

  const chartAverageData =
    emissionCalculations && emissionCalculations.length > 0
      ? findAverageForEmissionCalculations(emissionCalculations)
      : [];

  const chartMaxData =
    emissionCalculations && emissionCalculations.length > 0
      ? findMaxForEmissionCalculations(emissionCalculations)
      : [];

  return (
    <VerticallyCenteredModal
      size='xl'
      show={show}
      onHide={onHide}
      header='Відобразити викиди'
    >
      <h4 className='mb-3'>
        Оберіть дати для відображення викидів за певний період
      </h4>
      <DateRangePickerView
        id={id}
        param={param}
        setEmissionCalculations={setEmissionCalculations}
      />
      {emissionCalculations.length > 0 ? (
        <Table className='emissions-table'>
          <thead>
            <tr>
              <th title='Елемент'>Елемент</th>
              <th title='Дата'>Дата</th>
              <th title='Одиниця виміру'>Одиниця виміру</th>
              <th title='Середнє значення average викидів'>
                Середнє значення average викидів
              </th>
              <th title='ГДК average'>ГДК average</th>
              <th title='Перевищення ГДК average'>Перевищення ГДК average</th>
              <th title='Max викидів'>Max викидів</th>
              <th title='ГДК max'>ГДК max</th>
              <th title='Перевищення ГДК max'>Перевищення ГДК max</th>
            </tr>
          </thead>
          <tbody>
            {emissionCalculations.map((emission, id) => {
              const exceedingByAverage = emission.averageCalculations.gdkAverage
                ? (
                    emission.averageCalculations.gdkAverage -
                    emission.averageCalculations.average
                  ).toFixed(valuesPrecision)
                : emptyState;

              const exceedingByMaximum = emission.maximumCalculations.gdkMax
                ? (
                    emission.maximumCalculations.gdkMax -
                    emission.maximumCalculations.max
                  ).toFixed(valuesPrecision)
                : emptyState;

              return (
                <tr key={id}>
                  <td title={emission.element}>{emission.element}</td>
                  <td
                    title={emission.date}
                  >{`${emission.date.day}/${emission.date.month}/${emission.date.year}`}</td>
                  <td title={emission.measure}>{emission.measure}</td>
                  <td title={emission.averageCalculations.average}>
                    {emission.averageCalculations.average.toFixed(
                      valuesPrecision
                    )}
                  </td>
                  <td
                    title={
                      emission.averageCalculations.gdkAverage || emptyState
                    }
                  >
                    {emission.averageCalculations.gdkAverage || emptyState}
                  </td>
                  <td title={exceedingByAverage}>{exceedingByAverage}</td>
                  <td title={emission.maximumCalculations.max}>
                    {emission.maximumCalculations.max.toFixed(valuesPrecision)}
                  </td>
                  <td title={emission.maximumCalculations.gdkMax || emptyState}>
                    {emission.maximumCalculations.gdkMax || emptyState}
                  </td>
                  <td title={exceedingByMaximum}>{exceedingByMaximum}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <h6 className='mt-3 mb-3'>
          Немає інформації про викиди за обраний період
        </h6>
      )}
      <div className="d-flex justify-content-around">
        {chartAverageData.length > 0 && (
          <Chart title="Графік середніх викидів" data={chartAverageData} />
        )}
        {chartMaxData.length > 0 && (
          <Chart title="Графік максимальних викидів" data={chartMaxData} />
        )}
      </div>
      {emissionCalculations.length > 0 && (
        <>
          <h4 className='mb-3'>
            Оберіть елемент та для відображення викидів за допомогою графіка
          </h4>
          <EmissionLineChart
            emissions={formatEmissionsLineChart(emissionCalculations)}
          />
        </>
      )}
    </VerticallyCenteredModal>
  );
};
