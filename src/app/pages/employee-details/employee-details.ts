import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-details.html',
  styleUrls: ['./employee-details.css']
})
export class EmployeeDetailsComponent implements OnInit {
  apiUrl = 'https://comp3133-101491915-assignment1.onrender.com/graphql';

  employee: any = null;
  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Employee ID not found.';
      return;
    }

    this.loadEmployee(id);
  }

  loadEmployee(id: string): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No token found. Please log in again.';
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

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

    const variables = {
      eid: id
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post<any>(this.apiUrl, { query, variables }, { headers }).subscribe({
      next: (res) => {
        console.log('EMPLOYEE DETAILS RESPONSE:', res);

        if (res?.errors?.length) {
          this.errorMessage = res.errors[0].message;
          this.employee = null;
        } else {
          this.employee = res.data?.getEmployeeById || null;
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('DETAILS ERROR:', err);
        console.error('DETAILS ERROR BODY:', err?.error);

        this.errorMessage =
          err?.error?.errors?.[0]?.message || 'Failed to load employee details.';
        this.employee = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
