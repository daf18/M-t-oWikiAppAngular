import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Hourly, Weather, WttrObject } from '../../../../common/weather';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-hourly',
  templateUrl: './weather-hourly.component.html',
  styleUrls: ['./weather-hourly.component.css']
})
export class WeatherHourlyComponent implements OnInit, OnDestroy {

  constructor(private weatherService: WeatherService) { }

  public cities: WttrObject[] = [];
  // public hour: Hourly
  //  public hour: Weather = new Object() ; 

  private subscription?: Subscription;

  ngOnInit(): void {
    //TODO s'abonner au weatherSubject dans le weather.service pour obtenir les dernières informations de météo
    this.subscription=this.weatherService.weatherSubject.subscribe({
      next:(value) => this.cities= value
    });
  }
  
  ngOnDestroy(): void {
    //TODO se désabonner du weatherSubject
    this.subscription?.unsubscribe();
  }

}
