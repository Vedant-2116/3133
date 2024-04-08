import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.css'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, HttpClientModule, RouterModule],
})
export class EmployeeUpdateComponent implements OnInit {
  updateForm: FormGroup;
  employeeId: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
    this.employeeId = '';
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.employeeId = params['id'];
      this.loadEmployeeDetails(this.employeeId);
    });
  }

  loadEmployeeDetails(id: string) {
    const query = `
      query GetEmployeeById($employeeId: ID!) {
        getEmployeeById(employeeId: $employeeId) {
          id
          firstName
          lastName
          email
          gender
          salary
        }
      }
    `;

    this.http
      .post('http://localhost:4000/graphql', {
        query: query,
        variables: { id },
      })
      .subscribe({
        next: (response: any) => {
          const employee = response.data.searchEmployeeById;
          this.updateForm.patchValue({
            firstName: employee.first_name,
            lastName: employee.last_name,
            email: employee.email,
            gender: employee.gender,
            salary: employee.salary,
          });
        },
        error: (error) =>
          console.error('Error fetching employee details:', error),
      });
  }

  async updateEmployee() {
    if (this.updateForm.valid) {
      const formValues = this.updateForm.value;
      const mutation = `
        mutation UpdateEmployee($employeeId: ID!, $firstName: String!, $lastName: String!, $email: String!, $gender: String!, $salary: Float!) {
            updateEmployee(employeeId: $employeeId, firstName: $firstName, lastName: $lastName, email: $email, gender: $gender, salary: $salary) {
                _id
                firstName
                lastName
                email
                gender
                salary
            }
        }
      `;
  
      const variables = {
        employeeId: this.employeeId,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        gender: formValues.gender,
        salary: parseFloat(formValues.salary),
      };
  
      try {
        const response = await axios.post(
          'http://localhost:4000/graphql', // Updated endpoint URL
          {
            query: mutation,
            variables: variables,
          }
        );
  
        if (response.data.data.updateEmployee) {
          alert('Employee updated successfully');
          this.router.navigate(['/employee-list']);
        } else {
          console.error('Error updating employee:', response.data.errors);
        }
      } catch (error) {
        console.error('There was an error updating the employee:', error);
      }
    }
  }
}
