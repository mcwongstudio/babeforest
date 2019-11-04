import React, { Component } from 'react';
import { Map, Marker } from 'react-amap';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapZoom: 17,
      mapKey: '2115aab3f4a208e309db4ffbb4dd2ce2',
      status: {
        zoomEnable: true,
        dragEnable: true,
      },
      mapCenter: [118.11971873044969, 24.476990115740396],
      mapMake: [118.11971873044969, 24.476990115740396],
    };
  }

  render() {
    const {
      mapCenter,
      mapMake,
      mapZoom,
      mapKey,
      status,
    } = this.state;
    return (
      <div style={{ width: '100%', height: 'calc(312 / 32 * 1rem)' }}>
        <Map amapkey={mapKey} center={mapCenter} zoom={mapZoom} status={status}>
          <Marker position={mapMake} />
        </Map>
      </div>
    );
  }
}
