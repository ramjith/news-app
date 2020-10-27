import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsApiService } from '../../service/news-api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { CommentsDialogComponent } from '../dialog/comments-dialog';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {

  mArticles: Array<{}> = [];
  mComments: Array<{ id: any, comment: string, user: string, parent: number, time: Date}>;
  commentsArr: [];
  newsFeed: any;
  arr = {};
  start = 0;
  commentStart = 0;
  fetchLength = 0;
  maxPerSroll = 10;
  scrollDistance = 1;
  scrollUpDistance = 2;
  data = {};
  destroy$: Subject<boolean> = new Subject<boolean>();
  isHide = {};
  toggle: boolean;
  visited = [];
  visitedIds = [];
  bookmarkIcon = {};
  bookmarks = [];
  updates: [];
  id: number;
  noComments: {};
  likes = {};
  noArticle: boolean;

  constructor(private newsapi: NewsApiService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog){
    this.mComments = [];
    this.updates = [];
    this.noComments = [];
    this.isHide = [];
    this.likes = [];
    this.noArticle = false;
  }

  ngOnInit(): void {
    this.visitedIds = JSON.parse(sessionStorage.getItem('visitedIds')) || [];
    this.visited = JSON.parse(sessionStorage.getItem('visited')) || [];
    this.newsapi.getTopStories()
      .pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.newsFeed = data;
      this.addItems('push');
    });

    this.id = setInterval(() => {
      if (this.bookmarks && this.bookmarks.length > 0) {
        this.checkForUpdates();
      }
    }, 5000);
  }

  addItems(method): any {
    this.newsFeed = _.difference(this.newsFeed, this.visitedIds);
    this.fetchLength = this.start + this.maxPerSroll;
    while (this.start < this.fetchLength) {
      this.visitedIds.push(this.newsFeed[this.start]);
      this.newsapi.getArticlesByID(this.newsFeed[this.start]).subscribe((res: any) => {
        if (res !== null) {
          this.isHide[res.id] = true;
          this.bookmarkIcon[res.id] = 'bookmark_border';
          this.mArticles.push(res);
          this.visited.push(res);
        } else {
          this.noArticle = true;
        }
      });
      this.start++;
    }
  }

  appendItems(): void {
    this.addItems('push');
  }

  onScrollDown(): void {
    this.appendItems();
    sessionStorage.setItem('visited', JSON.stringify(this.visited));
    sessionStorage.setItem('visitedIds', JSON.stringify(this.visitedIds));
  }

  htmlDecode(input): string{
    return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
  }

  showComments(id, comments): void{
    this.commentStart = 0;
    this.commentsArr = [];
    this.isHide[id] = !this.isHide[id];
    if (comments && comments.length > 0) {
      while (this.commentStart < comments.length) {
        this.getComments(comments[this.commentStart], false);
        this.commentStart++;
      }
      this.noComments[id] = false;
    } else {
      this.noComments[id] = true;
    }
  }
  bookmark(article): void{
    this.bookmarkIcon[article.id] = 'bookmark';
    this.bookmarks.push(article);
  }
  checkForUpdates(): void {
    this.bookmarks.forEach (el => {
      this.newsapi.getArticlesByID(el.id).subscribe((res: any) => {
        if (res.kids) {
          const kids = res.kids;
          const match = _.find(this.mArticles, (o) => {
            return o.id === el.id;
          });
          if (kids.length > match.kids.length) {
            //const newsComments = kids.splice(1, 1);
            const newsComments = _.difference(kids, match.kids);
            for (const nc of newsComments) {
              const snackbarRef = this.snackBar.open('New comments added to -' +  match.title, 'view', {
                duration: 20000,
              });
              const data = { id: nc, newsTitle: match.title }
              snackbarRef.onAction().subscribe(() => {
                this.showNewComments(data);
              });
            }
            _.concat(match.kids, newsComments);
          }
        }
      });
    });
  }

  getComments(data, addComment): void {
    let id;
    if (typeof data === 'object'){
      id = data.id;
    } else {
      id = data;
    }
    this.newsapi.getArticlesByID(id).subscribe((res: any) => {
      if (!res.deleted) {
        this.mComments.push({
          id,
          comment: this.htmlDecode(res.text),
          user: res.by,
          parent: res.parent,
          time: new Date(res.time)
        });

        if (addComment) {
          this.openDialog(data.newsTitle);
        }
      }
    });
  }

  showNewComments(data): void {
    const add = true;
    this.getComments(data, add);
  }
  openDialog(title): void {
    const dialogRef = this.dialog.open(CommentsDialogComponent,{
      data: {
        comments: this.mComments,
        title
      }
    });
  }
  addLike(id): void {
    if (!this.likes[id]){
      this.likes[id] = 1;
    } else {
      this.likes[id]++;
    }
  }
}
