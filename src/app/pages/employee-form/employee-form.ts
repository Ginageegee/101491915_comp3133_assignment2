import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css']
})
export class EmployeeFormComponent {
  apiUrl = 'http://localhost:4000/graphql';

  first_name = '';
  last_name = '';
  email = '';
  gender = 'Male';
  designation = '';
  salary: number | null = null;
  date_of_joining = '';
  department = '';
  employee_photo: string | null = null;

  errorMessage = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.employee_photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No token found. Please log in again.';
      this.router.navigate(['/login']);
      return;
    }

    const mutation = `
      mutation Add($input: EmployeeInput!) {
        addEmployee(input: $input) {
          _id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
        }
      }
    `;

    const variables = {
      input: {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        gender: this.gender,
        designation: this.designation,
        salary: Number(this.salary),
        date_of_joining: this.date_of_joining,
        department: this.department,
        employee_photo: this.employee_photo
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    this.loading = true;
    this.errorMessage = '';

    this.http.post<any>(this.apiUrl, { query: mutation, variables }, { headers })
      .subscribe({
        next: (res) => {
          this.loading = false;
          console.log('ADD EMPLOYEE RESPONSE:', res);

          if (res?.errors?.length) {
            this.errorMessage = res.errors[0].message;
            return;
          }

          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.loading = false;
          console.error('ADD EMPLOYEE ERROR:', err);
          this.errorMessage =
            err?.error?.errors?.[0]?.message || 'Failed to save employee.';
        }
      });
  }
}
