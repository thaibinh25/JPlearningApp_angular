import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.maxLength(20)]],
      dateOfBirth: [''],
      address: ['', [Validators.maxLength(255)]]
    });
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          fullName: user.fullName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          dateOfBirth: user.dateOfBirth || '',
          address: user.address || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi load profile:', error);
        this.errorMessage = 'Không thể tải thông tin cá nhân.';
        this.loading = false;
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.profileForm.value;

    const payload = {
      fullName: formValue.fullName?.trim(),
      email: formValue.email?.trim(),
      phoneNumber: formValue.phoneNumber?.trim(),
      dateOfBirth: formValue.dateOfBirth || null,
      address: formValue.address?.trim()
    };

    this.userService.updateCurrentUser(payload).subscribe({
      next: () => {
        this.successMessage = 'Cập nhật thông tin cá nhân thành công.';
        this.saving = false;
      },
      error: (error) => {
        console.error('Lỗi update profile:', error);
        this.errorMessage = error?.error?.message || 'Cập nhật thất bại.';
        this.saving = false;
      }
    });
  }

  get fullName() {
    return this.profileForm.get('fullName');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get phoneNumber() {
    return this.profileForm.get('phoneNumber');
  }

  get address() {
    return this.profileForm.get('address');
  }
}