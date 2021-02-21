import { ChangeDetectionStrategy, Component, VERSION } from "@angular/core";
import { TimelineItem } from "./model";

@Component({
  selector: "my-app",
  template: `
    ciao
    <timeline
      style="height:200px; display: block"
      [timelineItems]="items"
    ></timeline>
  `,
  styles: [""],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  constructor() {
    this.items = [];
    for (let i = 0; i < 1000; ++i) {
      this.items.push({
        left: `left-${i}`,
        right: `right-${i}`,
        name: `name-${i}`
      });
    }
    this.randomDateGenerator();
  }

  items: TimelineItem[];

  /// Metto delle date progressive ogni random item per test divisore date
  private randomDateGenerator() {
    const rangeItem = (Math.random() * 6).toPrecision(1);
    for (let i = 0; i < 1000; i + rangeItem) {
      this.items[i].date = "hello";
    }
    console.log(this.items, "2");
  }
}
