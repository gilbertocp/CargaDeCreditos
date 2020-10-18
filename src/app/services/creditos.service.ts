import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Credito } from '../models/credito';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  private creditosCollecion: AngularFirestoreCollection;
  private creditos: Observable<Credito[]>;
  private creditosDoc: AngularFirestoreDocument;

  constructor(private db: AngularFirestore) { 
    this.creditosCollecion = this.db.collection('creditos');
    this.creditos = this.creditosCollecion.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.docId = a.payload.doc.id;
          return data as Credito;
        });
      })
    );
  }

  get getCreditos() {
    return this.creditos;
  }

  addCredito(credito) {
    this.creditosCollecion.add(credito);
  }

  deleteCredito(credito) {
    this.creditosDoc = this.db.doc(`creditos/${credito.docId}`);
    this.creditosDoc.delete();
  }

  creditoActual() {
    
  }
}
