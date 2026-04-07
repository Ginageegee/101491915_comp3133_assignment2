import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css']
})
export class EmployeeFormComponent {

  first_name = '';
  last_name = '';
  email = '';
  designation = '';
  department = '';
  salary: number | null = null;

  submitForm() {
    console.log('Employee form submitted');
  }
}
