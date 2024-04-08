import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router) {}

  handleLogin(): void {
    axios
      .post('http://localhost:4000/graphql', {
        query: `
          query ExampleQuery {
            login(userName: "${this.username}", password: "${this.password}") {
              email
              id
              password
              userName
            }
          }
        `,
      })
      .then((response) => {
        const loginData = response.data;
  
        if (loginData.errors) {
          console.error('GraphQL errors:', loginData.errors);
          this.error = 'Please try again. Error logging in.';
          return;
        }
  
        const authPayload = loginData.data.login;
        if (authPayload) {
          this.router.navigate(['/employee-list']);
        } else {
          this.error = 'The username or password you entered is invalid, please try again.';
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        this.error = 'Failed to login, an error occurred. Please try again later.';
      });
  }  
  navigateToSignup(event: Event) {
    event.preventDefault();
    this.router.navigate(['/signup']); 
  }
}
