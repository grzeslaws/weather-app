import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocationComponent } from './components/location/location.component';

@NgModule({
  declarations: [AppComponent, LocationComponent],
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule],
  providers: [], 
  bootstrap: [AppComponent],
})
export class AppModule {}
