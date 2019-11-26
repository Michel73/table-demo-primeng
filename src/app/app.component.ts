import { animate, state, style, transition, trigger } from '@angular/animations';
import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, SortMeta } from 'primeng/api';

import { Page } from './model/page';
import { SortObject } from './model/sort-object';
import { User, UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'td-primeng';
  users: User[];
  loading = false;
  cols = [
    {
      field: 'id',
      header: 'Id'
    },
    {
      field: 'firstName',
      header: 'Firstname'
    },
    {
      field: 'lastName',
      header: 'Lastname'
    },
    {
      field: 'email',
      header: 'Email'
    }
  ];

  frozenCols = [
    // {
    // field: 'expander',
    // header: ''
    // },
    {
      field: 'id',
      header: 'Id'
    }
  ];


  scrollableCols = [
    {
      field: 'firstName',
      header: 'Firstname'
    },
    {
      field: 'lastName',
      header: 'Lastname'
    },
    {
      field: 'email',
      header: 'Email'
    }
  ];
  // tslint:disable-next-line
  _selectedColumns: any;
  // selectedColumns = this.scrollableCols;
  expandedRows = {};
  multiSortMeta = new Array<SortMeta>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loading = true;
    // tslint:disable-next-line:no-string-literal
    this.frozenCols['type'] = 'frozen';
    // tslint:disable-next-line:no-string-literal
    this.scrollableCols['type'] = 'scrollable';
    this._selectedColumns = this.scrollableCols;
    // this.userService.model.subscribe(users => this.users = users);
    // this.multiSortMeta.push({ field: 'lastName', order: -1 });
  }

  set selectedColumns(cols: any) {
    this._selectedColumns = cols;
    // tslint:disable-next-line:no-string-literal
    this._selectedColumns['type'] = 'scrollable';
  }

  get selectedColumns() {
    return this._selectedColumns;
  }

  clearGlobalFilter() {
    console.log('Clear global filter clicked')
  }

  lazyExpand(user) {
    console.log('Rowdata: ', user);
    setTimeout(() => {
      user.spitzname = 'Micky Mouse';
    }, 500);
  }

  colReorder(event: any) {
    console.log('colReorder called with event: ', event);
  }

  loadLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortCriterias = new Array<SortObject>();
    if (event.multiSortMeta) {
      event.multiSortMeta.forEach(element => {
        sortCriterias.push(new SortObject(element.field, element.order === 1 ? true : false));
      });
    } else {
      sortCriterias.push(new SortObject('id', true));
    }
    sortCriterias.push(new SortObject('lastName', false));
    const page = new Page(sortCriterias);
    page.pageNumber = event.first / event.rows + 1;
    page.size = event.rows;
    page.globalFilter = event.filters.global ? event.filters.global.value : '';
    const filters = Object.keys(event.filters);
    const singleFilters: KeyValue<string, string>[] = [];
    for (const filter of filters) {
      if (filter !== 'global') {
        singleFilters.push({key: filter, value: event.filters[filter].value});
      }
    }
    page.filter = singleFilters;
    // page.filter = {
    // key: event.filters,
    // value: event.filters
    //  }

    this.userService.getResults(page).subscribe(pagedData => {
      this.users = pagedData.data;
      this.users.forEach((user) => {
        if (this.expandedRows[user.id]) {
          this.lazyExpand(user);
        }
      });
      this.loading = false;
    });
  }
}
