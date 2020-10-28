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
  isLoaded: boolean;
  mArticles: Array<{id: any, kids: []}> = [];
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
  visited = [];
  visitedIds = [];
  bookmarkIcon = {};
  bookmarks = [];
  updates: [];
  intervalId: number;
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
    this.isLoaded = false;
  }

  ngOnInit(): void {
    this.visitedIds = JSON.parse(sessionStorage.getItem('visitedIds')) || [];
    this.visited = JSON.parse(sessionStorage.getItem('visited')) || [];
    this.newsapi.getTopStories()
      .pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.newsFeed = data;
      this.addNewsHeadlines();
    });

    this.intervalId = setInterval(() => {
      if (this.bookmarks && this.bookmarks.length > 0) {
        this.checkForUpdates();
      }
    }, 300000);
  }
  /**
   * Add news headlines
   * Get the news headlines from Hacker News API and display it
   */
  addNewsHeadlines(): any {
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
        this.isLoaded = true;
      });
      this.start++;
    }
  }

  /**
   * On Scrolldown add more headlines using ngx-infinite-scroll
   * Also add viewed headlines to session storage to view it in a separate view
   */
  onScrollDown(): void {
    this.addNewsHeadlines();
    sessionStorage.setItem('visited', JSON.stringify(this.visited));
    sessionStorage.setItem('visitedIds', JSON.stringify(this.visitedIds));
  }

  htmlDecode(input): string{
    return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
  }

  /**
   * Show all comments on click
   *
   */
  showComments(id, comments): void{
    this.commentStart = 0;
    this.commentsArr = [];
    this.isHide[id] = !this.isHide[id];
    if (comments && comments.length > 0) {
      while (this.commentStart < comments.length) {
        this.getComments(comments[this.commentStart], {});
        this.commentStart++;
      }
      this.noComments[id] = false;
    } else {
      this.noComments[id] = true;
    }
  }
  /**
   * Bookmark an article
   * @param: {Object} article -information about the article
   */
  bookmark(article): void{
    this.bookmarkIcon[article.id] = 'bookmark';
    this.bookmarks.push(article);
  }

  /**
   * Check for comments update every 5 minutes
   * if new comments available, show a notification and on click of it show the comments
   */
  checkForUpdates(): void {
    this.bookmarks.forEach (el => {
      this.newsapi.getArticlesByID(el.id).subscribe((res: any) => {
        if (res.kids) {
          const kids = res.kids;
          const match = _.find(this.mArticles, (o) => {
            return o.id === el.id;
          });
          if (match && match.kids.length > 0 && kids.length > match.kids.length) {
            const newsComments = _.difference(kids, match.kids);
            for (const id of newsComments) {
              const snackbarRef = this.snackBar.open('New comments added to -' +  match.title, 'view', {
                duration: 20000,
              });
              const data = { add: true, title: match.title };
              snackbarRef.onAction().subscribe(() => {
                this.getComments(id, data);
              });
            }
            // Update the article with new comments
            for (const i in this.mArticles) {
              if (this.mArticles[i].id === el.id) {
                this.mArticles[i].kids = kids;
                break;
              }
            }
          }
        }
      });
    });
  }

  /**
   * Get comments
   * if new comments available, show a notification and on click of it
   * show the comments on a modal
   */
  getComments(id, obj): void {
    this.newsapi.getArticlesByID(id).subscribe((res: any) => {
      if (!res.deleted) {
        if (!_.find(this.mComments, (o) => { return o.id === res.id; })) {
          this.mComments.push({
            id,
            comment: this.htmlDecode(res.text),
            user: res.by,
            parent: res.parent,
            time: new Date(res.time)
          });

          if (obj && obj.add) {
            this.openDialog(obj.title);
          }
        }
      }
    });
  }
  /**
   * Open modal & show comments
   *
   */
  openDialog(title): void {
    const dialogRef = this.dialog.open(CommentsDialogComponent, {
      data: {
        comments: this.mComments,
        title
      }
    });
  }

  /**
   * Increment like count on click
   *
   */
  addLike(id): void {
    if (!this.likes[id]){
      this.likes[id] = 1;
    } else {
      this.likes[id]++;
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
