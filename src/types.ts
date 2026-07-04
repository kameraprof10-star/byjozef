export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  status: 'active' | 'risk' | 'defended';
  shield: number; // percentage (0-100)
  description: string;
  lastEvent: string;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface DefenseSettings {
  ddosScrubbing: boolean;
  geoIPBlocking: boolean;
  deepPacketInspection: boolean;
}

export interface OwaspVulnerability {
  id: string;
  code: string;
  title: string;
  description: string;
  prevention: string[];
}

export interface HygieneTip {
  id: string;
  title: string;
  category: 'şifrə' | 'şəbəkə' | 'cihaz';
  description: string;
  action: string;
  bookmarked: boolean;
}

export interface SimulationStep {
  text: string;
  type: 'info' | 'warning' | 'success' | 'error';
  delay: number; // millisecond delay after this step
  sound?: {
    frequency: number;
    type: OscillatorType;
    duration: number;
  };
}
