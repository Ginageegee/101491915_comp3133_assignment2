import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css']
})
export class EmployeeFormComponent implements OnInit {
  apiUrl = 'https://comp3133-101491915-assignment1.onrender.com/graphql';

  first_name = '';
  last_name = '';
  email = '';
  gender = 'Male';
  designation = '';
  salary: number | null = null;
  date_of_joining = '';
  department = '';
  employee_photo = '';

  errorMessage = '';
  loading = false;

  isEditMode = false;
  employeeId = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.employeeId = id;
      this.loadEmployee(id);
    }
  }

  formatDateForInput(dateValue: any): string {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().split('T')[0];
  }

  loadEmployee(id: string): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No token found. Please log in again.';
      this.router.navigate(['/login']);
      return;
    }

    const query = `
      query GetEmployee($eid: ID!) {
        getEmployeeById(eid: $eid) {
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

    const variables = { eid: id };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    this.loading = true;
    this.errorMessage = '';

    this.http.post<any>(this.apiUrl, { query, variables }, { headers }).subscribe({
      next: (res) => {
        console.log('EMPLOYEE RESPONSE:', res);
        this.loading = false;

        if (res?.errors?.length) {
          this.errorMessage = res.errors[0].message;
          return;
        }

        const emp = res?.data?.getEmployeeById;

        if (!emp) {
          this.errorMessage = 'Employee not found.';
          return;
        }

        this.first_name = emp.first_name || '';
        this.last_name = emp.last_name || '';
        this.email = emp.email || '';
        this.gender = emp.gender || 'Male';
        this.designation = emp.designation || '';
        this.salary = emp.salary ?? null;
        this.department = emp.department || '';
        this.employee_photo = emp.employee_photo || '';
        this.date_of_joining = this.formatDateForInput(emp.date_of_joining);
      },
      error: (err) => {
        this.loading = false;
        console.error('LOAD EMPLOYEE ERROR:', err);
        this.errorMessage =
          err?.error?.errors?.[0]?.message || 'Failed to load employee.';
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.employee_photo = '';
    this.errorMessage = 'Photo upload is disabled for now to avoid payload too large errors.';
  }

  submit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No token found. Please log in again.';
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const input = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      gender: this.gender,
      designation: this.designation,
      salary: Number(this.salary),
      date_of_joining: this.date_of_joining,
      department: this.department,
      employee_photo: this.employee_photo || null
    };

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      const mutation = `
        mutation UpdateEmployee($eid: ID!, $input: EmployeeInput!) {
          updateEmployeeById(eid: $eid, input: $input) {
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
        eid: this.employeeId,
        input
      };

      this.http.post<any>(this.apiUrl, { query: mutation, variables }, { headers })
        .subscribe({
          next: (res) => {
            console.log('UPDATE EMPLOYEE RESPONSE:', res);
            this.loading = false;

            if (res?.errors?.length) {
              this.errorMessage = res.errors[0].message;
              return;
            }

            this.router.navigate(['/employees']);
          },
          error: (err) => {
            this.loading = false;
            console.error('UPDATE EMPLOYEE ERROR:', err);
            console.error('UPDATE EMPLOYEE ERROR BODY:', err?.error);
            this.errorMessage =
              err?.error?.errors?.[0]?.message || 'Failed to update employee.';
          }
        });

    } else {
      const mutation = `
        mutation AddEmployee($input: EmployeeInput!) {
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

      const variables = { input };

      this.http.post<any>(this.apiUrl, { query: mutation, variables }, { headers })
        .subscribe({
          next: (res) => {
            console.log('ADD EMPLOYEE RESPONSE:', res);
            this.loading = false;

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
}
