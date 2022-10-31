import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { filter, Observable, Subscriber, take } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    /**
     * servicio de periodicos
     * recibimos una notificacion cada dia
     * recibimos una notificacion cada lunes
     * desuscribirnos despues del primer mes
     */

    interface NewspaperInfo {
      date: moment.Moment;
    }

    const newspaperObservable = new Observable(
      (subscriber: Subscriber<NewspaperInfo>) => {
        const date = moment();
        subscriber.next({ date });

        const intervalId = setInterval(() => {
          date.add(1, 'day');
          // console.log('SET INTERVAL', date.format('DD/MM/YYYY'))

          subscriber.next({ date });

          if (date.weekday() === 5) {
            subscriber.complete()
          }
        }, 100);



        return {
          unsubscribe: () => {
            clearInterval(intervalId);
          }
        }
      }
    );


    // desuscribirnos automaticamente luego de de una cantidad de dias
    const newspaperSubscription = newspaperObservable
      .pipe(
        filter(newspaper => newspaper.date.weekday() === 1),
        take(4)
      )
      .subscribe({
        next: (newspaper) => console.log(newspaper.date.format('dddd DD MMMM')),
        error: (error) => console.error(error),
        complete: () => console.log('Susbcripcion completada')
      });

    // desuscribirnos manualmente luego de una cantidad de dias
/*     setTimeout(() => {
      newspaperSubscription.unsubscribe();
    }, 3000) */

    const httpGet = new Observable((subscriber) => {
      fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(resJson => subscriber.next(resJson))
        .finally(() => subscriber.complete())
    })

    httpGet.subscribe({
      next: console.log,
      complete: () => console.log('susbcripcion finalizada')
    })
    // httpGet.subscribe((res) => console.log(res))



  }
}
