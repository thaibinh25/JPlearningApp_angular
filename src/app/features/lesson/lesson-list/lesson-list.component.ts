import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LessonService } from '../../../services/lesson.service';
import { Lesson } from '../../../models/lesson/lesson.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-lesson-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './lesson-list.component.html',
    styleUrls: ['./lesson-list.component.scss']
})
export class LessonListComponent implements OnInit {
    lessons: Lesson[] = [];
    loading = false;
    errorMessage = '';
    courseId!: number;
    levelId!: number;

    constructor(
        private lessonService: LessonService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {
            this.courseId = Number(params.get('courseId'));
            this.loadLessons();
        });
        this.route.queryParams.subscribe(params => {
        this.levelId = Number(params['levelId']);
        });
    }

    loadLessons(): void {
        this.loading = true;
        this.errorMessage = '';

        this.lessonService.getLessonsByCourse(this.courseId).subscribe({
            next: (data) => {
                this.lessons = data;
                this.loading = false;
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = 'Không thể tải danh sách bài học.';
                this.loading = false;
            }
        });
    }

    goToStudy(lessonId: number): void {
        this.router.navigate(['/study', lessonId],{
    queryParams: {
      courseId: this.courseId,
      levelId: this.levelId
    }
  });
    }

    goToPractice(lesson: Lesson): void {
        console.log('goToStart levelId 1 = ', this.levelId);
   this.router.navigate(['/practice/start'], {
    queryParams: {
      lessonId: lesson.id,
      courseId: this.courseId,
      levelId: this.levelId
    }
  });
}
goBack(): void {
  if (this.levelId && !isNaN(this.levelId)) {
    this.router.navigate(['/levels', this.levelId, 'courses']);
    return;
  }

  this.router.navigate(['/levels']);
}
}