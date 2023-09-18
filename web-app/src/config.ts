class Setting {
  env: string;
  // apiServerUrl: string;
  p2pServerUrl: string;

  mapCenterLat: number;
  mapCenterLng: number;

  constructor() {
    this.env = process.env.REACT_APP_ENV || EMPTY;
    this.p2pServerUrl = process.env.REACT_APP_DOCUMENT_API_URL || EMPTY;
    this.mapCenterLat = Number(process.env.REACT_APP_MAP_CENTER_LAT || 0);
    this.mapCenterLng = Number(process.env.REACT_APP_MAP_CENTER_LNG || 0);
  }
}

const EMPTY: string = '';

const config: Setting = new Setting();

export { Setting, config };
