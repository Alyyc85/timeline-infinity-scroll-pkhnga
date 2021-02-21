import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { TimelineItem } from "./model";
import { BehaviorSubject, noop, Observable } from "rxjs";
@Component({
  selector: "timeline",
  template: `
    <div class="timeline-container" (scroll)="onListScroll($event)">
      <div
        class="timeline-item"
        *ngFor="let item of (virtualOptions$ | async); index as i"
      >
        <div class="left">{{ item.left }}</div>
        <span class="line"></span>
        <div class="right">{{ item.right }}</div>
      </div>
    </div>
  `,
  styleUrls: ["./timeline.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnChanges {
  @Input() timelineItems: TimelineItem[];

  $virtualOptions: BehaviorSubject<TimelineItem[]> = new BehaviorSubject<
    TimelineItem[]
  >([]);
  virtualOptions$: Observable<
    TimelineItem[]
  > = this.$virtualOptions.asObservable();

  private functionPusher: () => void = noop;
  private lastScroll = 0;
  private sequenceId = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.timelineItems) {
      this.resetVirtualList();
    } // if
  } // ngOnChanges

  private resetVirtualList(): void {
    this.lastScroll = 0;
    const filteredList = this.timelineItems;
    let actualList: TimelineItem[] = [];
    const size = filteredList.length;
    let added = actualList.length;
    const bound = 20;
    const id = ++this.sequenceId;
    this.functionPusher = () => {
      if (added <= size && this.sequenceId === id) {
        actualList = [
          ...actualList,
          ...filteredList.slice(
            added,
            added + bound < size ? added + bound : size
          )
        ];
        this.$virtualOptions.next(actualList);
        added += bound;
      } // if
    };
    this.functionPusher();
  }

  onListScroll({ target }: Event) {
    const { scrollHeight, scrollTop, clientHeight } = target as HTMLElement;
    if (
      scrollTop + clientHeight + 100 > scrollHeight &&
      scrollTop > this.lastScroll
    ) {
      this.functionPusher();
    } // if
    this.lastScroll = scrollTop;
  } // onGridScroll
}
