import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  constructor(private http: HttpClient) { }
  getTopStories() {
    return this.http.get('https://hacker-news.firebaseio.com/v0/topstories.json');
  }
  getArticlesByID (id: String){
    return this.http.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  }
  getUpdates() {
    return this.http.get(`https://hacker-news.firebaseio.com/v0/updates.json`);
  }
}
