// import {
//   AfterViewInit,
//   Component,
//   ElementRef,
//   EventEmitter,
//   Input,
//   OnDestroy,
//   Output,
//   ViewChild
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   HandwritingRecognizeResponse,
//   HandwritingService
// } from '../../services/handwriting.service';

// type HandwritingField =
//   | 'inputKanji'
//   | 'inputKana'
//   | 'inputHanViet'
//   | 'inputMeaningVi';

// @Component({
//   selector: 'app-handwriting-panel',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './handwriting-panel.component.html',
//   styleUrl: './handwriting-panel.component.scss'
// })
// export class HandwritingPanelComponent implements AfterViewInit, OnDestroy {
//   @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

//   @Input() field: HandwritingField | null = null;

//   @Output() closed = new EventEmitter<void>();
//   @Output() selected = new EventEmitter<string>();

//   candidates: string[] = [];
//   loading = false;
//   errorMessage = '';

//   strokeCount = 0;
//   pointCount = 0;

//   private canvas!: HTMLCanvasElement;
//   private ctx!: CanvasRenderingContext2D;
//   private drawing = false;

//   private logicalWidth = 1000;
//   private logicalHeight = 360;

//   private strokes: { x: number; y: number }[][] = [];
//   private currentStroke: { x: number; y: number }[] = [];

//   constructor(private handwritingService: HandwritingService) {}

//   ngAfterViewInit(): void {
//     this.canvas = this.canvasRef.nativeElement;
//     const context = this.canvas.getContext('2d');

//     if (!context) {
//       this.errorMessage = 'Không khởi tạo được canvas.';
//       return;
//     }

//     this.ctx = context;
//     this.setupCanvas();
//     this.bindEvents();
//   }

//   ngOnDestroy(): void {
//     if (!this.canvas) return;

//     this.canvas.removeEventListener('pointerdown', this.onPointerDown);
//     this.canvas.removeEventListener('pointermove', this.onPointerMove);
//     this.canvas.removeEventListener('pointerup', this.onPointerUp);
//     this.canvas.removeEventListener('pointerleave', this.onPointerUp);
//     this.canvas.removeEventListener('pointercancel', this.onPointerUp);
//   }

//   private setupCanvas(): void {
//     const ratio = window.devicePixelRatio || 1;

//     this.canvas.width = this.logicalWidth * ratio;
//     this.canvas.height = this.logicalHeight * ratio;
//     this.canvas.style.width = '100%';
//     this.canvas.style.height = `${this.logicalHeight}px`;
//     this.canvas.style.touchAction = 'none';

//     this.ctx.setTransform(1, 0, 0, 1, 0, 0);
//     this.ctx.scale(ratio, ratio);

//     this.ctx.lineWidth = 8;
//     this.ctx.lineCap = 'round';
//     this.ctx.lineJoin = 'round';
//     this.ctx.strokeStyle = '#000000';

//     this.paintBackground();
//     this.resetStrokeData();
//   }

//   private paintBackground(): void {
//     this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
//     this.ctx.fillStyle = '#ffffff';
//     this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);

//     this.drawGuideLines();
//   }

//   private drawGuideLines(): void {
//     this.ctx.save();
//     this.ctx.strokeStyle = '#e5e7eb';
//     this.ctx.lineWidth = 1;

//     this.ctx.beginPath();
//     this.ctx.moveTo(0, this.logicalHeight / 2);
//     this.ctx.lineTo(this.logicalWidth, this.logicalHeight / 2);

//     this.ctx.moveTo(this.logicalWidth / 2, 0);
//     this.ctx.lineTo(this.logicalWidth / 2, this.logicalHeight);

//     this.ctx.stroke();
//     this.ctx.restore();

//     this.ctx.strokeStyle = '#000000';
//     this.ctx.lineWidth = 8;
//   }

//   private bindEvents(): void {
//     this.canvas.addEventListener('pointerdown', this.onPointerDown);
//     this.canvas.addEventListener('pointermove', this.onPointerMove);
//     this.canvas.addEventListener('pointerup', this.onPointerUp);
//     this.canvas.addEventListener('pointerleave', this.onPointerUp);
//     this.canvas.addEventListener('pointercancel', this.onPointerUp);
//   }

//   private getPoint(event: PointerEvent): { x: number; y: number } {
//     const rect = this.canvas.getBoundingClientRect();

