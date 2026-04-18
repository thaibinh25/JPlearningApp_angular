import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isUserMenuOpen = false;
  displayName = 'Người học';

  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const userJson = localStorage.getItem('user');

    if (!userJson) {
      this.displayName = 'Người học';
      return;
    }

    try {
      const user = JSON.parse(userJson);
      this.displayName =
        user?.fullName ||
        user?.full_name ||
        user?.fullname ||
        user?.name ||
        user?.username ||
        'Người học';
    } catch (error) {
      this.displayName = 'Người học';
    }
  }

  getAvatarText(): string {
    if (!this.displayName || this.displayName === 'Người học') {
      return 'U';
    }
    return this.displayName.trim().charAt(0).toUpperCase();
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  goToContinueLearning(): void {
    this.router.navigate(['/practice/start']);
  }

  goToProfile(event: MouseEvent): void {
  event.stopPropagation();
  this.closeUserMenu();

  setTimeout(() => {
    this.router.navigate(['/profile']);
  }, 0);
}

logout(event: MouseEvent): void {
  event.stopPropagation();
  this.closeUserMenu();

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  setTimeout(() => {
    this.router.navigate(['/login']);
  }, 0);
}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideMenu = this.elementRef.nativeElement
      .querySelector('.user-menu-wrapper')
      ?.contains(target);

    if (!clickedInsideMenu) {
      this.closeUserMenu();
    }
  }
}