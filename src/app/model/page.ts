import { KeyValue } from '@angular/common';

import { SortObject } from './sort-object';

/**
 * An object used to get page information from the server
 */
export class Page {
  // The number of elements in the page
  size = 0;
  // The total number of elements
  totalElements = 0;
  // The total number of pages
  totalPages = 0;
  // The current page number
  pageNumber = -1;
  sorting: SortObject[];
  globalFilter: any;
  filter: KeyValue<string, string>[];

  constructor(sorting: SortObject[]) {
    this.sorting = sorting;
  }
}
