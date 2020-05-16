import React, { useEffect, useState } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';

import { get } from '../utils/httpService';
import {
  POLYGONS_URL,
  POINTS_URL,
  MAP_CENTER_COORDS,
  OPEN_STREET_MAP_URL,
} from '../utils/constants';
import { removeObjectDuplicates } from '../utils/helpers';

import { Polygons } from './polygons';
import { Points } from './points';
import { AddPointModal } from './addPointModal';
import { AddPolygonModal } from './addPolygonModal';
import { Filtration } from './filtration';

import './map.css';
import { EnvironmentsInfoContext } from './context/environmentsInfoContext';
import { useContext } from 'react';

const initialState = {
  points: [],
  polygons: [
    {
      name: '',
      expertName: '',
      polygonPoints: [],
    },
  ],
  filteredPolygons: [],
  filteredItems: {
    isMyObjectsSelectionChecked: false,
    items: [],
  },
  filteredPoints: [],
  isAddPointModeEnabled: false,
  isAddPolygonModeEnabled: false,
  showPointModal: false,
  showPolygonModal: false,
  newPointCoordinates: [],
  newPolygonCoordinates: [],
  shouldFetchData: true,
  isEditPointMode: false,
  pointId: null,
  isEditPolygonMode: false,
  polygonId: null,
};

const buttonText = (geographicalObj, isModeEnabled) =>
  isModeEnabled
    ? `Виключити режим додавання`
    : `Додати ${geographicalObj} на карту`;

