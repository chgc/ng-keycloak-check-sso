import { computed, inject, Injectable, signal } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ANONYMOUS_USER, User } from './models';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class SecurityStore {
  #keycloakService = inject(KeycloakService);

  loaded = signal(false);
  user = signal<User | undefined>(undefined);

  loadedUser = computed(() => (this.loaded() ? this.user() : undefined));
  signedIn = computed(() => this.loaded() && !this.user()?.anonymous);
  keycloakService = inject(KeycloakService);

  constructor() {
    this.onInit();
  }

  async onInit() {
    if (this.keycloakService.isLoggedIn()) {
      const profile =
        (await this.keycloakService.loadUserProfile()) as unknown as UserProfile;
      const { id, email, firstName, lastName } = profile;
      const token = await this.#keycloakService.getToken();
      const user = {
        id,
        email,
        name: `${firstName} ${lastName}`,
        anonymous: false,
        bearer: token,
      };
      console.log(user);
      this.user.set(user);
      this.loaded.set(true);
    } else {
      this.user.set(ANONYMOUS_USER);
      this.loaded.set(true);
    }
  }

  async signIn() {
    await this.#keycloakService.login();
  }

  async signOut() {
    await this.#keycloakService.logout();
  }
}
