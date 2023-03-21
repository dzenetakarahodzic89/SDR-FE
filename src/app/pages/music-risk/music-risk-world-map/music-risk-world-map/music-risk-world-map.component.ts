import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';

@Component({
  selector: 'app-music-risk-world-map',
  templateUrl: './music-risk-world-map.component.html',
  styleUrls: ['./music-risk-world-map.component.scss'],
})
export class MusicRiskWorldMapComponent implements OnInit {
  dataIsLoading = false;
  constructor(private route: ActivatedRoute) {}
  public attackBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-swords',
        label: 'Attack Country',
        action: () => {},
      },
    ],
  });
  public viewAndAlterRoasterBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-street-view',
        label: 'View and Alter Roster',
        action: () => {},
      },
    ],
  });
  public viewStandingsBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-layer-group',
        label: 'View Standings',
        action: () => {},
      },
    ],
  });
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.route.params.subscribe((params) => {
      console.log(params.id);
    });
  }
}
