import { Component, HostListener, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LocalServicesService } from './services/local-services.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'askEdii';
  question = '';
  showAdditionalInfo: boolean = true;
  showHotQuestion: boolean = false;
  showLatestQuestion: boolean = false;

  allHotQuestion = [{ "question": '' }];
  askEdiiReq: any = {};
  askEdiiRes: any = {};
  askEdiiUrl: string = '';
  getHotQuestionReq: any = {};
  getHotQuestionRes: any = {};
  getHotQuestionUrl: string = '';

  getLatestQuestionReq: any = {};
  getLatestQuestionRes: any = {};
  getLatestQuestionUrl: string = '';
  allLatestQuestion = [{ "question": '' }];

  constructor(
    public http: HttpClient,
    private spinner: NgxSpinnerService,
    public localService: LocalServicesService,
  ) {
    this.localService.getAskEdiiIP();
  }

  replaceNewlines(content: string): string {
    return content.replace(/\n/g, '<br>');
  }

  ngOnInit() {
    this.question = "";
    this.askQuestionStp1(this.question);

    setTimeout(() => {
      this.callRecentQuestionAndHotQuestion();
    }, 2000);

    const hotQuestionFromStorage = localStorage.getItem('allHotQuestion');
    if (hotQuestionFromStorage !== null) {
      this.allHotQuestion = JSON.parse(hotQuestionFromStorage);
      this.showHotQuestion = true;
    }

    const latestQuestionFromStorage = localStorage.getItem('allLatestQuestion');
    if (latestQuestionFromStorage !== null) {
      this.allLatestQuestion = JSON.parse(latestQuestionFromStorage);
      this.showLatestQuestion = true;
    }

    this.localService.getAskEdiiIP();
  }


  callRecentQuestionAndHotQuestion() {
    this.getHotQuestion();
    this.getLatestQuestion();
    setTimeout(() => {
      this.callRecentQuestionAndHotQuestion();
    }, 30000);
  }

  @HostListener('document:keypress', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.askQuestionStp1(this.question);
    }
  }

  askQuestionStp1(question: string) {
    this.showAdditionalInfo = true;
    if (this.localService.validateValue(question)) {
      this.askQuestionStp2(question);
    }
    else {
      this.showAdditionalInfo = false;
    }
  }


  askQuestionStp2(question: string) {
    this.question = question;
    this.askEdiiRes = {};
    this.askEdiiReq.question = question;
    this.askEdiiReq.ip = this.localService.sourceIPAddress;
    this.spinner.show();
    this.askEdiiUrl = environment.url + 'askQuestion';
    this.http.post(this.askEdiiUrl, this.askEdiiReq)
      .subscribe(res => {
        this.askEdiiRes = res;
        if (this.askEdiiRes.status == 'success') {
          this.spinner.hide();
          this.getLatestQuestion();
        }
        else {
          alert(this.askEdiiRes.status);
          this.showAdditionalInfo = false;
          this.spinner.hide();
        }
      }, () => {
        this.showAdditionalInfo = false;
        this.spinner.hide();
      });
  }
  
  reset() {
    this.showAdditionalInfo = false;
    this.question = '';
    this.askEdiiRes.lastUpdatedOn = '';
    this.askEdiiRes.response = '';
  }

  getHotQuestion() {
    this.getHotQuestionReq.ip = this.localService.sourceIPAddress;
    this.getHotQuestionRes = {};
    this.getHotQuestionUrl = environment.url + 'getHotQuestion';
    this.http.post(this.getHotQuestionUrl, this.getHotQuestionReq)
      .subscribe(res => {
        this.getHotQuestionRes = res;
        if (this.getHotQuestionRes.status == 'success') {
          this.showHotQuestion = false;
          this.allHotQuestion = this.getHotQuestionRes.hotQuestion;
          this.showHotQuestion = true;
          localStorage.setItem('allHotQuestion', JSON.stringify(this.allHotQuestion));
        }
        else {
        }
      }, () => {

      });
  }

  getLatestQuestion() {
    this.getLatestQuestionRes = {};
    this.getLatestQuestionReq.ip = this.localService.sourceIPAddress;
    this.getLatestQuestionUrl = environment.url + 'getLatestQuestion';
    this.http.post(this.getLatestQuestionUrl, this.getLatestQuestionReq)
      .subscribe(res => {
        this.getLatestQuestionRes = res;
        if (this.getLatestQuestionRes.status == 'success') {
          this.showLatestQuestion = false;
          this.allLatestQuestion = this.getLatestQuestionRes.latestQuestion;
          this.showLatestQuestion = true;
          localStorage.setItem('allLatestQuestion', JSON.stringify(this.allLatestQuestion));
        }
        else {

        }
      }, () => {

      });
  }

}


