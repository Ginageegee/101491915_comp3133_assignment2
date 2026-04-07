import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:4000/graphql';

  constructor(private http: HttpClient) {}

  signup(username: string, email: string, password: string) {
    const query = `
      mutation {
        signup(input: {
          username: "${username}",
          email: "${email}",
          password: "${password}"
        }) {
          _id
          username
          email
        }
      }
    `;

    return this.http.post(this.apiUrl, { query });
  }

  login(username: string, password: string) {
    const query = `
      mutation {
        login(input: {
          username: "${username}",
          password: "${password}"
        }) {
          token
          user {
            _id
            username
          }
        }
      }
    `;

    return this.http.post(this.apiUrl, { query });
  }
}
