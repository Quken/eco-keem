import React from 'react';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { uk } from 'date-fns/locale';

import { EMISSIONS_CALCULATIONS_URL } from '../utils/constants';
import { get } from '../utils/httpService';

export const DateRangePickerView = ({ id, param, setEmissionCalculations }) => {
    const [state, setState] = React.useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);

    React.useEffect(() => {
        const [date] = state;
        get(`${EMISSIONS_CALCULATIONS_URL}?${param}=${id}&startDate=${date.startDate.toISOString()}&endDate=${date.endDate.toISOString()}`)
            .then(({ data }) => setEmissionCalculations(data))
    }, [id, state]);

    return <DateRangePicker
        locale={uk}
        onChange={item => setState([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
    />
}
