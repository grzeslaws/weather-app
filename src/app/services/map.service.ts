import { Injectable, ViewContainerRef } from '@angular/core';
import { Feature, View } from 'ol';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { default as Map } from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Style } from 'ol/style';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: Map;
  view: View;
  markersLayers: VectorLayer;
  markersSource: VectorSource;

  private markerStyle = (): Style => {
    return new Style({
      image: new Circle({
        radius: 4,
        fill: new Fill({ color: '#4EC9B0' }),
      }),
    });
  };

  init(mapContainer: ViewContainerRef) {
    this.view = new View({
      center: [0, 0],
      zoom: 2,
    });

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: mapContainer.element.nativeElement,
      view: this.view,
    });

    this.markersSource = new VectorSource();

    this.markersLayers = new VectorLayer({
      source: this.markersSource,
      zIndex: 4,
    });

    this.map.addLayer(this.markersLayers);
  }

  createMarker = (lon: number, lat: number, id: string): Feature => {
    const marker = new Feature(new Point(fromLonLat([lon, lat])));
    marker.setStyle(this.markerStyle);
    marker.setProperties({ id, markerStyle: this.markerStyle });
    this.markersSource.addFeature(marker);
    return marker;
  };

  removeMarker(markerId: string) {
    const marker = this.markersSource.getFeatures().find((marker) => {
      const { id } = marker.getProperties();
      return id === markerId;
    });
    this.markersSource.removeFeature(marker);
  }

  fitMapToLocation(marker: Feature) {
    const extent = marker.getGeometry().getExtent();
    this.map.getView().fit(extent, { maxZoom: 4, duration: 500 });
  }

  fitMapToLocations() {
    const features = this.markersLayers.getSource().getFeatures();
    if (features.length) {
      const locationsGeometry = this.markersLayers.getSource().getExtent();
      this.view.fit(locationsGeometry, { maxZoom: 4, duration: 500 });
    }
  }
}
