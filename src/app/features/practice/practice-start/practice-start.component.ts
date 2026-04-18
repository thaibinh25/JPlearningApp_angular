import { Component, OnInit } from '@angular/core';
import { PracticeStartRequest } from '../../../models/practice/practice-start-request.model';
import { PracticeService } from '../../../services/practice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";
import { AuthService, UserResponse } from '../../../core/services/auth.service';

@Component({
  selector: 'app-practice-start',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './practice-start.component.html',
  styleUrl: './practice-start.component.scss'
})
export class PracticeStartComponent implements OnInit {

  currentUser: UserResponse | null = null;

  formData: PracticeStartRequest = {
    userId: 0,
    lessonId: 0,
    mode: 'PRACTICE1',
    hiddenKanji: false,
    hiddenKana: true,
    hiddenHanViet: false,
    hiddenMeaningVi: false
  };

  loading = false;
  errorMessage = '';
  courseId!: number;
  levelId!: number;

  constructor(
    private practiceService: PracticeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();

    this.route.queryParams.subscribe(params => {
      const lessonIdParam = params['lessonId'];
      const courseIdParam = params['courseId'];
      const levelIdParam = params['levelId'];

      if (!lessonIdParam || !courseIdParam) {
        this.errorMessage = 'Thiếu dữ liệu lesson hoặc course.';
        this.router.navigate(['/levels']);
        return;
      }

      this.formData.lessonId = Number(lessonIdParam);
      this.courseId = Number(courseIdParam);
      this.levelId = Number(levelIdParam);

      if (isNaN(this.formData.lessonId) || isNaN(this.courseId)) {
        this.errorMessage = 'lessonId hoặc courseId không hợp lệ.';
        this.router.navigate(['/levels']);
        return;
      }

      console.log('practice-start lessonId:', this.formData.lessonId);
      console.log('practice-start courseId:', this.courseId);
      console.log('practice-start userId:', this.formData.userId);
    });
  }

  loadCurrentUser(): void {
    const storedUser = this.authService.getStoredUser();

    if (storedUser && storedUser.id) {
      this.currentUser = storedUser;
      this.formData.userId = storedUser.id;
      return;
    }

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.formData.userId = user.id;
        this.authService.saveCurrentUser(user);
      },
      error: (error) => {
        console.error('Không lấy được user hiện tại:', error);
        this.errorMessage = 'Không xác định được người dùng hiện tại. Vui lòng đăng nhập lại.';
        this.router.navigate(['/login']);
      }
    });
  }

  startPractice(): void {
    this.errorMessage = '';

    if (!this.formData.userId || isNaN(this.formData.userId)) {
      this.errorMessage = 'User hiện tại không hợp lệ. Vui lòng đăng nhập lại.';
      return;
    }

    this.loading = true;

    console.log('formData gửi đi:', this.formData);

    this.practiceService.startSession(this.formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/practice/session', response.sessionId], {
          queryParams: {
            courseId: this.courseId,
            lessonId: this.formData.lessonId,
            levelId: this.levelId
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Không thể bắt đầu phiên luyện tập.';
        console.error('Start session error:', error);
      }
    });
  }

  goBack(): void {
    if (!this.courseId || isNaN(this.courseId)) {
      this.router.navigate(['/levels']);
      return;
    }

    this.router.navigate(['/courses', this.courseId, 'lessons'], {
      queryParams: {
        levelId: this.levelId
      }
    });
  }
}