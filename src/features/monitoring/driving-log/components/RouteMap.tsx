import { useEffect, useRef } from 'react';
import type { LatLng } from '../types';

declare global {
  interface Window {
    kakao: any;
  }
}

type RouteMapProps = {
  traceLogs: LatLng[];
};

const RouteMap = ({ traceLogs }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const DEFAULT_MAP_LEVEL = 5;

  useEffect(() => {
    if (!traceLogs.length || !window.kakao || !mapRef.current) return;

    window.kakao.maps.load(() => {
      const points = traceLogs.map(
        log => new window.kakao.maps.LatLng(parseFloat(log.lat) / 1_000_000, parseFloat(log.lon) / 1_000_000)
      );

      const center = points[Math.floor(points.length / 2)];

      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: DEFAULT_MAP_LEVEL,
      });

      const polyline = new window.kakao.maps.Polyline({
        path: points,
        strokeWeight: 5,
        strokeColor: '#007bff',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
      });
      polyline.setMap(map);

      const bounds = new window.kakao.maps.LatLngBounds();
      points.forEach(p => bounds.extend(p));
      map.setBounds(bounds);

      // 출발 마커
      new window.kakao.maps.Marker({
        position: points[0],
        map,
        image: new window.kakao.maps.MarkerImage('/icon/startmarker.svg', new window.kakao.maps.Size(50, 50)),
      });

      // 도착 마커
      new window.kakao.maps.Marker({
        position: points[points.length - 1],
        map,
        image: new window.kakao.maps.MarkerImage('/icon/endmarker.svg', new window.kakao.maps.Size(50, 50)),
      });
    });
  }, [traceLogs]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />;
};

export default RouteMap;
