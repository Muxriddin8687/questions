import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, tap } from "rxjs";
import { environment } from "src/environments/environment";
import removeEmptyProperties from "@shared/utils/removeEmptyProperties.util";

@Injectable({
    providedIn: "root",
})
export class DefaultService<T, Ti, Tu> {
    _http = inject(HttpClient);
    _api = environment.api;
    reloadDataAction$$ = new Subject<boolean>();

    getAll<T>() {
        return this._http.get<T>(this._api);
    }

    getOne<Tu>(id: number, params?: string) {
        return this._http.get<Tu>(this._api + "/" + id + "?" + params);
    }

    getByFilter<T>(filter: Tu | any) {
        let data = removeEmptyProperties(filter);
        data = new URLSearchParams(data).toString();
        return this._http.get<T>(this._api + "?" + data);
    }

    insert(form: Ti) {
        return this._http
            .post<Ti>(this._api, form)
            .pipe(tap(() => this.reloadData()));
    }

    delete(id: number) {
        return this._http
            .delete(this._api + "/" + id)
            .pipe(tap(() => this.reloadData()));
    }

    update(form: Tu | any) {
        return this._http
            .put(this._api + "/" + form!.id, form)
            .pipe(tap(() => this.reloadData()));
    }

    patch(form: Tu | any) {
        return this._http
            .patch(this._api + "/" + form!.id, form)
            .pipe(tap(() => this.reloadData()));
    }

    reloadData() {
        this.reloadDataAction$$.next(true);
    }
}
