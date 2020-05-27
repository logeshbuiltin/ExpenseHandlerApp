import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/assets/properties';


@Injectable()
export class DataServiceProvider {

    static readonly DATE_DATA_URL = 'items/user/';
    static readonly SAVE_ITEM_URL = 'item/'; 

    constructor(
        public http: HttpClient,
    ){}

    public saveExpense(userId, expenseDetails) {
        return Observable.create(observer => {
            this.http.post(BASE_URL + DataServiceProvider.SAVE_ITEM_URL + userId, expenseDetails)
            .pipe(map((res: any) => res))
            .subscribe( data => {
                observer.next(data);
                observer.complete();
            }, error => {
                observer.next(false);
                observer.complete();
            });
        });
    }

    public updateExpense(itemId, expenseDetails) {
        return Observable.create(observer => {
            this.http.put(BASE_URL + DataServiceProvider.SAVE_ITEM_URL + itemId, expenseDetails)
            .pipe(map((res: any) => res))
            .subscribe( data => {
                observer.next(data);
                observer.complete();
            }, error => {
                observer.next(false);
                observer.complete();
            });
        });
    }

    public deleteExpense(itemId) {
        return Observable.create(observer => {
            this.http.delete(BASE_URL+DataServiceProvider.SAVE_ITEM_URL + itemId)
            .pipe(map((res: any) => res))
            .subscribe( data => {
                observer.next(data);
                observer.complete();
            }, error => {
                observer.next(false);
                observer.complete();
            });
        });
    }

    public dateFilter(startDate, endDate, userId) {
        return Observable.create(observer => {
            this.http.get(BASE_URL+DataServiceProvider.DATE_DATA_URL + startDate + "/" + endDate + "/" + userId)
            .pipe(map((res: any) => res))
            .subscribe( data => {
                observer.next(data);
                observer.complete();
            }, error => {
                observer.next(false);
                observer.complete();
            });
        });
    }
}