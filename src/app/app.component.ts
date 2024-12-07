import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { SecurityStore } from './security-store.service';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  #securityStore = inject(SecurityStore);

  user = this.#securityStore.loadedUser;

  http = inject(HttpClient);

  signOut() {
    this.#securityStore.signOut();
  }

  signIn() {
    this.#securityStore.signIn();
  }

  callAPI() {
    this.http
      .get('https://api.example.com/data')
      .subscribe((data) => console.log(data));
  }
}
