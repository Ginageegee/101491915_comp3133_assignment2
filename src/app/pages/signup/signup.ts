import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  username = '';
  email = '';
  password = '';

  private apiUrl = 'http://localhost:4000/graphql';

  constructor(private http: HttpClient, private router: Router) {}

  signup() {
    const query = `
      mutation {
        signup(input: {
          username: "${this.username}",
          email: "${this.email}",
          password: "${this.password}"
        }) {
          _id
          username
          email
        }
      }
    `;

    this.http.post(this.apiUrl, { query }).subscribe({
      next: (res: any) => {
        console.log('Signup success:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Signup error:', err);
      }
    });
  }
}
