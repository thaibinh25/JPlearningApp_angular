import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { CourseResponse } from '../../models/course/course.model';

@Component({
  selector: 'app-course-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.scss']
})
export class CoursePageComponent implements OnInit {
  levelId!: number;
  courses: CourseResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.levelId = Number(params.get('levelId'));
      if (this.levelId) {
        this.loadCourses();
      }
    });
  }

  loadCourses(): void {
    this.loading = true;
    this.errorMessage = '';

    this.courseService.getCoursesByLevel(this.levelId).subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Load courses error:', err);
        this.errorMessage = 'Không thể tải danh sách course';
        this.loading = false;
      }
    });
  }

  goToLessons(course: CourseResponse): void {
  this.router.navigate(['/courses', course.id, 'lessons'], {
    queryParams: {
      levelId: this.levelId
    }
  });
}

  goBack(): void {
    this.router.navigate(['/levels']);
  }
}