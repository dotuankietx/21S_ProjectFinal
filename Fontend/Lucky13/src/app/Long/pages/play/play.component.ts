import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardDataService } from 'src/app/services/card-data.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  private _docSub: Subscription;

  constructor(
    public cardDataService: CardDataService,
    public docDataService: DocumentService

  ) { }

  ngOnInit(): void {
    this.docDataService.getSocketID()
  }
  letStart() {
    this.cardDataService.isPlaying = true
    this.docDataService.letStart()
  }
  ngOnDestroy() {
    this._docSub.unsubscribe();
  }
}
