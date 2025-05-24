import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
//import { Comment } from '../models/Commentb.model'; 
export interface Blog {
  idblog?: number;
  title: string;
  category: string;
  content: string;   
  createdAt: Date;        
  updatedAt?: Date;       
  likes: number;          
  likedByUser:  boolean;    
  image?: string;
  comments: Comment[];     
  commentCount?: number;   
  reactionType?: 'happy' | 'sad' | 'angry' | 'love';
}
//for the replies
export interface CommentDTO {
  content: string;
  blogId: number;
  parentId?: number;
}
export interface Blogg {
  id?: number;
  title: string;
  category: string;
  content: string;
  image?: string;
}
 

export interface BlogComment {
  idcom: number;    

  content: string;   
  createdAt: Date;   
  likes: number;      
  likedByUser:  boolean; 
  blogId: number;   
     
}

export interface BlogCommentsen {
  idcom?: number;    
  sentiment?:string,
  content: string;   
  createdAt: Date;   
  likes: number;      
  likedByUser:  boolean; 
  blogId: number;   
     
}
     // The ID of the blog post this comment belongs to
     export interface Comment {
      idcom: number;
      content: string;
      createdAt: Date;
      likes: number;
      likedByUser: boolean;
      blog: any;
      sentiment?: 'positive' | 'negative' | 'neutral';
  }
@Injectable({
  providedIn: 'root'
})

export class BlogService {

  private UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';
  private API_KEY = 'aew_Z__4hLOzViF-N66j_ULtNbVoOqeiUdh2HeRkNIU';

  private apiUrl = 'http://localhost:9997/CRUD/Addbl'; 
  private apiUrl2 = 'http://localhost:9997/CRUD'; 
  constructor(private http: HttpClient) {}
  updateBlogReaction(id: number, reactionType: string, liked: boolean): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl2}/${id}/reaction`, { reactionType, liked });
  }
  addBlogim(blog: Blogg, imageFile?: File): Observable<Blogg> {
    const formData = new FormData();
    formData.append('blog', new Blob([JSON.stringify(blog)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<Blogg>(`${this.apiUrl2}/Addblwithimage`, formData);
  }

  addBlog(blog: Blogg): Observable<Blog> {
    // Creatinggg a new Blog object
    const newBlog: Blog = {
      title: blog.title,
      category: blog.category,
      content: blog.content,
      image: blog.image,  
      createdAt: new Date(), 
      likes: 0,              
      likedByUser:  false,    
      comments: [],          
      commentCount: 0       
    };

    // Send the new Blog object to the backend
    return this.http.post<Blog>(this.apiUrl, newBlog);
  }
  addComment(blogId: number, content: string, parentId?: number) {
    return this.http.post<any>(`${this.apiUrl2}/reply`, {
      content,
      blogId,
      parentId: parentId || null
    });
  }


///IMG APIIIIII
  fetchImage(query: string): Observable<any> {
    return this.http.get<any>(`${this.UNSPLASH_API_URL}?query=${query}&client_id=${this.API_KEY}`);
  }

  getAllBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl2}/Getblogs`);
  }
  updateBlog(id: number, blog: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl2}/updatebl/${id}`, blog);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl2}/deletebl/${id}`);
  }

  
  //addComment(blogId: number, comment: any): Observable<any> {
  //  const params = new HttpParams().set('blogId', blogId.toString());
  //  return this.http.post<any>(`${this.apiUrl2}/comments`, comment, { params });
  //}
  

    // Method to update comment likes
    likeComment(idcom: number, liked: boolean): Observable<any> {
      return this.http.put(`${this.apiUrl2}/likeComment/${idcom}`, { liked });
    }


    likeBlog(id: number, liked: boolean): Observable<any> {
      return this.http.put(`${this.apiUrl2}/likeBlog/${id}`, { liked });
  }

  //UPD AND DELTT COMMM
  // Delete a comment by ID
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl2}/deletecm/${id}`);
  }

  // Update a comment by ID
  updateComment(id: number, comment: BlogComment): Observable<BlogComment> {
    return this.http.put<BlogComment>(`${this.apiUrl2}/uppcm/${id}`, comment);
  }


  /*private apiUrl = 'http://localhost:9999/CRUD'; // Base URL for Spring Boot API

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/Getblogs`);
  }

  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blogs/${id}`);
  }

  addBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/Addbl`, blog);
  }

  updateBlog(id: number, blog: Blog): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/updatebl/${id}`, blog);
  }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletebl/${id}`);
  }*/
}
