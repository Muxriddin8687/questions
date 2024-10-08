import { Inject, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Subscription, take, tap } from "rxjs";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefaultService<T, Ti, Tu> {
  _http = inject(HttpClient);
  _api = environment.api;
  filterParams: any = {
    size: 20,
    page: 0,
  };
  defaultParams = {};

  reloadDataAction$$ = new Subject<boolean>();
  subscription = new Subscription();
  data = signal<any>([]);

  constructor(@Inject("url") public url: string) {
    this._api += this.url;
  }

  loadData() {
    this.getByFilter()
      .pipe(
        take(1),
        tap((data) => this.data.set(data))
      )
      .subscribe();
  }

  getAll<T>() {
    return this._http.get<T[]>(this._api + "/page").pipe(tap((res: any) => this.data.set(res)));
  }

  getByList() {
    return this._http.get<any>(this._api + "/list");
  }

  getOne<Tu>(id: number, params: string = "") {
    return this._http.get<Tu>(this._api + "/" + id + "?" + params);
  }

  getByFilter<T>(filter?: Tu | any) {
    let data = this.removeEmptyProperties(filter ?? {});
    const tableFilter = this.removeEmptyProperties(this.filterParams ?? {});
    data = { ...tableFilter, ...data };
    data = { ...data, ...this.defaultParams };
    const newParams = new URLSearchParams(data).toString();

    return this._http.get<T>(this._api + "/page?" + newParams).pipe(tap((res: any) => this.data.set(res)));
  }

  insert(form: Ti) {
    return this._http.post<Ti>(this._api, form).pipe(tap(() => this.reloadData()));
  }

  delete(id: number) {
    return this._http.delete(this._api + "/" + id).pipe(tap(() => this.reloadData()));
  }

  update(form: Tu | any) {
    return this._http.put(this._api + "/" + form!.id, form).pipe(tap(() => this.reloadData()));
  }

  patch(form: Tu | any) {
    return this._http.patch(this._api + "/" + form!.id, form).pipe(tap(() => this.reloadData()));
  }

  reloadData() {
    this.reloadDataAction$$.next(true);
    this.loadData();
  }

  removeEmptyProperties(filterParams: object) {
    return Object.fromEntries(
      Object.entries(filterParams).filter(([, v]) => v !== null && v !== undefined && v !== "")
    );
  }
}
