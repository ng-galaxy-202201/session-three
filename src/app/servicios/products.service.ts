import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private endpoint = 'products';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Product[]>(this.endpoint)
  }

  create(body: Omit<Product, 'id'>) {
    return this.http.post<Product>(this.endpoint, body)
  }

  update(id: number, body: Omit<Product, 'id'>) {
    return this.http.put<Product>(`${this.endpoint}/${id}`, body)
  }

  delete(id: number) {
    return this.http.delete<any>(`${this.endpoint}/${id}`)
  }
}
