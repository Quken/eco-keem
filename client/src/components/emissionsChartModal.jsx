import React from "react";
import { Table } from "react-bootstrap";

import { get } from "../utils/httpService";
import { EMISSIONS_CALCULATIONS_URL } from "../utils/constants";

import { VerticallyCenteredModal } from "./modal";
import { Chart } from "./chart";
import { EmissionsBarChart } from "./emissionsBarChart";
import { DateRangePickerView } from "./dateRangePicker";

import "./emissionsChartModal.css";

const valuesPrecision = 2;
const emptyState = "Немає даних";

export const EmissionsChartModal = ({
  id,
  isPoint,
  onHide,
  show,
  emissions,
}) => {
  const param = isPoint ? "idPoi" : "idPolygon";
  const [emissionCalculations, setEmissionCalculations] = React.useState([]);

  React.useEffect(() => {
    getEmissionCalculations(id);
  }, [id]);

  const getEmissionCalculations = (id) => {
    get(`${EMISSIONS_CALCULATIONS_URL}?${param}=${id}`).then(({ data }) =>
      setEmissionCalculations(data)
    );
  };

  const chartAverageData =
    emissionCalculations && emissionCalculations.length > 0
      ? emissionCalculations.map((emission) => ({
          name: emission.element,
          value: emission.averageCalculations.average,
        }))
      : [];

  const chartMaxData =
    emissionCalculations && emissionCalculations.length > 0
      ? emissionCalculations.map((emission) => ({
          name: emission.element,
          value: emission.maximumCalculations.max,
        }))
      : [];

  return (
    <VerticallyCenteredModal size="xl" show={show} onHide={onHide} header="Відобразити викиди">
      <h3 className="mb-3">
        Оберіть дати для відображення викидів за певний період
      </h3>
      <DateRangePickerView
        id={id}
        param={param}
        setEmissionCalculations={setEmissionCalculations}
      />
      {emissionCalculations.length > 0 ? (
        <Table className="emissions-table">
          <thead>
            <tr>
              <th title="Елемент">Елемент</th>
              <th title="Середовище">Середовище</th>
              <th title="Одиниця виміру">Одиниця виміру</th>
              <th title="Середнє значення average викидів">
                Середнє значення average викидів
              </th>
              <th title="ГДК average">ГДК average</th>
              <th title="Перевищення ГДК average">Перевищення ГДК average</th>
              <th title="Max викидів">Max викидів</th>
              <th title="ГДК max">ГДК max</th>
              <th title="Перевищення ГДК max">Перевищення ГДК max</th>
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
                  <td title={emission.element}>{emission.idEnvironment}</td>
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
        <h5 className="mb-3">Немає інформації про викиди за обраний період</h5>
      )}
      <EmissionsBarChart emissions={emissions} />
      <h3>Сума average викидів</h3>
      <Chart data={chartAverageData} />
      <h3>Сума max викидів</h3>
      <Chart data={chartMaxData} />
    </VerticallyCenteredModal>
  );
};
