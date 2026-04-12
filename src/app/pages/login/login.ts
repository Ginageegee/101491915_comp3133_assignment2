import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  username = '';
  password = '';

  private apiUrl = 'http://localhost:4000/graphql';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    console.log('Login clicked');

    const query = `
    query Login($input: LoginInput!) {
      login(input: $input) {
        token
        user {
          _id
          username
        }
      }
    }
  `;

    const variables = {
      input: {
        username: this.username,
        email: null,
        password: this.password
      }
    };

    this.http.post(this.apiUrl, { query, variables }).subscribe({
      next: (res: any) => {
        console.log('Login response:', res);

        const token = res.data?.login?.token;

        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/employees']);
        } else {
          console.error('Login failed:', res);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }

}
