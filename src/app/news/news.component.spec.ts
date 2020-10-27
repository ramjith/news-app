import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewsComponent } from './news.component';
import { NewsApiService } from '../../service/news-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('ui-noninteractive - SnackbarUtComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewsComponent],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule, BrowserAnimationsModule],
      providers: [NewsApiService]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
