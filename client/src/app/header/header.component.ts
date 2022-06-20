import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public recherche: string = '';
  

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {  
  }

  public searchWeather(){
    this.weatherService.updateWeather(this.recherche).subscribe({
      error:(err) => console.error(err)
    });
  }


}
