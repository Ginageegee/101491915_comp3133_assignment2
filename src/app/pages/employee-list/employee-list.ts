import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  apiUrl = 'http://localhost:4000/graphql';
  errorMessage = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No token found. Please log in again.';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.employees = [];

    const query = `
      query {
        getAllEmployees {
          _id
          first_name
          last_name
          email
          salary
          designation
          department
          employee_photo
        }
      }
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post<any>(this.apiUrl, { query }, { headers }).subscribe({
      next: (res) => {
        console.log('EMPLOYEE RESPONSE:', res);

        if (res.errors && res.errors.length > 0) {
          this.errorMessage = res.errors[0].message;
          this.employees = [];
        } else {
          this.employees = res.data?.getAllEmployees || [];
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('LOAD ERROR:', err);
        console.error('ERROR BODY:', err.error);

        this.errorMessage =
          err?.error?.errors?.[0]?.message || 'Failed to load employees.';
        this.employees = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteEmployee(id: string): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No token found. Please log in again.';
      this.router.navigate(['/login']);
      return;
    }

    const mutation = `
      mutation Delete($eid: ID!) {
        deleteEmployeeById(eid: $eid)
      }
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post<any>(
      this.apiUrl,
      {
        query: mutation,
        variables: { eid: id }
      },
      { headers }
    ).subscribe({
      next: (res) => {
        console.log('DELETE RESPONSE:', res);

        if (res.errors && res.errors.length > 0) {
          this.errorMessage = res.errors[0].message;
        } else {
          this.loadEmployees();
        }
      },
      error: (err) => {
        console.error('DELETE ERROR:', err);
        this.errorMessage =
          err?.error?.errors?.[0]?.message || 'Failed to delete employee.';
      }
    });
  }
}
