import {
  Component,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookmarksService } from '../../core/bookmarks.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/route.animations';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { DictionaryEntryExportFormat } from '@mothertongues/search';
@Component({
  selector: 'mtd-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['../../shared/layout/single/single.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksComponent implements OnDestroy {
  displayNav = true;
  $bookmarks: BehaviorSubject<DictionaryEntryExportFormat[]>;
  edit = false;
  unsubscribe$ = new Subject<void>();
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  show?: string;
  constructor(
    public bookmarkService: BookmarksService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.$bookmarks = bookmarkService.$bookmarks;
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.show = params.show;
        this.ref.markForCheck();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  toggleEdit() {
    this.edit = !this.edit;
  }
}
