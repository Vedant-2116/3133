import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  standalone: true,
  imports: [NgFor, NgIf], // Assuming you might need NgIf for conditional rendering in your template
})
export class EmployeeDetailsComponent implements OnInit {
  employee: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadEmployeeDetails(params['id']);
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
  
    axios
      .post(`http://localhost:4000/graphql`, { // Updated endpoint URL
        query: query,
        variables: { employeeId: id },
      })
      .then((response) => {
        this.employee = response.data.data.getEmployeeById;
      })
      .catch((error) => {
        console.error('Error fetching employee details:', error);
      });  
  }
  navigateBack() {
    this.router.navigate(['/employee-list']);
  }
}
