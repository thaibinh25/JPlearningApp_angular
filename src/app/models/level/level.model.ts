export interface LevelResponse {
  id: number;
  name: string;     // N5, N4, N3...
  code?: string;    // optional nếu backend có
  description?: string;
}