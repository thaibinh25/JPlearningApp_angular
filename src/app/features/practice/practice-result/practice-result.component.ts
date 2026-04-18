import { Component, OnInit } from '@angular/core';
import { SubmitPracticeResponse } from '../../../models/practice/submit-practice-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PracticeService } from '../../../services/practice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";
import { LessonService } from '../../../services/lesson.service';

@Component({
  selector: 'app-practice-result',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './practice-result.component.html',
  styleUrl: './practice-result.component.scss'
})
export class PracticeResultComponent implements OnInit {
  sessionId!: number;
  result: SubmitPracticeResponse | null = null;

  loading = false;
  errorMessage = '';
  retryLoading = false;
  retryError = '';
  redoLoading = false;
  redoError = '';

  courseId!: number;
  lessonId!: number;
  levelId!: number;
  
  visibleUserFields = {
  kanji: false,
  kana: false,
  hanViet: false,
  meaningVi: false
};

private updateVisibleUserFieldsFromQueryParams(params: any): void {
  const hiddenKanji = params['hiddenKanji'] === true || params['hiddenKanji'] === 'true';
  const hiddenKana = params['hiddenKana'] === true || params['hiddenKana'] === 'true';
  const hiddenHanViet = params['hiddenHanViet'] === true || params['hiddenHanViet'] === 'true';
  const hiddenMeaningVi = params['hiddenMeaningVi'] === true || params['hiddenMeaningVi'] === 'true';

  this.visibleUserFields = {
    kanji: hiddenKanji,
    kana: hiddenKana,
    hanViet: hiddenHanViet,
    meaningVi: hiddenMeaningVi
  };
}

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private practiceService: PracticeService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));

    if (!this.sessionId || isNaN(this.sessionId)) {
      this.errorMessage = 'Session ID không hợp lệ.';
      return;
    }

    this.route.queryParams.subscribe(params => {
      this.courseId = Number(params['courseId']);
      this.lessonId = Number(params['lessonId']);
      this.levelId = Number(params['levelId']);
      this.updateVisibleUserFieldsFromQueryParams(params);
      console.log('practice-result courseId:', this.courseId);
      console.log('practice-result lessonId:', this.lessonId);
    });

    this.loadResult();
  }

  loadResult(): void {
    this.loading = true;
    this.errorMessage = '';

    this.practiceService.getSessionResult(this.sessionId).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Không tải được kết quả.';
        console.error('Get session result error:', error);
      }
    });
  }

  getClass(value: boolean | null): string {
    if (value === null || value === undefined) {
      return 'not-graded';
    }
    return value ? 'correct' : 'wrong';
  }

  backToStart(): void {
    if (!this.courseId || isNaN(this.courseId)) {
      this.router.navigate(['/levels']);
      return;
    }

    if (!this.lessonId || isNaN(this.lessonId)) {
      this.router.navigate(['/courses', this.courseId, 'lessons']);
      return;
    }

    this.lessonService.getLessonsByCourse(this.courseId).subscribe({
      next: (lessons) => {
        if (!lessons || lessons.length === 0) {
          this.router.navigate(['/courses', this.courseId, 'lessons']);
          return;
        }

        const currentIndex = lessons.findIndex(lesson => lesson.id === this.lessonId);

        if (currentIndex === -1) {
          this.router.navigate(['/courses', this.courseId, 'lessons']);
          return;
        }

        const nextLesson = lessons[currentIndex + 1];

        if (nextLesson) {
          this.router.navigate(['/practice/start'], {
            queryParams: {
              lessonId: nextLesson.id,
              courseId: this.courseId,
              levelId: this.levelId
            }
          });
        } else {
          this.router.navigate(['/courses', this.courseId, 'lessons']);
        }
      },
      error: (err) => {
        console.error('Không tải được danh sách lesson:', err);
        this.router.navigate(['/courses', this.courseId, 'lessons']);
      }
    });
  }

  goToHistory(): void {
    this.router.navigate(['/practice/history'], {
      queryParams: {
        courseId: this.courseId ?? undefined,
        lessonId: this.lessonId ?? undefined,
        levelId: this.levelId ?? undefined
      }
    });
  }

  redoAll(): void {
    if (!this.sessionId) return;

    this.redoLoading = true;
    this.redoError = '';

    this.practiceService.redoSession(this.sessionId).subscribe({
      next: (res) => {
        this.redoLoading = false;
        this.router.navigate(['/practice/session', res.sessionId], {
          queryParams: {
            courseId: this.courseId,
            lessonId: this.lessonId,
            levelId: this.levelId
          }
        });
      },
      error: (err) => {
        this.redoLoading = false;
        this.redoError = err?.error?.message || 'Không thể làm lại toàn bộ bài';
        console.error(err);
      }
    });
  }

  retryWrong(): void {
    if (!this.sessionId) return;

    this.retryLoading = true;
    this.retryError = '';

    this.practiceService.retryWrong(this.sessionId).subscribe({
      next: (res) => {
        this.retryLoading = false;
        this.router.navigate(['/practice/session', res.sessionId], {
          queryParams: {
            courseId: this.courseId,
            lessonId: this.lessonId,
            levelId: this.levelId
          }
        });
      },
      error: (err) => {
        this.retryLoading = false;
        this.retryError = err?.error?.message || 'Không thể luyện lại câu sai';
        console.error(err);
      }
    });
  }
}
