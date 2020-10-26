import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-visited',
  templateUrl: './visited.component.html',
  styleUrls: ['./visited.component.scss']
})
export class VisitedComponent implements OnInit {
  mArticles: Array<{}> = [];
  mComments: Array<{ id: any, comment: string, user: string, time: Date}>;
  arr = {};
  data = {};
  isHide = {};
  likes = [];

  ngOnInit(): void {
    this.mArticles = JSON.parse(sessionStorage.getItem('visited')) || [];
    this.likes = [];
  }
  addLike(id): void {
    if (!this.likes[id]){
      this.likes[id] = 1;
    } else {
      this.likes[id]++;
    }
  }
}
