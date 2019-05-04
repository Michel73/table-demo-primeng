import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

import { Page } from './model/page';
import { User, UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'td-primeng';
  users: User[];
  loading = false;

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
