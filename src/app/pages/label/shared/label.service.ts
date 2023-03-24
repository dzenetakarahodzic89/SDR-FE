import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabelApi } from './label-api.constant';
import { LabelCreateRequest, LabelResponse } from './label.model';

@Injectable()
export class LabelService {
  constructor(private api: ZxApi) {}


  searchLabels(name: String, founder: number, sortBy: number): Observable<LabelResponse[]> {
    let query = "?"

    if (name != null)
      query += "name=" + name;

    if (founder != null)
      query += "&founder=" + founder;

    switch (sortBy) {
      case 0:
        query += "&sortBy=NoOfArtists";
        break;
      case 1:
        query += "&sortBy=LastEdit";
        break;
      case 2:
        query += "&sortBy=Alphabetical";
        break;

    }
    query = query.replace("?&", "?");

    return this.api.get(LabelApi.SEARCH_LABELS + query).pipe(
      map((response) => {
        const labels = response['payload'] as LabelResponse[];
        return labels;
      })
    )
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

