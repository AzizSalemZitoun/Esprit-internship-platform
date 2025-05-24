import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

export interface Blog {
  idblog: number; // Unique identifier for the blog
  title: string;  // Title of the blog
  // Add other properties as needed
}

export interface BlogComment {
  idcom: number;        // Unique identifier for the comment
  content: string;      // The text content of the comment
  createdAt: Date;      // The date when the comment was created
  likes: number;        // The number of likes the comment has received
  likedByUser: boolean; // Indicates if the current user has liked the comment
  blogId: number;       // The ID of the blog post this comment belongs to
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:9999/CRUD'; // Your Spring Boot API base URL

  constructor(private http: HttpClient) {}

  getAllComments(): Observable<BlogComment[]> {
    return this.http.get<BlogComment[]>(`${this.apiUrl}/Getcomments`); // Adjust the endpoint as necessary
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletecm/${id}`);
  }
  getBlogById(blogId: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blogs/${blogId}`); // Adjust the endpoint as necessary
}
}