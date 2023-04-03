import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { SharedModule } from "../shared/shared.module";
import { SpotifyService } from "./shared/spotify.service";
import { SpotifyStatisticsComponent } from "./spotify-statistics/spotify-statistics.component";


@NgModule({
    declarations: [SpotifyStatisticsComponent],
    imports: [SharedModule, EditorModule, AutocompleteLibModule, CommonModule],
    exports: [SpotifyStatisticsComponent ],
    providers: [
        SpotifyService,
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
})

export class SpotifyModule {}