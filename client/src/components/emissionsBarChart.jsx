import React from 'react';
import { Dropdown } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { transformEmissions, formatMonthDataForBarChart, getElementName } from '../utils/helpers';

const initialState = {
    select: {
        elementId: "",
        year: "",
    }
};

export const EmissionsBarChart = ({ emissions }) => {
    const [elementId, setElementId] = React.useState(initialState.select.elementId);
    const [year, setYear] = React.useState(initialState.select.year);

    if (!emissions) {
        return null;
    }

    const [elementName] = getElementName(emissions, elementId);
    const transformedEmissions = transformEmissions(emissions);
    const formattedMonthData = formatMonthDataForBarChart(transformedEmissions, elementId, year);

    return (
        <>
            <div className="d-flex mb-3">
                <Dropdown className="mr-2">
                    <Dropdown.Toggle size='md'>
                        {elementName || 'Оберіть елемент'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {transformedEmissions && Object.keys(transformedEmissions).map(emissionId => {
                            const [elementName] = getElementName(emissions, emissionId)

                            return <Dropdown.Item
                                key={emissionId}
                                active={elementId === emissionId}
                                onClick={() => {
                                    setElementId(emissionId)
                                    setYear(initialState.select.year)
                                }}
                            >
                                {elementName}
                            </Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                {elementId && <Dropdown>
                    <Dropdown.Toggle size='md'>
                        {year || 'Оберіть рік'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {transformedEmissions && Object.keys(transformedEmissions[elementId]).map(transformedYear => (
                            <Dropdown.Item
                                key={transformedYear}
                                active={year === transformedYear}
                                onClick={() => setYear(transformedYear)}
                            >
                                {transformedYear}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>}
            </div>
            <div className="mb-3">
                {
                    elementId && year && <BarChart
                        width={500}
                        height={300}
                        data={formattedMonthData}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" fill="#8884d8" />
                        <Bar dataKey="max" fill="#82ca9d" />
                    </BarChart>
                }
            </div>
        </>
    )
}
