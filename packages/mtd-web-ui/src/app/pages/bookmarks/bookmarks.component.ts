import {
  Component,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BookmarksService,
  ROUTE_ANIMATIONS_ELEMENTS
} from '../../core/core.module';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DictionaryEntryExportFormat } from '@mothertongues/search';
@Component({
  selector: 'mtd-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['../../shared/layout/single/single.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarksComponent implements OnDestroy {
  displayNav = true;
  bookmarks: DictionaryEntryExportFormat[] = [];
  edit = false;
  unsubscribe$ = new Subject<void>();
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  show?: string;
  constructor(
    public bookmarkService: BookmarksService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        this.show = params.show;
        this.ref.markForCheck();
      });
    this.bookmarkService.bookmarks
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(bookmarks => {
        this.bookmarks = bookmarks;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  toggleEdit() {
    this.edit = !this.edit;
  }
}
