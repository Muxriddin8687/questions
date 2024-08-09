import { Injectable } from '@angular/core';
import { DefaultService } from '@core/services/default.service';
import { ISubject } from '../models/subject.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService extends DefaultService<ISubject, any, any> {

  constructor() {
    super('subjects');
  }

  override getAll<T>(): Observable<any> {
    return this._http.get<T[]>(this._api + '/page?sort=title&size=500').pipe(tap((res: any) => this.data.set(res)));
  }
}
