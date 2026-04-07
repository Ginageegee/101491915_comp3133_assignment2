import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css'],
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  private apiUrl = 'http://localhost:4000/graphql';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const query = `
      query {
        getAllEmployees {
          _id
          first_name
          last_name
          email
          designation
          department
          salary
        }
      }
    `;

    this.http.post(this.apiUrl, { query }, { headers })
      .subscribe({
        next: (res: any) => {
          this.employees = res.data?.getAllEmployees || [];
        },
        error: (err) => {
          console.error('Error loading employees:', err);
        }
      });
  }
}
