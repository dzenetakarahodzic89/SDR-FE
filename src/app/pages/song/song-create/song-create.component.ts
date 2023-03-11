import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ToastrService } from 'ngx-toastr';
import {
  SongCreateRequest,
  SongResponse,
  SongLoV,
  ChordProgressionLoV,
  MainGenreLoV,
  SubgenreLoV,
} from '../shared/song.model';
import { SongService } from '../shared/song.service';

@Component({
  selector: 'app-song-create',
  templateUrl: './song-create.component.html',
  styleUrls: ['./song-create.component.scss'],
})
export class SongCreateComponent implements OnInit {
  private songList: SongLoV[];
  private chordProgressionList: ChordProgressionLoV[];
  private genreList: MainGenreLoV[];
  private subgenreList: SubgenreLoV[];

  private songId;
  public song: SongResponse;
  public model: SongCreateRequest;
  defaultImgUrl = 'http://172.20.20.45:82//vigor//img/mario.jpg';

  private updateSong: SongLoV;
  private updateChordProgression: ChordProgressionLoV;
  private updateGenre: MainGenreLoV;
  private updateSubgenre: SubgenreLoV;

  padIfOneChar(numConvertedToString: string) {
    if (numConvertedToString.length === 1) {
      return `0${numConvertedToString}`;
    } else return numConvertedToString;
  }

  buildPlaytimeFromParts(hours = 0, minutes = 0, seconds = 0) {
    return `${this.padIfOneChar(hours.toString())}:${this.padIfOneChar(
      minutes.toString()
    )}:${this.padIfOneChar(seconds.toString())}`;
  }

  printNewSong(newSong: SongCreateRequest) {
    console.log('newSong.id: ' + newSong.id);
    console.log('newSong.name: ' + newSong.name);
    console.log('newSong.information: ' + newSong.information);
    console.log('newSong.outlineText: ' + newSong.outlineText);
    console.log('newSong.dateOfRelease: ' + newSong.dateOfRelease);
    console.log('newSong.chordProgressionId: ' + newSong.chordProgressionId);
    console.log('newSong.playtime: ' + newSong.playtime);
    console.log('newSong.remixId: ' + newSong.remixId);
    console.log('newSong.coverId: ' + newSong.coverId);
    console.log('newSong.genreId: ' + newSong.genreId);
    console.log('newSong.coverImageData: ' + newSong.coverImageData);
    console.log('newSong.coverImage: ' + newSong.coverImage);
  }

  public formConfig = new Definition({
    name: 'createSong',
    template: 'ZxForm',
    disabled: false,
    children: [],
  });
  public imageFormConfig = new Definition({
    name: 'addCoverImage',
    template: 'ZxForm',
    disabled: false,
    children: [],
  });

