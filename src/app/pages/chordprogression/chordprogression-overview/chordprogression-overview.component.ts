import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ToastrService } from 'ngx-toastr';
import { ConnectedMediaService } from '../../shared/connected-media/connected-media.service';
import { ChordProgressionOverview, SongChorProgressionResponse } from '../shared/chordprogression.model';
import { ChordProgressionService } from '../shared/chordprogression.service';

@Component({
  selector: 'app-chordprogression-overview',
  templateUrl: './chordprogression-overview.component.html',
  styleUrls: ['./chordprogression-overview.component.scss']
})
export class ChordprogressionOverviewComponent implements OnInit {
  chordIsLoading = false;
  chordProgression: ChordProgressionOverview;
  numOfSongs: number;
  linkedSongs:SongChorProgressionResponse[];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private chordProgressionService: ChordProgressionService,
    private connectedMediaService: ConnectedMediaService,
    private toastr: ToastrService) { }

    public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
      hideExpand: true,
      hideHeader: true,
    });
    public addSongBtn: ZxButtonModel = new ZxButtonModel({
      items: [
        {
          icon: 'fal fa-solid fa-music',
          name: 'Add song button',
          label: 'Add song',
         // action: () => this.router.navigate(['./chord-progress/' + this.chordProgression.id + '/add-song'])
        }
      ],
    });
    public editBtn: ZxButtonModel = new ZxButtonModel({
      items: [
        {
          icon: 'fal fa-edit',
          name: 'Edit button',
          label: 'Edit Chord Progression',
          //action: () => this.router.navigate(['./chord-progress/update/' + this.chordProgression.id])
        },
      ],
    });
    public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
      hideExpand: true,
      label: 'Chord Progression information',
    });
    public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
      hideExpand: true,
      label: 'Chord Progression details',
    });
    public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
      hideExpand: true,
    });
    songsColumnDefs = [
      {
        field: 'songName',
        headerName: 'Song name',
        flex: 1,
        floatingFilter: false,
      },
      {
        field: 'genreName',
        headerName: 'Genre',
        flex: 1,
        floatingFilter: false,
      },
      {
        field: 'flagAbbriviation',
        headerName: 'Country',
        flex: 1,
        floatingFilter: false,
      },
      {
        field: 'playtime',
        headerName: 'PlayTime',
        flex: 1,
        floatingFilter: false,
      }
    ];
  
    public songsGridOptions: GridOptions = {
      columnDefs: this.songsColumnDefs,
      rowModelType: 'clientSide',
      enableColResize: true,
      //onRowClicked: (event) => {
        //this.router.navigate(['./person/' + event['data']['id'] + '/overview']);
      //}
    } as GridOptions;
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.chordIsLoading=true;
    this.route.params.subscribe(params => {
      this.chordProgressionService.getChord(params.id).subscribe(response => {
        this.chordProgression = response;
        this.chordProgressionService.getSongsChord(params.id).subscribe(response => {
          this.linkedSongs=response;
  
        })
      this.chordIsLoading=false;
      });
    });
    
    ;
   
  }

}
