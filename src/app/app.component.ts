import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Location } from './app.models';
import { MapService } from './services/map.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private mapService: MapService
  ) {}

  private toUnsubscribe = new Subject<void>();

  readonly openweathermapConfig = {
    apiKey: 'c157dc49cf4020a19e28145e009ce33b',
    url: 'https://api.openweathermap.org/data/2.5/',
    lang: 'pl',
    units: 'metric',
  };

  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainer: ViewContainerRef;

  locationForm: FormGroup;
  locations: Location[] = [];
  notFoundError: string;

  private initLocations() {
    this.locations = this.getLocationFromSessionStorage();

    if (this.locations && this.locations.length) {
      this.locations.forEach((location) => {
        const { coord, id } = location;
        this.mapService.createMarker(coord.lon, coord.lat, id);
      });
    }

    this.mapService.fitMapToLocations();
  }

  private saveLocationsInSessionStorage(locations: Location[]) {
    const locationStringify = JSON.stringify(locations);
    sessionStorage.setItem('locations', locationStringify);
  }

  private getLocationFromSessionStorage(): Location[] {
    const stringifyLocations = sessionStorage.getItem('locations');
    return JSON.parse(stringifyLocations);
  }

  private setLocation = (location: Location) => {
    const { coord, id } = location;
    const { lat, lon } = coord;
    const marker = this.mapService.createMarker(lon, lat, id);
    this.mapService.fitMapToLocation(marker);
    this.locations.push(location);
    this.saveLocationsInSessionStorage(this.locations);
    this.locationForm.reset();
  };

  ngOnInit(): void {
    this.locationForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.locationForm.valueChanges
      .pipe(takeUntil(this.toUnsubscribe))
      .subscribe(() => (this.notFoundError = undefined));
  }

  ngAfterViewInit(): void {
    this.mapService.init(this.mapContainer);
    setTimeout(() => {
      this.initLocations();
    });
  }

  getError(name: string): boolean {
    return (
      this.locationForm.get(name).errors && this.locationForm.get(name).touched
    );
  }

  saveLocation(e: Event) {
    e.preventDefault();
    const searchLocation = this.locationForm.get('name').value;
    if (!searchLocation) {
      return;
    }

    this.http
      .get<Location>(
        `${this.openweathermapConfig.url}weather?q=${searchLocation}&units=${this.openweathermapConfig.units}&lang=${this.openweathermapConfig.lang}&APPID=${this.openweathermapConfig.apiKey}`
      )
      .pipe(takeUntil(this.toUnsubscribe))
      .subscribe(this.setLocation, ({ error }) => {
        this.notFoundError = error.message;
      });
  }

  removeMarker(markerId: string) {
    this.mapService.removeMarker(markerId);
    this.locations = this.locations.filter(
      (location) => location.id !== markerId
    );
    this.mapService.fitMapToLocations();
    this.saveLocationsInSessionStorage(this.locations);
    this.locationForm.markAsUntouched();
  }

  ngOnDestroy(): void {
    this.toUnsubscribe.next();
  }
}
