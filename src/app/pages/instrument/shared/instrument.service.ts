import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';

@Injectable()
export class InstrumentService {

  constructor(private api: ZxApi) { }
}
