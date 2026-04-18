import { Component, OnInit } from '@angular/core';
import { PracticeHistoryItemResponse } from '../../../models/practice/practice-history-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PracticeService } from '../../../services/practice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-practice-history',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './practice-history.component.html',
  styleUrl: './practice-history.component.scss'
})
export class PracticeHistoryComponent implements OnInit {

  historyList: PracticeHistoryItemResponse[] = [];

  loading = false;
  errorMessage = '';

  courseId: number | null = null;
  lessonId: number | null = null;
  levelId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private practiceService: PracticeService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const courseId = params.get('courseId');
      const lessonId = params.get('lessonId');
      const levelId = params.get('levelId');

      this.courseId = courseId ? Number(courseId) : null;
      this.lessonId = lessonId ? Number(lessonId) : null;
      this.levelId = levelId ? Number(levelId) : null;

      if (this.levelId === null || isNaN(this.levelId)) {
        const savedLevelId = localStorage.getItem('currentLevelId');
        this.levelId = savedLevelId ? Number(savedLevelId) : null;
      }

      console.log('history query params:', {
        courseId: this.courseId,
        lessonId: this.lessonId,
        levelId: this.levelId
      });
    });

    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.errorMessage = '';

    this.practiceService.getHistory().subscribe({
      next: (response: PracticeHistoryItemResponse[]) => {
        this.historyList = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Không tải được lịch sử luyện tập.';
        console.error('Get history error:', error);
      }
    });
  }

  viewResult(sessionId: number): void {
    this.router.navigate(['/practice/result', sessionId], {
      queryParams: {
        levelId: this.levelId ?? undefined
      }
    });
  }

  goToStart(): void {
    console.log('goToStart levelId cuối = ', this.levelId);

    if (this.levelId !== null && !isNaN(this.levelId)) {
      this.router.navigate(['/levels', this.levelId, 'courses']);
      return;
    }

    this.router.navigate(['/levels']);
  }
}