//     const scaleX = this.logicalWidth / rect.width;
//     const scaleY = this.logicalHeight / rect.height;

//     return {
//       x: +((event.clientX - rect.left) * scaleX).toFixed(2),
//       y: +((event.clientY - rect.top) * scaleY).toFixed(2)
//     };
//   }

//   private updateCounters(): void {
//     this.strokeCount = this.strokes.length;
//     this.pointCount = this.strokes.reduce((sum, stroke) => sum + stroke.length, 0);
//   }

//   private resetStrokeData(): void {
//     this.strokes = [];
//     this.currentStroke = [];
//     this.strokeCount = 0;
//     this.pointCount = 0;
//     this.candidates = [];
//     this.errorMessage = '';
//   }

//   onPointerDown = (event: PointerEvent): void => {
//     event.preventDefault();

//     this.drawing = true;
//     this.canvas.setPointerCapture?.(event.pointerId);

//     const point = this.getPoint(event);
//     this.currentStroke = [point];

//     this.ctx.beginPath();
//     this.ctx.moveTo(point.x, point.y);

//     this.candidates = [];
//     this.errorMessage = '';
//   };

//   onPointerMove = (event: PointerEvent): void => {
//     if (!this.drawing) return;

//     event.preventDefault();

//     const point = this.getPoint(event);
//     this.currentStroke.push(point);

//     this.ctx.lineTo(point.x, point.y);
//     this.ctx.stroke();
//   };

//   onPointerUp = (event?: PointerEvent): void => {
//     if (!this.drawing) return;

//     event?.preventDefault();

//     this.drawing = false;

//     if (this.currentStroke.length > 0) {
//       this.strokes.push([...this.currentStroke]);
//       this.currentStroke = [];
//       this.updateCounters();
//     }
//   };

//   clearCanvas(): void {
//     this.paintBackground();
//     this.resetStrokeData();
//   }

//   undoLastStroke(): void {
//     if (this.strokes.length === 0) return;

//     this.strokes.pop();
//     this.redrawAllStrokes();
//     this.updateCounters();
//     this.candidates = [];
//     this.errorMessage = '';
//   }

//   private redrawAllStrokes(): void {
//     this.paintBackground();

//     this.ctx.lineWidth = 8;
//     this.ctx.lineCap = 'round';
//     this.ctx.lineJoin = 'round';
//     this.ctx.strokeStyle = '#000000';

//     for (const stroke of this.strokes) {
//       if (!stroke.length) continue;

//       this.ctx.beginPath();
//       this.ctx.moveTo(stroke[0].x, stroke[0].y);

//       for (let i = 1; i < stroke.length; i++) {
//         this.ctx.lineTo(stroke[i].x, stroke[i].y);
//       }

//       this.ctx.stroke();
//     }
//   }

//   recognize(): void {
//     if (this.loading) return;

//     if (this.strokes.length === 0) {
//       this.errorMessage = 'Bạn chưa viết gì để nhận diện.';
//       return;
//     }

//     this.loading = true;
//     this.errorMessage = '';
//     this.candidates = [];

//     const imageBase64 = this.canvas.toDataURL('image/png');
//     const language = this.resolveLanguage();

//     this.handwritingService.recognize({
//       imageBase64,
//       language
//     }).subscribe({
//       next: (response: HandwritingRecognizeResponse) => {
//         this.candidates = response?.candidates ?? [];

//         if (this.candidates.length === 0) {
//           this.errorMessage = 'Không có kết quả gợi ý. Hãy viết lại rõ hơn.';
//         }

//         this.loading = false;
//       },
//       error: (error: any) => {
//         console.error('Recognize handwriting error:', error);
//         this.errorMessage =
//           error?.error?.message || 'Nhận diện chữ viết thất bại.';
//         this.loading = false;
//       }
//     });
//   }

//   private resolveLanguage(): string {
//     if (this.field === 'inputMeaningVi' || this.field === 'inputHanViet') {
//       return 'vi';
//     }

//     return 'ja';
//   }

//   chooseCandidate(text: string): void {
//     this.selected.emit(text);
//   }

//   close(): void {
//     this.closed.emit();
//   }
// }

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

  chooseCandidate(candidate: string): void {
    this.selected.emit(candidate);
  }

  closePanel(): void {
    this.clearAutoRecognizeTimer();
    this.closed.emit();
  }
}