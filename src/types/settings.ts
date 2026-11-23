export type GraphicsQuality = 'low' | 'medium' | 'high';
export type TargetFps = 30 | 60 | 120;

export interface AppSettings {
  volume: number; // 0 - 100
  graphicsQuality: GraphicsQuality;
  targetFps: TargetFps;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  volume: 80,
  graphicsQuality: 'high',
  targetFps: 60,
};
