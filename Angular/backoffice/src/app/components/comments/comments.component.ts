import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { BlogComment } from '../../services/comment.service';
import { Blog } from '../../services/comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: BlogComment[] = []; // Use the renamed interface
  blogTitles: { [key: number]: string } = {};
  searchTerm: string = ''; // Search term
  filteredComments: BlogComment[] = []; 
  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.fetchComments();
  }

  fetchComments(): void {
    this.commentService.getAllComments().subscribe(
      (data: BlogComment[]) => { // Specify the type of data
        this.comments = data; // Assign the fetched comments to the array
        console.log('Fetched comments:', this.comments); // Debug log
        this.fetchBlogTitles(); // Fetch blog titles after comments are loaded
    },
      (error: any) => { // Specify the type of error
        console.error('Error fetching comments:', error);
      }
    );
  }
  fetchBlogTitles(): void {
    const uniqueBlogIds = [...new Set(this.comments.map(comment => comment.blogId))].filter(id => id !== undefined);
    console.log('Unique Blog IDs:', uniqueBlogIds); // Vérification des IDs extraits
  
    uniqueBlogIds.forEach(id => {
      if (id) {
        this.commentService.getBlogById(id).subscribe(
          (blog: Blog) => {
            this.blogTitles[id] = blog.title; // Vérifie que `blog.title` existe bien
          },
          (error: any) => {
            console.error(`Error fetching blog title for ID: ${id}`, error);
          }
        );
      } else {
        console.error('Error: Undefined blog ID found in comments');
      }
    });
  }
  
  

  deleteComment(id: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(id).subscribe(
        () => {
          this.comments = this.comments.filter(comment => comment.idcom !== id); // Remove the deleted comment from the array
        },
        (error) => {
          console.error('Error deleting comment:', error);
        }
      );
    }
  }





//SEARCH
filterComments(): void {
  if (this.searchTerm) {
    this.filteredComments = this.comments.filter(comment => 
      comment.content.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  } else {
    this.filteredComments = this.comments; // Reset to original list if search term is empty
  }
}
}