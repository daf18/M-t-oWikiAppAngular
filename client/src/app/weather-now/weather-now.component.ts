import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WttrObject } from '../../../../common/weather';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-now',
  templateUrl: './weather-now.component.html',
  styleUrls: ['./weather-now.component.css']
})
export class WeatherNowComponent implements OnInit, OnDestroy {

  constructor(private weatherService: WeatherService) { }

  public cities: WttrObject[] = [];
  private subscription?: Subscription;

  ngOnInit(): void {
    //TODO s'abonner au weatherSubject dans le weather.service pour obtenir les dernières informations de météo
    this.subscription = this.weatherService.weatherSubject.subscribe({
      next:(value) => this.cities= value
    });

  }

  ngOnDestroy(): void {
    //TODO se désabonner du weatherSubject
    this.subscription?.unsubscribe();
  }

}

