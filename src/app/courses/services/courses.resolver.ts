import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, first, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { CoursesActions } from '../courses.ngrx.store/courses.actions';
import { CourseState } from '../courses.ngrx.store/courses.reducers';

@Injectable({
  providedIn: 'root',
})
export class CoursesResolver implements Resolve<boolean> {
  loading = false;
  constructor(private store: Store<CourseState>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.store.pipe(
      tap(() => {
        if (!this.loading) {
          this.loading = true;
          this.store.dispatch(CoursesActions.loadAllCourses());
        }
      }),
      first(),
      finalize(() => {
        this.loading = false;
      })
    );
  }
}
