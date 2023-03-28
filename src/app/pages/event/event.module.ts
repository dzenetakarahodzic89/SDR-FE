import { NgModule } from "@angular/core";
import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { SharedModule } from "../shared/shared.module";
import { EventOverviewComponent } from "./event-overview/event-overview.component";
import { EventSearchComponent } from "./event-search/event-search.component";
import { EventService } from "./shared/event.service";

@NgModule({
    declarations: [
        EventOverviewComponent,
        EventSearchComponent
    ],
    imports: [        
        SharedModule,
        EditorModule,
        AutocompleteLibModule
    ],
    exports: [
        EventOverviewComponent,
        EventSearchComponent      
    ],
    providers: [
        EventService,
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
    ]
})

export class EventModule {}