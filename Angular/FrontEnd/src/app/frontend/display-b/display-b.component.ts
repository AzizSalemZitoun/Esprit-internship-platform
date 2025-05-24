import { Component, OnInit } from '@angular/core';
declare var bootstrap: any;
import { BlogService } from '../services/blog.service';
import { BlogComment } from '../services/blog.service';
import { BlogCommentsen } from '../services/blog.service';
import { Blog } from '../services/blog.service';
import { SentimentService } from '../../services/sentiment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-b',
  templateUrl: './display-b.component.html',
  styleUrls: ['./display-b.component.css']
})
export class DisplayBComponent implements OnInit {
  blogs: any[] = [];
  selectedComment: Comment | null = null; 
  filteredBlogs: Blog[] = []; 
  selectedFilter: string = 'recent'; 
// To hold the comment being edited // Use the ! operator// Initialize with null// Declare selectedComment property
  constructor(private blogService: BlogService, private router: Router, private sentimentService: SentimentService) {}

  ngOnInit(): void {
    this.fetchBlogs();
  }

  fetchBlogs(): void {
    this.blogService.getAllBlogs().subscribe(
      (data) => {
        this.blogs = data.map(blog => ({ ...blog, showCommentBox: false, newComment: '' })); // Initialize showCommentBox and newComment
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
  }

  toggleComment(blog: any) {
 
    this.blogs.forEach(b => {
      if (b !== blog) b.showCommentBox = false;
    });

    
    blog.showCommentBox = !blog.showCommentBox;
  }
  addComment(blog: any): void {
    if (blog.newComment && blog.newComment.trim()) {
      const newComment: BlogCommentsen = {
        content: blog.newComment,
        createdAt: new Date(),
        likes: 0,
        likedByUser: false,
        blogId: blog.idblog
      };
  
      // First, try analyzing sentiment
      this.sentimentService.analyzeSentiment(newComment.content).subscribe(
        (sentimentResult) => {
          newComment.sentiment = sentimentResult.sentiment;
  
          // Add comment to backend
          this.blogService.addComment(blog.idblog, newComment.content).subscribe((comment) => {
            newComment.idcom = comment.idcom;
            newComment.sentiment = comment.sentiment || newComment.sentiment;
            blog.comments = blog.comments || [];
            blog.comments.push(newComment);
            blog.newComment = '';
            blog.showCommentBox = true;
          });
        },
        (error) => {
          console.error('Error analyzing sentiment:', error);
  
          // Fallback: Still post comment without sentiment
          this.blogService.addComment(blog.idblog, newComment.content).subscribe((comment) => {
            newComment.idcom = comment.idcom;
            newComment.sentiment = 'neutral'; // fallback
            blog.comments = blog.comments || [];
            blog.comments.push(newComment);
            blog.newComment = '';
            blog.showCommentBox = true;
          });
        }
      );
    }
  }
  
  
 //addComment(blog: any): void {
    
 //  if (blog.newComment && blog.newComment.trim()) {
  //   const newComment = { content: blog.newComment, createdAt: new Date() };
    //  this.blogService.addComment(blog.idblog, blog.newComment).subscribe(comment => {
        
      //  blog.comments.push(comment);
      //  blog.newComment = ''; // Clear input
//});

  //  }
    
//  }
  toggleReply(comment: any) {
    comment.showReplyBox = !comment.showReplyBox;
  }
  
  submitReply(blog: any, comment: any) {
    if (comment.newReply && comment.newReply.trim()) {
      this.blogService.addComment(blog.idblog, comment.newReply, comment.idcom).subscribe(
        (reply) => {
          comment.replies = comment.replies || [];
          comment.replies.push(reply);
          comment.newReply = '';
          comment.showReplyBox = false;
        }
      );
    }
  }

  likeComment(blog: any, comment: any) {
    if (!comment.idcom) {
        console.error("❌ Comment ID is missing! Cannot like this comment.");
        return;
    }

   
    comment.likedByUser = !comment.likedByUser;

    if (comment.likedByUser) {
        comment.likes++; 
    } else {
        comment.likes--; 
    }

    // Send the like status to the backend
    this.blogService.likeComment(comment.idcom, comment.likedByUser).subscribe(
        response => {
            console.log("✅ Like updated successfully:", response);
        },
        error => {
            console.error("❌ Error updating like status:", error);
            // Revert the like status if there was an error
            comment.likedByUser = !comment.likedByUser; // Toggle back
            comment.likes += comment.likedByUser ? -1 : 1; // Adjust likes count back
        }
    );
}


////blogggglikkkk

likeBlog(blog: any) {
  // Toggle the like status
  blog.likedByUser  = !blog.likedByUser ;

  // Update the likes count based on the new like status
  if (blog.likedByUser ) {
      blog.likes++; 
  } else {
      blog.likes--;
  }

  
  this.blogService.likeBlog(blog.idblog, blog.likedByUser ).subscribe(
      response => {
          console.log("✅ Blog like status updated successfully:", response);
      },
      error => {
          console.error("❌ Error updating blog like status:", error);
          
          blog.likedByUser  = !blog.likedByUser ; // Toggle back
          blog.likes += blog.likedByUser  ? -1 : 1; // Adjust likes count back
      }
  );
}

goToBlogDetails(blogId: number): void {
  this.router.navigate([`/blogdispC`, blogId]);}

//share functions


shareToFacebook(blog: Blog): void {
  const url = encodeURIComponent(`http://localhost:4200/blogdispC/${blog.idblog}`);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(facebookUrl, '_blank');
}

shareToWhatsApp(blog: Blog): void {
  const url = encodeURIComponent(`http://localhost:4200/blogdispC/${blog.idblog}`);
  const message = `Check out this blog: ${url}`;
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank');
}











///TETTSTTTTTT


  // Implement the deleteComment method
  deleteComment(blog: Blog, commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.blogService.deleteComment(commentId).subscribe(
        () => {
          // Remove the deleted comment from the blog's comments array
          blog.comments = blog.comments.filter(comment => comment.idcom !== commentId);
          console.log('Comment deleted successfully');
        },
        (error) => {
          console.error('Error deleting comment:', error);
        }
      );
    }
  }

  // Implement the editComment method
  editComment(blog: Blog, comment: BlogComment): void {
    const updatedContent = prompt('Edit your comment:', comment.content);
    if (updatedContent !== null) {
      comment.content = updatedContent; // Update the comment content
      this.blogService.updateComment(comment.idcom, comment).subscribe(
        () => {
          console.log('Comment updated successfully');
        },
        (error) => {
          console.error('Error updating comment:', error);
        }
      );
    }
  }


  filterBlogs(): void {
    if (this.selectedFilter === 'recent') {
      this.filteredBlogs = this.blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.selectedFilter === 'mostComments') {
      this.filteredBlogs = this.blogs.sort((a, b) => b.comments.length - a.comments.length);
    }
  }
  showReactions = false;
  selectReaction(blog: Blog, reaction: 'happy' | 'sad' | 'angry' | 'love') {
    this.reactToBlog(blog, reaction, true);
    this.showReactions = false; // hide the popup after selection
  }
  // Method to handle reaction
  reactToBlog(blog: Blog, reaction: 'happy' | 'sad' | 'angry' | 'love', liked: boolean): void {
    if (blog && blog.idblog) {
      console.log('Blog ID:', blog.idblog);  // Check if blog ID is correctly passed
      blog.reactionType = reaction;
      blog.likedByUser = liked;
      this.blogService.updateBlogReaction(blog.idblog, reaction, liked).subscribe(updatedBlog => {
        blog.reactionType = updatedBlog.reactionType;
        blog.likes = updatedBlog.likes;
        blog.likedByUser = updatedBlog.likedByUser;
      });
    } else {
      console.error('Blog ID is undefined');
    }
  }}

  //likeComment(blog: any, comment: any) {
    // Check if the user has already liked this comment
  //  if (!comment.likedByUser) {
     // comment.likes++;  // Increase likes
     // comment.likedByUser = true;
   // } else {
     // comment.likes--;  // Decrease likes
     // comment.likedByUser = false;
  //  }





  //addComment(blog: any) {
   // if (blog.newComment.trim()) {
    //  console.log("New comment:", blog.newComment);
      // Here you can send the comment to the backend via a service
   //   blog.newComment = ""; // Clear input field after submitting
     // blog.showCommentBox = false; // Hide comment box after submission
    //}
  
  




