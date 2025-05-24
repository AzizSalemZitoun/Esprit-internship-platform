import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

  export interface Blog {
    idblog: number;          // Unique identifier for the blog
    title: string;           // Title of the blog
    content: string;         // Content of the blog
    createdAt: Date;         // Date when the blog was created
    updatedAt?: Date;        // Date when the blog was last updated
    likes: number;           // Number of likes
    likedByUser:  boolean;    // Indicates if the current user has liked the blog
    category: string;        // Category of the blog
    comments: Comment[];     // List of comments associated with the blog
    commentCount?: number;   // Number of comments (optional)
  }
@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  private apiUrl = 'http://localhost:9999/CRUD'; // Your Spring Boot API base URL

  constructor(private http: HttpClient) {}

  // Define the Blog interface directly in the service


  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/Getblogs`);
  }
  

  //updateBlog(id: number, blog: Blog): Observable<Blog> {
   // return this.http.put<Blog>(`${this.apiUrl}/updatebl/${id}`, blog);
 /// }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletebl/${id}`);
  }
  }