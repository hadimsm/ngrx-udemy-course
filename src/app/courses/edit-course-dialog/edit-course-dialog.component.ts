import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../model/course';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { CourseState } from '../courses.ngrx.store/courses.reducers';
import { Store } from '@ngrx/store';
import { CoursesActions } from '../courses.ngrx.store/courses.actions';
import { CourseEntityService } from '../services/course-entity.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css'],
})
export class EditCourseDialogComponent {
  form: FormGroup;

  dialogTitle: string;

  course: Course;

  mode: 'create' | 'update';

  loading$: Observable<boolean>;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EditCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private courseEntityService: CourseEntityService) {
    this.dialogTitle = data.dialogTitle;
    this.course = data.course;
    this.mode = data.mode;

    const formControls = {
      description: ['', Validators.required],
      category: ['', Validators.required],
      longDescription: ['', Validators.required],
      promo: ['', []],
    };

    if (this.mode == 'update') {
      this.form = this.fb.group(formControls);
      this.form.patchValue({ ...data.course });
    } else if (this.mode == 'create') {
      this.form = this.fb.group({
        ...formControls,
        url: ['', Validators.required],
        iconUrl: ['', Validators.required],
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.mode === 'update') {
      const course: Course = {
        ...this.course,
        ...this.form.value,
      };

      this.courseEntityService.update(course);
    }
    this.onClose();
  }
}
