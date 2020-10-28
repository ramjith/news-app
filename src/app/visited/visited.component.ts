import { Component, OnInit } from '@angular/core';
import { NewsComponent } from '../news/news.component';
import {NewsApiService} from '../../service/news-api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-visited',
  templateUrl: './visited.component.html',
  styleUrls: ['./visited.component.scss']
})
export class VisitedComponent extends NewsComponent implements OnInit{
  mArticles: Array<{ id: any, kids: [] }> = [];
  mComments: Array<{ id: any, comment: string, user: string, parent: number, time: Date}>;
  arr = {};
  data = {};
  isHide = {};
  visited = [];
  bookmarkIcon = {};
  updates: [];
  noComments: {};
  likes = {};
  noArticle: boolean;
  constructor( newsapi: NewsApiService,
               snackBar: MatSnackBar,
               dialog: MatDialog) {
    super(newsapi, snackBar, dialog);
    this.mComments = [];
    this.updates = [];
    this.noComments = [];
    this.isHide = [];
    this.likes = [];
    this.noArticle = false;
  }

  ngOnInit(): void {
    this.mArticles = JSON.parse(sessionStorage.getItem('visited')) || [];
    if (this.mArticles.length > 0){
      for (const a of this.mArticles) {
        this.isHide[a.id] = true;
        this.bookmarkIcon[a.id] = 'bookmark_border';
      }
    }
  }

}
