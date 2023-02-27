import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { LabelApi } from './label-api.constant';

@Injectable()
export class LabelService {
  constructor(private api: ZxApi) {}

  getLabel(id: number) {
    return this.api.get(LabelApi.GET_LABEL.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
}