  public tabConfig = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: true,
  });

  public overviewBlock = new ZxBlockModel({
    hideExpand: true,
    label: 'Add Song',
  });
  public informationBlock = new ZxBlockModel({
    hideExpand: true,
    label: 'Add Information',
  });

  public mainButtons = new ZxButtonModel({
    items: [
      {
        name: 'saveSong',
        layout: 'classic',
        label: 'Save',
        class: 'invert',
        action: () => this.saveSong(),
      },
      {
        name: 'cancel',
        layout: 'classic',
        class: 'danger invert',
        label: 'Cancel',
        action: () => this.redirectAfterCancel(),
      },
    ],
  });

  constructor(
    private songService: SongService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setTabs();
    this.setImageFormChildren();

    this.songService.getSongLoV().subscribe((response) => {
      this.songList = response;
      this.formConfig.children[3].list = response;
      this.formConfig.children[5].list = response;
    });

    this.songService.getChordProgressionLoV().subscribe((response) => {
      this.chordProgressionList = response;
      this.formConfig.children[7].list = response;
    });

    this.songService.getMainGenreLoV().subscribe((response) => {
      this.genreList = response;
      this.formConfig.children[8].list = response;
    });

    this.setFormChildren();

    this.model = new SongCreateRequest();
    this.songId = this.route.snapshot.paramMap.get('id');

    if (this.songId != null) {
      this.songService.getSong(this.songId).subscribe(
        (sr: SongResponse) => {
          this.overviewBlock.label = 'Edit song';
          this.informationBlock.label = 'Edit information';
          this.song = sr;
          this.model.name = sr.name;
          this.model.outlineText = sr.outlineText ?? this.model.outlineText;
          this.model.information = sr.information ?? this.model.information;
          this.model.dateOfRelease =
            sr.dateOfRelease ?? this.model.dateOfRelease;

          this.model.isRemix = sr.remixId === undefined ? false : true;
          this.model.isCover = sr.coverId === undefined ? false : true;
          if (this.model.isRemix === true) {
            this.formConfig.children[3].disabled = false;
          }
          if (this.model.isCover === true) {
            this.formConfig.children[5].disabled = false;
          }

          if (sr.playtime) {
            this.model.playtimeHours = +sr.playtime.slice(0, 2);
            this.model.playtimeMinutes = +sr.playtime.slice(3, 5);
            this.model.playtimeSeconds = +sr.playtime.slice(6, 8);
          }

          this.model.remixId = sr.remixId ?? this.model.remixId;
          this.model.coverId = sr.coverId ?? this.model.coverId;

          this.model.chordProgressionId =
            sr.chordProgressionId ?? this.model.chordProgressionId;

          this.model.genreId = sr.genreId;
          this.formConfig.children[9].disabled = false;

          this.songService
            .getSubgenreLoV(this.model.genreId)
            .subscribe((response) => {
              this.subgenreList = response;
              this.formConfig.children[9].list = response;
              this.model.subgenreId = sr.subgenreId ?? this.model.subgenreId;
            });

          if (sr.imageUrl) this.defaultImgUrl = sr.imageUrl;
        },
        (errorMsg: string) => {
          this.toastr.error('Song could not be loaded!');
        }
      );
    }
  }

  public setFormChildren() {
    this.formConfig.addChildren = [
      new Definition({
        template: 'ZxInput',
        class: ['col-24'],
        type: 'text',
        name: 'name',
        label: 'Name',
        validation: { required: true },
      }),
      new Definition({
        template: 'ZxTextarea',
        class: ['col-24', 'span-3'],
        type: 'textarea',
        name: 'outlineText',
        label: 'Outline Text',
      }),
      new Definition({
        template: 'ZxCheckbox',
        type: 'classic',
        class: ['col-1'],
        name: 'isRemix',
        label: 'Is Remix',
        onChecked: (event) => {
          this.formConfig.children[3].disabled =
            !this.formConfig.children[3].disabled;
        },
        onReset: (event) => {
          this.formConfig.children[3].disabled = true;
        },
      }),
      new Definition({
        template: 'ZxSelect',
        type: 'filter',
        class: ['col-11'],
        name: 'remixId',
        label: 'Song',
        list: this.songList,
        defaultValue: this.updateSong,
        disabled: true,
      }),
      new Definition({
        template: 'ZxCheckbox',
        type: 'classic',
        name: 'isCover',
        class: ['col-1'],
        label: 'Is Cover',
        onChecked: (event) => {
          this.formConfig.children[5].disabled =
            !this.formConfig.children[5].disabled;
        },
        onReset: (event) => {
          this.formConfig.children[5].disabled = true;
        },
      }),
      new Definition({
        template: 'ZxSelect',
        type: 'filter',
        class: ['col-11'],
        name: 'coverId',
        label: 'Song',
        list: this.songList,
        defaultValue: this.updateSong,
        disabled: true,
      }),
      new Definition({
        template: 'ZxDate',
        class: ['col-12', 'mt-10', 'mb-10'],
        type: 'date',
        name: 'dateOfRelease',
        label: 'Date Of Release',
      }),
      new Definition({
        template: 'ZxSelect',
        type: 'select',
        class: ['col-12', 'mt-10', 'mb-10'],
        name: 'chordProgressionId',
        label: 'Chord Progression',
        list: this.chordProgressionList,
        defaultValue: this.updateChordProgression,
      }),
      new Definition({
        template: 'ZxSelect',
        type: 'select',
        class: ['col-6'],
        name: 'genreId',
        label: 'Main Genre',
        validation: { required: true },
        list: this.genreList,
        defaultValue: this.updateGenre,
        onSelect: (item) => {
          this.formConfig.children[9].disabled = false;

          this.songService
            .getSubgenreLoV(this.model.genreId)
            .subscribe((response) => {
              this.subgenreList = response;
              this.formConfig.children[9].list = response;
            });
        },
        onUnselect: (item) => {
          this.formConfig.children[9].disabled = true;
        },
        onReset: (event) => {
          this.formConfig.children[9].disabled = true;
        },
      }),
      new Definition({
        template: 'ZxSelect',
        type: 'select',
        class: ['col-6'],
        name: 'subgenreId',
        label: 'Subgenre',
        list: this.subgenreList,
        defaultValue: this.updateSubgenre,
        disabled: true,
      }),
      new Definition({
        template: 'ZxInput',
        type: 'number',
        class: ['col-2'],
        name: 'playtimeHours',
        label: 'Playtime Hours',
        validation: { min: 0 },
      }),
      new Definition({
        template: 'ZxInput',
        type: 'number',
        class: ['col-2'],
        name: 'playtimeMinutes',
        label: 'Playtime Minutes',
        validation: { min: 0 },
      }),
      new Definition({
        template: 'ZxInput',
        type: 'number',
        class: ['col-2'],
        name: 'playtimeSeconds',
        label: 'Playtime Seconds',
        validation: { min: 0 },
      }),
    ];
  }

  public setImageFormChildren() {
    this.imageFormConfig.addChildren = [
      new Definition({
        template: 'ZxFile',
        class: ['col-24'],
        type: 'select',
        name: 'coverImage',
        multiple: false,
        label: 'Choose cover image:',
        onSelect: () => this.readFile(),
      }),
    ];
  }

  public setTabs() {
    this.tabConfig.items = [
      { id: 'overviewTab', name: 'overviewTab', label: 'Overview' },
      { id: 'informationTab', name: 'informationTab', label: 'Information' },
    ];
  }

  private redirectAfterCancel() {
    if (this.song) {
      this.router.navigateByUrl('/song/' + this.songId + '/overview');
    } else {
      this.router.navigateByUrl('/song/search');
    }
  }

  private readFile() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (res) => {
        this.model.coverImageData = res.target.result;
        resolve(res.target.result);
      };
      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(this.model.coverImage_files[0]);
    });
  }

  async saveSong() {
    if (!this.formConfig.isValid) {
      this.toastr.error('Fill in required fields!');
      return;
    }

    if (this.model.coverImage_files && this.model.coverImage_files[0]) {
      await this.readFile();
    }

    let newSong = new SongCreateRequest();
    newSong.name = this.model.name;

    newSong.information =
      this.model.information === '' ? undefined : this.model.information;

    newSong.outlineText =
      this.model.outlineText === '' ? undefined : this.model.outlineText;

    newSong.dateOfRelease = this.model.dateOfRelease;
    newSong.chordProgressionId = this.model.chordProgressionId;

    if (
      this.model.playtimeHours !== undefined ||
      this.model.playtimeMinutes !== undefined ||
      this.model.playtimeSeconds !== undefined
    ) {
      newSong.playtime = this.buildPlaytimeFromParts(
        this.model.playtimeHours,
        this.model.playtimeMinutes,
        this.model.playtimeSeconds
      );
    }

    newSong.remixId =
      this.model.isRemix === false ? undefined : this.model.remixId;

    newSong.coverId =
      this.model.isCover === false ? undefined : this.model.coverId;

    if (
      this.model.genreId !== undefined &&
      this.model.subgenreId !== undefined
    ) {
      newSong.genreId = this.model.subgenreId;
    } else {
      newSong.genreId = this.model.genreId;
    }

    newSong.coverImageData = this.model.coverImageData;
    newSong.coverImage = this.model.coverImage;

    if (!this.songId) {
      this.songService.createSong(newSong).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Song created!');
            this.router.navigateByUrl('/song/search');
          } else {
            this.toastr.error('Song creation failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Song creation failed!');
        }
      );
    } else {
      newSong['id'] = +this.songId;
      this.songService.updateSong(+this.songId, newSong).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Song edited!');
            this.router.navigateByUrl('/song/' + this.songId + '/overview');
          } else {
            this.toastr.error('Song edit failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Song edit failed!');
        }
      );
    }
  }
}
