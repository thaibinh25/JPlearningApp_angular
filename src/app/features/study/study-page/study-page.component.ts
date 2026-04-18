import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { LessonService } from '../../../services/lesson.service';
import { StudyLessonResponse } from '../../../models/study/study-lesson-response.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Lesson } from '../../../models/lesson/lesson.model';

@Component({
  selector: 'app-study-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './study-page.component.html',
  styleUrls: ['./study-page.component.scss']
})
export class StudyPageComponent implements OnInit {
  lessonId!: number;
  data: StudyLessonResponse | null = null;
  lesson: Lesson | undefined;
  loading = false;
  errorMessage = '';

  showKanji = true;
  showKana = true;
  showHanViet = true;
  showMeaningVi = true;
  courseId!: number;
  levelId!: number;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private router: Router
  ) {}

  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
        this.levelId = Number(params['levelId']);
        this.courseId = Number(params['courseId']);
        });
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.lessonService.getStudyLesson(this.lessonId).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Không tải được dữ liệu';
        this.loading = false;
        console.error(err);
      }
    });
  }

  hideAll() {
    this.showKanji = false;
    this.showKana = false;
    this.showHanViet = false;
    this.showMeaningVi = false;
  }

  showAll() {
    this.showKanji = true;
    this.showKana = true;
    this.showHanViet = true;
    this.showMeaningVi = true;
  }

  goToPractice(): void {
  console.log('goToStart levelId sty= ', this.levelId);

  this.router.navigate(['/practice/start'], {
    queryParams: {
      lessonId: this.lessonId,
      courseId: this.courseId,
      levelId: this.levelId
    }
  });
}
}