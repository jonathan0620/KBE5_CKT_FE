import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = 'http://localhost:8090/ws'; // 혹은 import.meta.env.VITE_API_BASE_URL 활용

interface GpsUpdate {
  vehicleId: number;
  lat: string;
  lon: string;
  spd: string;
  ang: string;
}

export function useGpsWebSocket(onGpsUpdate: (data: GpsUpdate) => void) {
  useEffect(() => {
    console.log('start');
    const socket = new SockJS(WS_BASE_URL);
    const token = localStorage.getItem('accessToken');

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {}, // 토큰이 없으면 빈 헤더로 처리
      debug: str => console.debug(str),
      reconnectDelay: 5000,
    });

    // ✅ 연결 성공
    client.onConnect = frame => {
      console.log('✅ [STOMP CONNECTED]', frame);

      client.subscribe('/topic/gps', message => {
        try {
          const data: GpsUpdate = JSON.parse(message.body);
          console.log('📡 실시간 수신:', data);
          onGpsUpdate(data);
        } catch (e) {
          console.error('📛 JSON 파싱 실패:', message.body);
        }
      });
    };

    // ❌ STOMP 오류
    client.onStompError = frame => {
      console.error('❌ [STOMP ERROR]', frame.headers['message']);
      console.error('🔻 상세:', frame.body);
    };

    // ❌ WebSocket 오류
    client.onWebSocketError = event => {
      console.error('❌ [WebSocket ERROR]', event);
    };

    // ❌ 연결 끊김
    client.onDisconnect = frame => {
      console.warn('⚠️ [STOMP DISCONNECTED]', frame);
    };

    console.log('🟡 client.activate() 호출 전');
    client.activate();
    console.log('🟢 client.activate() 호출됨');

    return () => {
      console.log('close');

      client.deactivate();
    };
  }, [onGpsUpdate]);
}
