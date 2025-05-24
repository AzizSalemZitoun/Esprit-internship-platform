import { Component, OnInit } from '@angular/core';
import { BlogsService } from '../../services/blogs.service';
import { Blog } from '../../services/blogs.service';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent  implements OnInit {
  blogs: any[] = []; // Array to hold blog data // Use the Blog interface from the service
  filteredBlogs: Blog[] = []; // Filtered list of blogs
  searchTerm: string = ''; // Search term
  constructor(private blogsService: BlogsService) {}

  ngOnInit(): void {
    this.fetchBlogs();
  }

  fetchBlogs(): void {
    this.blogsService.getAllBlogs().subscribe(
      (data: Blog[]) => {  
        this.blogs = data.map((blog: Blog) => ({
          ...blog,
          commentCount: blog.comments ? blog.comments.length : 0 // Vérification pour éviter une erreur si `comments` est `undefined`
        }));
      },
      (error: any) => {  
        console.error('Error fetching blogs:', error);
      }
    );
  }
  
  deleteBlog(id: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogsService.deleteBlog(id).subscribe(
        () => {
          this.blogs = this.blogs.filter(blog => blog.idblog !== id);
          this.fetchBlogs();  // Remove the deleted blog from the array
        },
        (error) => {
          console.error('Error deleting blog:', error);
        }
      );
    }
  }

  filterBlogs(): void {
    if (this.searchTerm) {
      this.filteredBlogs = this.blogs.filter(blog => 
        blog.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredBlogs = this.blogs; // Reset to original list if search term is empty
    }
  }

  // Add methods for updating blogs and opening modals as needed
}