export const MapView = ({ user }) => {
  const [filteredItems, setFilteredItems] = useState(
    initialState.filteredItems
  );
  const [shouldFetchData, setShouldFetchData] = useState(
    initialState.shouldFetchData
  );

  // points
  const [filteredPoints, setFilteredPoints] = useState(
    initialState.filteredPoints
  );
  const [isAddPointModeEnabled, setAddPointMode] = useState(
    initialState.isAddPointModeEnabled
  );
  const [showPointModal, setShowPointModal] = useState(
    initialState.showPointModal
  );
  const [newPointCoordinates, setNewPointCoordinates] = useState(
    initialState.newPointCoordinates
  );

  // polygons
  const [filteredPolygons, setFilteredPolygons] = useState(
    initialState.filteredPolygons
  );
  const [isAddPolygonModeEnabled, setAddPolygonMode] = useState(
    initialState.isAddPolygonModeEnabled
  );
  const [showPolygonModal, setShowPolygonModal] = useState(
    initialState.showPolygonModal
  );
  const [newPolygonCoordinates, setNewPolygonCoordinates] = useState(
    initialState.newPolygonCoordinates
  );

  // edit point
  const [isEditPointMode, setIsEditPointMode] = useState(
    initialState.isEditPointMode
  );
  const [pointId, setPointId] = useState(initialState.pointId);

  //edit polygon
  const [isEditPolygonMode, setIsEditPolygonMode] = useState(
    initialState.isEditPolygonMode
  );
  const [polygonId, setPolygonId] = useState(initialState.polygonId);

  //environmentsInfo
  const { environmentsInfo, setEnvironmentsInfo } = useContext(
    EnvironmentsInfoContext
  );

  const fetchData = () => {
    const idEnvironment = environmentsInfo.selected.id;

    get(`${POLYGONS_URL}?idEnvironment=${idEnvironment}`).then(({ data }) => {
      setFilteredPolygons(data);
      initialState.polygons = data;
    });

    get(`${POINTS_URL}?idEnvironment=${idEnvironment}`).then(({ data }) => {
      setFilteredPoints(data);
      initialState.points = data;
    });
  };

  const filterByExpert = ({ id_of_expert: idOfExpert }) =>
    filteredItems.items.some(({ id_of_expert }) => idOfExpert === id_of_expert);

  const filterByUser = ({ id_of_user: idOfUser }) =>
    filteredItems.items.some(({ id_of_user }) => idOfUser === id_of_user);

  useEffect(() => {
    if (environmentsInfo.environments.length && !environmentsInfo.selected) {
      setEnvironmentsInfo({
        selected: environmentsInfo.environments[0],
        environments: environmentsInfo.environments,
      });
    }
  }, [environmentsInfo.environments]);

  useEffect(() => {
    if (shouldFetchData && environmentsInfo.selected) {
      fetchData();
      setShouldFetchData(false);
    }
  }, [shouldFetchData, environmentsInfo.selected]);

  useEffect(() => {
    if (filteredItems.items.length) {
      let filteredPolygons = [];
      let filteredPoints = [];

      filteredPolygons = initialState.polygons.filter(filterByExpert);
      filteredPoints = initialState.points.filter(filterByExpert);

      if (filteredItems.isMyObjectsSelectionChecked) {
        const myPolygons = initialState.polygons.filter(filterByUser);
        const myPoints = initialState.points.filter(filterByUser);

        filteredPolygons = [...filteredPolygons, ...myPolygons];
        filteredPoints = [...filteredPoints, ...myPoints];
      }

      filteredPoints = removeObjectDuplicates(filteredPoints, 'Id');
      filteredPolygons = removeObjectDuplicates(filteredPolygons, 'polygonId');

      setFilteredPoints(filteredPoints);
      setFilteredPolygons(filteredPolygons);
    } else {
      setFilteredPoints(initialState.points);
      setFilteredPolygons(initialState.polygons);
    }
  }, [filteredItems]);

  const addGeographicalObjectToMap = ({ latlng: { lat, lng } }) => {
    if (isAddPointModeEnabled) {
      setNewPointCoordinates([lat, lng]);
      setShowPointModal(true);
      return;
    }

    if (isAddPolygonModeEnabled) {
      setNewPolygonCoordinates([...newPolygonCoordinates, { lat, lng }]);
    }
  };

  const finishPolygon = () => {
    setAddPolygonMode(false);

    if (newPolygonCoordinates.length >= 3) {
      setShowPolygonModal(true);
    } else {
      setNewPolygonCoordinates([]);
    }
  };

  return (
    <>
      <LeafletMap
        center={MAP_CENTER_COORDS}
        zoom={6}
        maxZoom={15}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
        onClick={addGeographicalObjectToMap}
      >
        <TileLayer url={OPEN_STREET_MAP_URL} />
        <Polygons
          polygons={filteredPolygons}
          id={polygonId}
          setPolygonId={setPolygonId}
          setIsEditPolygonMode={setIsEditPolygonMode}
          setShowPolygonModal={setShowPolygonModal}
        />
        <Points
          points={filteredPoints}
          pointId={pointId}
          setPointId={setPointId}
          setIsEditPointMode={setIsEditPointMode}
          setShowPointModal={setShowPointModal}
        />
      </LeafletMap>
      {user && (
        <Navbar expand='lg' className='map-options'>
          <Button
            size='sm'
            variant={
              isAddPointModeEnabled ? 'outline-danger' : 'outline-primary'
            }
            onClick={() => setAddPointMode(!isAddPointModeEnabled)}
          >
            {buttonText('точку', isAddPointModeEnabled)}
          </Button>
          <Button
            className='ml-3'
            size='sm'
            variant={
              isAddPolygonModeEnabled ? 'outline-danger' : 'outline-primary'
            }
            onClick={() => setAddPolygonMode(!isAddPolygonModeEnabled)}
          >
            {buttonText('полігон', isAddPolygonModeEnabled)}
          </Button>
          {isAddPolygonModeEnabled && (
            <Button
              className='ml-3'
              size='sm'
              variant='outline-success'
              onClick={finishPolygon}
            >
              Finish polygon
            </Button>
          )}
        </Navbar>
      )}

      <Filtration user={user} setFilteredItems={setFilteredItems} />

      <AddPointModal
        show={showPointModal}
        onHide={() => setShowPointModal(false)}
        setShouldFetchData={setShouldFetchData}
        coordinates={newPointCoordinates}
        isEditPointMode={isEditPointMode}
        setIsEditPointMode={setIsEditPointMode}
        pointId={pointId}
        setPointId={setPointId}
        user={user}
      />
      <AddPolygonModal
        show={showPolygonModal}
        onHide={() => setShowPolygonModal(false)}
        setShouldFetchData={setShouldFetchData}
        setNewPolygonCoordinates={setNewPolygonCoordinates}
        coordinates={newPolygonCoordinates}
        user={user}
        isEditPolygonMode={isEditPolygonMode}
        setIsEditPolygonMode={setIsEditPolygonMode}
        polygonId={polygonId}
        setPolygonId={setPolygonId}
      />
    </>
  );
};
