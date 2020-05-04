import React from 'react';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { uk } from 'date-fns/locale';

import { EMISSIONS_CALCULATIONS_URL } from '../utils/constants';
import { get } from '../utils/httpService';
import { useContext } from 'react';
import { EnvironmentsInfoContext } from './context/environmentsInfoContext';

export const DateRangePickerView = ({ id, param, setEmissionCalculations }) => {
  const { environmentsInfo } = useContext(EnvironmentsInfoContext);

  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);

  React.useEffect(() => {
    const [date] = state;

    const idEnvironment = environmentsInfo.selected.id;

    get(
      `${EMISSIONS_CALCULATIONS_URL}?idEnvironment=${idEnvironment}&${param}=${id}&startDate=${date.startDate.toISOString()}&endDate=${date.endDate.toISOString()}`
    ).then(({ data }) => setEmissionCalculations(data));
  }, [id, state]);

  return (
    <DateRangePicker
      locale={uk}
      onChange={(item) => setState([item.selection])}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      months={2}
      ranges={state}
      direction='horizontal'
    />
  );
};
