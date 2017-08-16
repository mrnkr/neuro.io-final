import { Cpu } from './cpu';
import { Platform } from './platform';
import { Memory } from './memory';

export interface SysInfo {
  cpus: Cpu[];
  mem: Memory;
  platform: Platform;
  uptime: number;
}
