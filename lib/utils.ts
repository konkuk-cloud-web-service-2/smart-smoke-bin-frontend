import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 위도(latitude)와 경도(longitude) 값을
 * 0-100% 범위의 {x, y} 좌표 객체로 변환합니다.
 * (JSON 데이터의 최소/최대값이 내장되어 있습니다.)
 *
 * @param {number} latitude - Y값 (위도)
 * @param {number} longitude - X값 (경도)
 * @returns {{x: number, y: number}} 0~100% 사이의 x, y 좌표
 */

export function convertCoordsToXY(
  latitude: number,
  longitude: number
): { x: number; y: number } {
  // JSON 데이터 기반 최소/최대값 상수
  const minLat = 37.4979;
  const maxLat = 37.5636;
  const minLon = 126.9226;
  const maxLon = 127.1028;
  const padding = 0.1; // 10% 여백

  // Y (Latitude) 계산
  let y_val = 50; // 기본값
  const rangeLat = (maxLat - minLat) * (1 + padding * 2);
  if (rangeLat !== 0) {
    y_val = ((latitude - minLat) / rangeLat) * 100 + padding * 100;
  }

  // X (Longitude) 계산
  let x_val = 50; // 기본값
  const rangeLon = (maxLon - minLon) * (1 + padding * 2);
  if (rangeLon !== 0) {
    x_val = ((longitude - minLon) / rangeLon) * 100 + padding * 100;
  }

  return {
    y: Math.max(5, Math.min(95, y_val)), // 5% ~ 95% 사이로 제한
    x: Math.max(5, Math.min(95, x_val)), // 5% ~ 95% 사이로 제한
  };
}
