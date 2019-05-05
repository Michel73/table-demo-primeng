import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

import { Page } from './model/page';
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
  columns = ['firstName', 'lastName', 'email'];

  constructor(private userService: UserService) { }

  ngOnInit() {
    // this.userService.model.subscribe(users => this.users = users);
  }

  loadLazy(event: LazyLoadEvent) {
    this.loading = true;
    const page = new Page();
    page.pageNumber = event.first / event.rows + 1;
    page.size = event.rows;
    this.userService.getResults(page).subscribe(pagedData => {
      this.users = pagedData.data;
      this.loading = false;
    });
  }
}
