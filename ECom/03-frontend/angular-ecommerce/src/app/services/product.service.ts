import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
   private baseUrl=environment.LilyUrl+"/products";
   private categoryUrl=environment.LilyUrl+"/product-category";
  
   
  constructor(private httpClient:HttpClient) { }

  getProductListPaginate(thePage:number,thePageSize:number,categoryId:number)
  :Observable<GetResponseProducts>{
    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
    +`&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
   
  }

  getProductList(categoryId:number):Observable<Product[]>{
    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
   
  }

  getProductCategories():Observable<ProductCategory[]> {
    
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response =>response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string):Observable<Product[]>{
    const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
    
  }

  searchProductsPaginate(thePage:number,thePageSize:number,theKeyword:string)
  :Observable<GetResponseProducts>{
    const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
    +`&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
   
  }

  getProducts(searchUrl:string):Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response =>response._embedded.products)
    );
  }

  getProduct(theProductId: number):Observable<Product>{
      const productUrl=`${this.baseUrl}/${theProductId}`;
      return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts{
  _embedded: {
    products:Product[];
  },
  page:{
     size:number;
     totalElements:number;
     totalPages:number;
     number:number;
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory:ProductCategory[];
  }
}