import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // ===== AUTH =====
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.RegisterComponent)
  },

  // ===== DEFAULT =====
  {
    path: '',
    redirectTo: 'practice/start',
    pathMatch: 'full'
  },

  // ===== PRACTICE =====
  {
    path: 'practice/start',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/practice/practice-start/practice-start.component')
        .then(m => m.PracticeStartComponent)
  },
  {
    path: 'practice/session/:sessionId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/practice/practice-page/practice-page.component')
        .then(m => m.PracticePageComponent)
  },
  {
    path: 'practice/result/:sessionId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/practice/practice-result/practice-result.component')
        .then(m => m.PracticeResultComponent)
  },
  {
    path: 'practice/history',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/practice/practice-history/practice-history.component')
        .then(m => m.PracticeHistoryComponent)
  },

  // ===== STUDY =====
  {
    path: 'study/:lessonId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/study/study-page/study-page.component')
        .then(m => m.StudyPageComponent)
  },

  // ===== LESSON / COURSE / LEVEL =====
  {
    path: 'lessons',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/lesson/lesson-list/lesson-list.component')
        .then(m => m.LessonListComponent)
  },
  {
    path: 'levels',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/level/level-page.component')
        .then(m => m.LevelPageComponent)
  },
  {
    path: 'levels/:levelId/courses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/course/course-page.component')
        .then(m => m.CoursePageComponent)
  },
  {
    path: 'courses/:courseId/lessons',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/lesson/lesson-list/lesson-list.component')
        .then(m => m.LessonListComponent)
  },
  {
  path: 'profile',
  loadComponent: () =>
    import('./features/profile/profile.component').then(m => m.ProfileComponent)
},
  // ===== FALLBACK =====
  {
    path: '**',
    redirectTo: ''
  }
];