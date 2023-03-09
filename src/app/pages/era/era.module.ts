import { NgModule } from "@angular/core";
import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { SharedModule } from "../shared/shared.module";
import { EraCreateComponent } from "./era-create/era-create.component";
import { EraService } from "./shared/era.service";

@NgModule({
    declarations: [EraCreateComponent],
    imports: [SharedModule, EditorModule, AutocompleteLibModule],
    exports: [EraCreateComponent],
    providers: [
        EraService, 
        {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
    ]
})

export class EraModule{}