import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  apiUrl = 'https://comp3133-101491915-assignment1.onrender.com/graphql';
  errorMessage = '';
  loading = false;

  searchDepartment = '';
  searchDesignation = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  getHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No token found. Please log in again.';
      this.router.navigate(['/login']);
      return null;
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  loadEmployees(): void {
    const headers = this.getHeaders();
    if (!headers) return;

    this.loading = true;
    this.errorMessage = '';

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

  search(): void {
    const headers = this.getHeaders();
    if (!headers) return;

    this.loading = true;
    this.errorMessage = '';

    const query = `
      query SearchEmployees($department: String, $designation: String) {
        searchEmployees(department: $department, designation: $designation) {
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

    const variables = {
      department: this.searchDepartment || null,
      designation: this.searchDesignation || null
    };

    this.http.post<any>(this.apiUrl, { query, variables }, { headers }).subscribe({
      next: (res) => {
        console.log('SEARCH RESPONSE:', res);

        if (res.errors && res.errors.length > 0) {
          this.errorMessage = res.errors[0].message;
          this.employees = [];
        } else {
          this.employees = res.data?.searchEmployees || [];
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('SEARCH ERROR:', err);
        console.error('SEARCH ERROR BODY:', err.error);

        this.errorMessage =
          err?.error?.errors?.[0]?.message || 'Failed to search employees.';
        this.employees = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteEmployee(id: string): void {
    const headers = this.getHeaders();
    if (!headers) return;

    const mutation = `
      mutation DeleteEmployee($eid: ID!) {
        deleteEmployeeById(eid: $eid)
      }
    `;

    this.http.post<any>(
      this.apiUrl,
      {
        query: mutation,
        variables: { eid: id }
      },
      { headers }
    ).subscribe({
      next: () => {
        this.loadEmployees();
      },
      error: (err) => {
        console.error('DELETE ERROR:', err);
        this.errorMessage =
          err?.error?.errors?.[0]?.message || 'Failed to delete employee.';
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
