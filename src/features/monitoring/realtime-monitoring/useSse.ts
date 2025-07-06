// src/hooks/useSse.js 또는 src/hooks/useSse.ts

import { useEffect, useState } from 'react';

/**
 * SSE (Server-Sent Events) 연결을 위한 커스텀 React 훅
 * @param {string} url - SSE 엔드포인트 URL
 * @param {string} eventName - 구독할 이벤트 이름 (서버에서 SseEmitter.event().name()으로 설정한 이름)
 * @param {function} onMessage - 이벤트 메시지를 받았을 때 실행할 콜백 함수
 */
const SSE_URL = 'http://localhost:8080/api/v1/sse/gps';

export function useSse(eventName, onMessage) {
  useEffect(() => {
    console.log('시작');

    // 1. EventSource 객체 생성
    // 브라우저가 자동으로 재연결을 시도해 줌
    const eventSource = new EventSource(SSE_URL);

    // 2. 특정 이벤트 이름에 대한 리스너 등록
    eventSource.addEventListener(eventName, event => {
      try {
        console.log('event > ', event);

        // 서버에서 보낸 data는 event.data에 담겨 있음
        const parsedData = JSON.parse(event.data);
        console.log(`📡 SSE 메시지 수신 - 이벤트: ${eventName}, 데이터:`, parsedData);
        onMessage(parsedData); // 받은 데이터를 처리하는 콜백 함수 호출
      } catch (error) {
        console.error('📛 SSE 데이터 파싱 실패:', error);
      }
    });

    // 3. 연결이 열렸을 때 (선택 사항)
    eventSource.onopen = () => {
      console.log('✅ SSE 연결 성공');
    };

    // 4. 오류 발생 시 (네트워크 오류, CORS 등)
    eventSource.onerror = error => {
      console.error('❌ SSE 연결 오류:', error);
      // 브라우저가 자동으로 재연결을 시도하므로 별도 로직은 필요 없을 수 있음
    };

    // 5. 컴포넌트가 언마운트될 때 연결 정리 (가장 중요!)
    return () => {
      console.log('⚠️ SSE 연결 종료');
      eventSource.close();
    };
  }, [eventName, onMessage]);
}
