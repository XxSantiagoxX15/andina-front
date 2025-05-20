import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { loginService } from '../../services/login.service';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css'
})
export class SidePanelComponent {
  isVisible = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private loginService: loginService
  ) {}

  showPanel() {
    this.isVisible = true;
  }

  hidePanel() {
    this.isVisible = false;
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.location.reload();
      }
    });
  }
}
