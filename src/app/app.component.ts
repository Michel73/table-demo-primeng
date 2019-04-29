import { Component, OnInit } from '@angular/core';

import { User, UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'td-primeng';
  users: User[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.model.subscribe(users => this.users = users);
  }
}
