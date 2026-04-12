import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
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

  private apiUrl = 'https://comp3133-101491915-assignment1.onrender.com/graphql';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    console.log('Login clicked');

    const query = `
      mutation {
        login(input: {
          username: "${this.username}",
          password: "${this.password}"
        }) {
          token
          user {
            _id
            username
          }
        }
      }
    `;

    this.http.post(this.apiUrl, { query }).subscribe({
      next: (res: any) => {
        console.log('Login response:', res);

        if (res.errors && res.errors.length > 0) {
          console.error('Login failed:', res.errors);
          alert(res.errors[0].message || 'Invalid username or password');
          return;
        }

        const token = res.data?.login?.token;

        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/employees']);
        } else {
          alert('Invalid username or password');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login failed. Please try again.');
      }
    });
  }
}
