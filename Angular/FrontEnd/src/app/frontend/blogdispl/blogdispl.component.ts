import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service';
declare var bootstrap: any;
@Component({
  selector: 'app-blogdispl',
  templateUrl: './blogdispl.component.html',
  styleUrls: ['./blogdispl.component.css']
})
export class BlogdisplComponent implements OnInit {
  blogs: any[] = []; 
  selectedBlog: any = {}; 
  paginatedBlogs: any[] = []; 
  currentPage: number = 1;
  itemsPerPage: number = 4; 


  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.fetchBlogs(); 
  }

  fetchBlogs(): void {
    this.blogService.getAllBlogs().subscribe(
      (data) => {
        this.blogs = data; 
        this.updatePaginatedBlogs(); 
      },
      (error) => {
        console.error('Error fetching blogs:', error); 
      }
    );
  }

  updatePaginatedBlogs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedBlogs = this.blogs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.blogs.length / this.itemsPerPage); 
}

changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedBlogs(); 
}



  openUpdateModal(blog: any): void {
    this.selectedBlog = { ...blog }; 
    const modal = new bootstrap.Modal(document.getElementById('updateModal'));
    modal.show(); 
  }

  onUpdateSubmit(): void {
    this.blogService.updateBlog(this.selectedBlog.idblog, this.selectedBlog).subscribe(
      (updatedBlog) => {
        // Update the local blogs array with the updated blog
        const index = this.blogs.findIndex(blog => blog.idblog === updatedBlog.idblog);
        if (index !== -1) {
          this.blogs[index] = updatedBlog;
        }
        this.fetchBlogs(); 
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
        modal.hide();
      },
      (error) => {
        console.error('Error updating blog:', error);
      }
    );
  }

  deleteBlog(id: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id).subscribe(
        () => {
         
          this.blogs = this.blogs.filter(blog => blog.idblog !== id);
          this.fetchBlogs(); 

        },
        
        (error) => {
          console.error('Error deleting blog:', error);
        }
      );
    }
  }
}