import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalServicesService {
  askEdiiRes: any = {};
  sourceIPAddress:string='';
  constructor(
    public http: HttpClient,
  ) { }

  validateValue(val:any) {
    if (val == undefined || val == null || val == 'undefined' || val == 'null' || val == 'NaN' || val.toString().length < 1 || Number.isNaN(val)) {
      return (false);
    } else {
      return (true);
    }
  }
  getAskEdiiIP() {
    this.http.get('https://api.ipify.org/?format=json')
      .subscribe(res10 => {
        this.askEdiiRes=res10;
        this.sourceIPAddress= this.askEdiiRes.ip;
      })
  }

}
