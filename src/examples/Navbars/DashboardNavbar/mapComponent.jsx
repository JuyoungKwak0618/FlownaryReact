import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

function MapComponent({ location, onLocationChange }) {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapOptions = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };

    const mapInstance = new kakao.maps.Map(mapContainer.current, mapOptions);
    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (!map || !location) return;

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(location, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        const marker = new kakao.maps.Marker({
          map: map,
          position: coords
        });

        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">${location}</div>`
        });
        infowindow.open(map, marker);

        map.setCenter(coords);

        // 좌표값을 부모 컴포넌트로 전달
        onLocationChange(coords.getLat(), coords.getLng());
      }
    });
  }, [map, location, onLocationChange]);

  return <div ref={mapContainer} style={{ display: 'none' }} />;
}
MapComponent.propTypes = {
  location: PropTypes.string.isRequired,
  onLocationChange: PropTypes.func.isRequired
};
export default MapComponent;


