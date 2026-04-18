import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LevelService } from '../../services/level.service';
import { LevelResponse } from '../../models/level/level.model';


@Component({
  selector: 'app-level-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './level-page.component.html',
  styleUrls: ['./level-page.component.scss']
})
export class LevelPageComponent implements OnInit {
  levels: LevelResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private levelService: LevelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLevels();
  }

  loadLevels(): void {
  this.loading = true;
  this.errorMessage = '';

  this.levelService.getLevels().subscribe({
    next: (data) => {
      console.log('Levels data:', data);
      this.levels = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Load levels error full:', err);
      console.error('status:', err.status);
      console.error('error body:', err.error);
      this.errorMessage = `Không thể tải danh sách level. Status: ${err.status}`;
      this.loading = false;
    }
  });
}

  goToCourses(level: LevelResponse): void {
    this.router.navigate(['/levels', level.id, 'courses']);
  }
}