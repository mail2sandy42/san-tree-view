import { Component } from '@angular/core';
import { DemoPageComponent } from './demo-page/demo-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DemoPageComponent],
  template: `
    <app-demo-page></app-demo-page>
  `,
})
export class AppComponent {}