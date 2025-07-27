import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Associate 360 Platform';
  isLoggedIn = false;
  currentUser: any = null;
  sidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Check if user is logged in
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });

    // Check for existing token on app start
    this.authService.validateToken().subscribe();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.toastr.success('Logged out successfully');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Force logout even if API call fails
        this.authService.clearToken();
        this.router.navigate(['/login']);
      }
    });
  }

  get userInitials(): string {
    if (!this.currentUser) return '';
    const firstInitial = this.currentUser.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.currentUser.lastName?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial;
  }

  get userRole(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role?.replace('_', ' ').toUpperCase() || '';
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}