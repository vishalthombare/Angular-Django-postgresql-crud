import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http : HttpClient) { }

  getCustomerData(){
    return this.http.get(`${environment.apiUrl}`.concat('/customer/'));
  }

  saveCustomerData(formValue) {
    if(formValue.id){      
      return this.http.put(`${environment.apiUrl}`.concat(`/customer/${formValue.id}/`), formValue).pipe(map(data => {        
        data['status'] = 2;
        return data;
      })
      );
    }
    else{
      delete formValue["id"]
      return this.http.post(`${environment.apiUrl}`.concat('/customer/'),formValue).pipe(map(data => {      
        data['status'] = 1;
        return data;
      }))
    }    
  }

  deleteCustomerData(id){
    return this.http.delete(`${environment.apiUrl}`.concat(`/customer/${id}/`))
      .pipe(map(data => {
        return data;
      }));
  }
  
}
