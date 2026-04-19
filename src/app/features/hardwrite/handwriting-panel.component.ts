

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HandwritingRecognizeResponse,
  HandwritingService
} from '../../services/handwriting.service';

@Component({
  selector: 'app-handwriting-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './handwriting-panel.component.html',
  styleUrl: './handwriting-panel.component.scss'
})
export class HandwritingPanelComponent implements AfterViewInit, OnDestroy {
  @Input() field: string | null = null;

  @Output() selected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('handwritingCanvas', { static: false })
  handwritingCanvasRef!: ElementRef<HTMLCanvasElement>;

  candidates: string[] = [];
  errorMessage = '';
  recognizing = false;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private hasStroke = false;

  private autoRecognizeTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly AUTO_RECOGNIZE_DELAY = 700;
  private candidateSelecting = false;

  constructor(private handwritingService: HandwritingService) {}

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    this.clearAutoRecognizeTimer();
  }

  private initCanvas(): void {
    this.canvas = this.handwritingCanvasRef.nativeElement;

    const context = this.canvas.getContext('2d');
    if (!context) {
      this.errorMessage = 'Không khởi tạo được canvas.';
      return;
    }

    this.ctx = context;

    const ratio = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * ratio;
    this.canvas.height = rect.height * ratio;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(ratio, ratio);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, rect.width, rect.height);

    this.ctx.lineWidth = 6;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = '#111827';

    this.bindCanvasEvents();
  }

  private bindCanvasEvents(): void {
    this.canvas.onpointerdown = (event: PointerEvent) => this.onPointerDown(event);
    this.canvas.onpointermove = (event: PointerEvent) => this.onPointerMove(event);
    this.canvas.onpointerup = (event: PointerEvent) => this.onPointerUp(event);
    this.canvas.onpointerleave = (event: PointerEvent) => this.onPointerUp(event);
    this.canvas.onpointercancel = (event: PointerEvent) => this.onPointerUp(event);
  }

  private getPoint(event: PointerEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  onPointerDown(event: PointerEvent): void {
    if (!this.ctx) return;

    this.clearAutoRecognizeTimer();
    this.errorMessage = '';
    this.candidates = [];

    const point = this.getPoint(event);
    this.drawing = true;
    this.hasStroke = true;

    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);

    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch {}
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.drawing || !this.ctx) return;

    const point = this.getPoint(event);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
  }

  onPointerUp(event?: PointerEvent): void {
    if (!this.drawing) return;

    this.drawing = false;

    if (event) {
      try {
        this.canvas.releasePointerCapture(event.pointerId);
      } catch {}
    }

    this.scheduleAutoRecognize();
  }

  private scheduleAutoRecognize(): void {
    this.clearAutoRecognizeTimer();

    if (!this.hasStroke) return;

    this.autoRecognizeTimer = setTimeout(() => {
      this.recognizeHandwriting();
    }, this.AUTO_RECOGNIZE_DELAY);
  }

  private clearAutoRecognizeTimer(): void {
    if (this.autoRecognizeTimer) {
      clearTimeout(this.autoRecognizeTimer);
      this.autoRecognizeTimer = null;
    }
  }

  private getCanvasImageBase64(): string | null {
    if (!this.canvas) return null;

    const dataUrl = this.canvas.toDataURL('image/png');
    if (!dataUrl) return null;

    return dataUrl.split(',')[1] || null;
  }

  recognizeHandwriting(): void {
    if (this.recognizing || !this.hasStroke) return;

    const imageBase64 = this.getCanvasImageBase64();
    if (!imageBase64) {
      this.errorMessage = 'Không lấy được dữ liệu ảnh.';
      return;
    }

    this.recognizing = true;
    this.errorMessage = '';

    this.handwritingService.recognize({
      imageBase64,
      language: 'ja'
    }).subscribe({
      next: (response: HandwritingRecognizeResponse) => {
        this.candidates = response?.candidates || [];
        if (this.candidates.length === 0) {
          this.errorMessage = response?.message || 'Không có kết quả gợi ý.';
        }
        this.recognizing = false;
      },
      error: (error: any) => {
        console.error('Lỗi nhận diện chữ viết tay:', error);

        const backendMessage =
          error?.error?.message ||
          error?.error?.error ||
          error?.message ||
          '';

        this.errorMessage = backendMessage
          ? `Nhận diện chữ thất bại: ${backendMessage}`
          : 'Nhận diện chữ thất bại.';

        this.recognizing = false;
      }
    });
  }

  clearCanvas(): void {
    if (!this.canvas || !this.ctx) return;

    this.clearAutoRecognizeTimer();

    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, rect.width, rect.height);

    this.hasStroke = false;
    this.candidates = [];
    this.errorMessage = '';
    this.recognizing = false;
  }

  chooseCandidate(candidate: string, event?: Event): void {
  event?.preventDefault();
  event?.stopPropagation();

  if (this.candidateSelecting) return;
  this.candidateSelecting = true;

  this.selected.emit(candidate);
  this.closePanel();

  setTimeout(() => {
    this.candidateSelecting = false;
  }, 200);
}

  closePanel(): void {
    this.clearAutoRecognizeTimer();
    this.closed.emit();
  }
}