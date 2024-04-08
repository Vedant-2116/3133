import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, RouterModule, NgIf],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  error: string | null = null;
  
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private route: Router) {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.error = 'Please ensure all fields are filled out correctly.';
      return;
    }
  
    const { username, email, password } = this.signupForm.value;
  
    const mutation = `
      mutation Mutation {
        signUp(userName: "${username}", email: "${email}", password: "${password}") {
          email
          id
          password
          userName
        }
      }
    `;
    this.httpClient.post('http://localhost:4000/graphql', { // Updated endpoint URL
      query: mutation,
      variables: { userName: username, email, password },
    }).subscribe({
      next: (response: any) => {
        console.log('Signup response:', response);
        if (response.data.signUp) {
          alert('Registered successfully.');
          this.route.navigate(['/employee-list']);
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      },
      error: (err) => {
        console.error('Signup error:', err);
        this.error = 'An error occurred during registration. Please try again.';
      },
    });
  }  
}
