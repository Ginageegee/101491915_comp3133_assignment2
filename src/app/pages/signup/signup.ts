import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';

  private apiUrl = 'https://comp3133-101491915-assignment1.onrender.com/graphql';

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
        console.log('Signup response:', res);

        if (res.errors && res.errors.length > 0) {
          console.error('Signup failed:', res.errors);
          alert(res.errors[0].message || 'Signup failed. Please try again.');
          return;
        }

        if (res.data?.signup?._id) {
          this.router.navigate(['/login']);
        } else {
          alert('Signup failed. Please try again.');
        }
      },
      error: (err) => {
        console.error('Signup error:', err);
        alert('Signup failed. Please try again.');
      }
    });
  }
}
