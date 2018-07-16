import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';


export class ErrorHandler {
    getError(error: HttpErrorResponse) {
        if (error.status === 401) {
            localStorage.removeItem('currentUser');
            window.location.href = '/';
        }
        return throwError(error.message || 'Server Error');
    }
}
