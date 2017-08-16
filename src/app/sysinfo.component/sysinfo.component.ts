import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgXCookies } from 'ngx-cookies';

import { SysInfo } from '../data_model/sysinfo/sysinfo';
import { SysInfoService } from '../services/sysinfo.service';
import { TokenService } from '../services/login/token.service';

@Component({
  selector: 'app-sysinfo',
  templateUrl: './sysinfo.component.html',
  styleUrls: ['./sysinfo.component.css']
})
export class SysInfoComponent implements OnInit {
  sysinfo: SysInfo = {
    cpus: null,
    mem: {
      free: 0,
      total: 0
    },
    platform: {
      type: '',
      arch: ''
    },
    uptime: 0
  };

  // Memory chart
  private memoryChartLabels: string[] = ['Memoria libre', 'Memoria en uso'];
  private memoryChartData: number[] = [0, 0];

  constructor(
    private location: Location,
    private router: Router,
    private sysinfoService: SysInfoService,
    private tokenServ: TokenService
  ) {}

  ngOnInit() {
    if (NgXCookies.exists('access_token')) {
      this.tokenServ.validateToken().catch(this.logout.bind(this));
    } else {
      this.logout();
    }

    this.sysinfoService.getSysInfo().then(res => {
      this.sysinfo = res;
      this.memoryChartData = [this.humanReadable(this.sysinfo.mem.free),
                              this.humanReadable(this.sysinfo.mem.total - this.sysinfo.mem.free)];

      setInterval(() => this.sysinfo.uptime += 1, 1000);
    });
  }

  private humanReadable(bytes: number): number {
    return Math.round( bytes / Math.pow(10, 9) * 10) / 10;
  }

  private secondsToHms(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    seconds = seconds - hours * 3600;

    const minutes = Math.floor(seconds / 60);

    seconds = seconds - minutes * 60;

    return hours + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ':' + (seconds >= 10 ? seconds : '0' + seconds)
  }

  private getOsLogo(os: string): string {
    if (os === 'Linux') {
      return '../../assets/tux.png';
    }

    if (os === 'Darwin') {
      return '../../assets/mac.png';
    }

    if (os === 'Windows_NT') {
      return '../../assets/win.png';
    }
  }

  private goBack(): void {
    this.location.back();
  }

  private logout(): void {
    NgXCookies.deleteCookie('access_token');
    NgXCookies.deleteCookie('token_type');
    this.router.navigateByUrl('/login');
  }
}
