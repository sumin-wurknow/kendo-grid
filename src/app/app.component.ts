import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss','./pdf-styles.css'],
  //providers: [ProductService, StatePersistingService],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  listItems = ['Current Week(5th - 9th April)'];
}
