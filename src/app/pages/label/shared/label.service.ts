import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabelApi } from './label-api.constant';
import { LabelCreateRequest, LabelResponse, LabelSearchRequest} from './label.model';

@Injectable()
export class LabelService {
  constructor(private api: ZxApi) {}


  searchLabels(searchParams: LabelSearchRequest) {
    return this.api.get(LabelApi.SEARCH_LABELS, searchParams).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getLabel(id: number) {
    return this.api.get(LabelApi.GET_LABEL.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  updateLabel(label: LabelCreateRequest, id: number) {
    return this.api
      .put(LabelApi.UPDATE_LABEL.replace('#', id.toString()), label)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  

  createLabel(label: LabelCreateRequest) {
    return this.api.post(LabelApi.CREATE_LABEL, label).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getPerson() {
    return this.api.get(LabelApi.GET_PERSON).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  
}

