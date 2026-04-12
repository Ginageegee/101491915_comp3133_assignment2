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
      mutation Signup($input: SignupInput!) {
        signup(input: $input) {
          _id
          username
          email
        }
      }
    `;

    const variables = {
      input: {
        username: this.username,
        email: this.email,
        password: this.password
      }
    };

    this.http.post(this.apiUrl, { query, variables }).subscribe({
      next: (res: any) => {
        console.log('Signup success:', res);

        if (res.data?.signup?._id) {
          this.router.navigate(['/login']);
        } else {
          console.error('Signup failed:', res);
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
