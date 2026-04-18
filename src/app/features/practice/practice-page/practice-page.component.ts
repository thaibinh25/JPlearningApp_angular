import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PracticeService } from '../../../services/practice.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { HandwritingPanelComponent } from '../../hardwrite/handwriting-panel.component';



@Component({
  selector: 'app-practice-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    HandwritingPanelComponent // CHỈ THÊM component này
  ],
  templateUrl: './practice-page.component.html',
  styleUrl: './practice-page.component.scss'
})
export class PracticePageComponent implements OnInit {
  practiceSessionId!: number;
  practiceDetail: any = null;

  loading = false;
  submitting = false;
  errorMessage = '';

  userAnswers: {
    inputKanji: string;
    inputKana: string;
    inputHanViet: string;
    inputMeaningVi: string;
  }[] = [];

  // phần viết tay
  handwritingMode = false;
  showHandwritingPanel = false;

  activeInputIndex: number | null = null;
  activeInputField: 'inputKanji' | 'inputKana' | 'inputHanViet' | 'inputMeaningVi' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private practiceService: PracticeService
  ) { }

  ngOnInit(): void {
    this.practiceSessionId = Number(this.route.snapshot.paramMap.get('sessionId'));
    if (!this.practiceSessionId) {
      this.errorMessage = 'Practice session ID không hợp lệ.';
      return;
    }

    this.loadPracticeDetail();
  }

  loadPracticeDetail(): void {
    this.loading = true;
    this.errorMessage = '';

    this.practiceService.getPracticeDetail(this.practiceSessionId).subscribe({
      next: (response: any) => {
        this.practiceDetail = response;

        this.userAnswers = (this.practiceDetail.items || []).map(() => ({
          inputKanji: '',
          inputKana: '',
          inputHanViet: '',
          inputMeaningVi: ''
        }));

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Lỗi load practice detail:', error);
        this.errorMessage = 'Không thể tải dữ liệu bài luyện.';
        this.loading = false;
      }
    });
  }

  submitPractice(): void {
    if (!this.practiceDetail?.sessionId) {
      this.errorMessage = 'Không tìm thấy session để nộp bài.';
      return;
    }

    const payload = {
      answers: this.userAnswers.map((answer, index) => ({
        vocabItemId: this.practiceDetail.items[index]?.id,
        inputKanji: answer.inputKanji,
        inputKana: answer.inputKana,
        inputHanViet: answer.inputHanViet,
        inputMeaningVi: answer.inputMeaningVi
      }))
    };

    this.submitting = true;
    this.errorMessage = '';

    this.practiceService.submitPractice(this.practiceDetail.sessionId, payload).subscribe({
      next: (response: any) => {
        this.submitting = false;

        // GIỮ NGUYÊN link cũ / route cũ
        this.router.navigate(['/practice/result', response.sessionId], {
          queryParams: {
            courseId: this.practiceDetail.courseId ?? undefined,
            lessonId: this.practiceDetail.lessonId ?? undefined,
            levelId: this.practiceDetail.levelId ?? undefined,
            hiddenKanji: this.practiceDetail.hiddenKanji,
            hiddenKana: this.practiceDetail.hiddenKana,
            hiddenHanViet: this.practiceDetail.hiddenHanViet,
            hiddenMeaningVi: this.practiceDetail.hiddenMeaningVi
          }
        });
      },
      error: (error: any) => {
        console.error('Lỗi submit practice:', error);
        this.errorMessage = 'Nộp bài thất bại.';
        this.submitting = false;
      }
    });
  }

  toggleHandwritingMode(): void {
    this.handwritingMode = !this.handwritingMode;

    if (!this.handwritingMode) {
      this.closeHandwritingPanel();
    }
  }

  openHandwritingForField(
    index: number,
    field: 'inputKanji' | 'inputKana' | 'inputHanViet' | 'inputMeaningVi',
    event: Event
  ): void {
    if (!this.handwritingMode) return;

    event.preventDefault();
    event.stopPropagation();

    this.activeInputIndex = index;
    this.activeInputField = field;
    this.showHandwritingPanel = true;
  }

  onCandidateSelected(text: string): void {
    if (this.activeInputIndex === null || !this.activeInputField) return;

    this.userAnswers[this.activeInputIndex][this.activeInputField] = text;
    this.closeHandwritingPanel();
  }

  closeHandwritingPanel(): void {
    this.showHandwritingPanel = false;
    this.activeInputIndex = null;
    this.activeInputField = null;
  }
}