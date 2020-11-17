import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '../../app.models';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {
  @Input() location: Location;
  @Output() remove = new EventEmitter<string>();

  removeMarker(markerId: string) {
    this.remove.next(markerId);
  }

  upperCaseFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
}
