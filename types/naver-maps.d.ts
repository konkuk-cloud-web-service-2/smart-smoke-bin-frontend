// 네이버 지도 API 타입 정의
declare namespace naver.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  enum Position {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    LEFT_CENTER,
    CENTER,
    RIGHT_CENTER,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT,
  }

  interface MapOptions {
    center?: LatLng;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: {
      position?: Position;
    };
    mapTypeControl?: boolean;
    scaleControl?: boolean;
    logoControl?: boolean;
  }

  class Map {
    constructor(element: HTMLElement, options: MapOptions);
    setCenter(coord: LatLng): void;
    getCenter(): LatLng;
    setZoom(level: number, useEffect?: boolean): void;
    getZoom(): number;
    destroy(): void;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    title?: string;
    icon?: {
      content?: string;
      anchor?: Point;
      url?: string;
      size?: Point;
    };
    clickable?: boolean;
    draggable?: boolean;
    visible?: boolean;
    zIndex?: number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setPosition(position: LatLng): void;
    getPosition(): LatLng;
    setMap(map: Map | null): void;
    getMap(): Map | null;
    setTitle(title: string): void;
    getTitle(): string;
    setIcon(icon: MarkerOptions["icon"]): void;
    setVisible(visible: boolean): void;
  }

  interface InfoWindowOptions {
    content: string | HTMLElement;
    maxWidth?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    anchorSize?: Point;
    anchorSkew?: boolean;
    anchorColor?: string;
    pixelOffset?: Point;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, anchor: Marker | LatLng): void;
    close(): void;
    getMap(): Map | null;
    setContent(content: string | HTMLElement): void;
    getContent(): string | HTMLElement;
  }

  class Event {
    static addListener(
      target: any,
      eventName: string,
      listener: (...args: any[]) => void
    ): void;
    static removeListener(listener: any): void;
  }
}

interface Window {
  naver: typeof naver;
}
