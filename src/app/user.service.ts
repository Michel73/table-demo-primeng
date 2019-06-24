import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Page } from './model/page';
import { PagedData } from './model/paged-data';
import { SortObject } from './model/sort-object';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public model = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {
    this.init();
  }

  private init() {
    return this.http.get('http://localhost:3000/users').subscribe((users: User[]) => {
      this.model.next(users);
    });
  }

  public search(
    page: number,
    limit: number,
    sorting: SortObject[],
    globalFilter: string,
    singleFilter: KeyValue<string, string>[]
  ): Observable<User[]> {
    let sortValues: string;
    let sortOrders: string;

    sorting.forEach(sortCriteria => {
      sortValues = sortValues ? `${sortValues},${sortCriteria.value}` : sortCriteria.value;
      sortOrders = sortOrders ? `${sortOrders},${sortCriteria.ascending ? 'asc' : 'desc'}` : sortCriteria.ascending ? 'asc' : 'desc';
    });
    globalFilter = globalFilter ? `&q=${globalFilter}` : '';
    // const filter = singleFilter ? `&${singleFilter.key}_like=${singleFilter.value}` : '';
    let singleFilters = '';

    for (const filter of singleFilter) {
      singleFilters = `${singleFilters}&${filter.key}_like=${filter.value}`;
    }
    // tslint:disable-next-line:max-line-length
    const url = `http://localhost:3000/users?_page=${page}&_limit=${limit}&_sort=${sortValues}&_order=${sortOrders}${globalFilter}${singleFilters}`;

    console.log(`Backend request: ${url}`);
    return this.http.
      get(url).
      pipe(map((users: User[]) => users));
  }

  public getUsers(): User[] {
    return this.model.value;
  }

  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns An observable containing the employee data
   */
  public getResults(page: Page): Observable<PagedData<User>> {
    // return this.model.pipe(map(data => this.getPagedData(page)));
    // return this.model.pipe(map(data => {
    // return this.getPagedData(page);
    return this.getPagedData(page);
    // return Observable.create((observer: Observer<PagedData<User>>) => {
    // setTimeout(() => {
    // observer.next(this.getPagedData(page));
    // }, 100);
    // });
    // }));
  }

  /**
   * Package companyData into a PagedData object based on the selected Page
   * @param page The page data used to get the selected data from companyData
   * @returns An array of the selected data and page
   */
  private getPagedData(page: Page): Observable<PagedData<User>> {
    const pagedData = new PagedData<User>();
    page.totalElements = 1000;
    page.totalPages = page.totalElements / page.size;
    // const start = page.pageNumber * page.size;
    // const end = Math.min((start + page.size), page.totalElements);
    console.log('pageNumber: ', page.pageNumber, 'size: ', page.size);
    return this.search(page.pageNumber, page.size, page.sorting, page.globalFilter, page.filter).pipe(map(users => {
      for (const user of users) {
        pagedData.data.push(user);
      }
      pagedData.page = page;
      return pagedData;
    }));
  }

}
