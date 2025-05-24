import { Component } from '@angular/core';
import { BlogService, Blogg } from '../services/blog.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  blogg: Blogg = {
    title: '',
    category: '',
    content: '',
    image: '',
  };

  imageUrl: string = '';
  imageFile?: File;                // For file upload
  useFileUpload: boolean = false;  // Toggle logic
  private UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';
  private API_KEY = 'aew_Z__4hLOzViF-N66j_ULtNbVoOqeiUdh2HeRkNIU'; 
  constructor(private http: HttpClient, private blogService: BlogService) {}

 
  onSubmit(): void {
    if (this.blogg.title && this.blogg.content) {
      if (this.useFileUpload && this.imageFile) {
        // File upload selected
        this.blogService.addBlogim(this.blogg, this.imageFile).subscribe(
          (response) => {
            console.log('Blog with uploaded image added!', response);
            alert('Blog with uploaded image added!');
            this.resetForm();
          },
          (error) => {
            console.error('Error adding blog with file:', error);
          }
        );
      } else {
        // Using Unsplash or no image
        this.blogg.image = this.imageUrl;
        this.blogService.addBlog(this.blogg).subscribe(
          (response) => {
            console.log('Blog added successfully!', response);
            alert('Blog added successfully!');
            this.resetForm();
          },
          (error) => {
            console.error('Error adding blog:', error);
          }
        );
      }
    }
  }

  fetchImage(query: string): void {
    this.blogService.fetchImage(query).subscribe(
      (response) => {
        this.imageUrl = response.urls.regular;
        this.useFileUpload = false; // Ensure we're not using file upload in this case
      },
      (error) => {
        console.error('Error fetching image:', error);
      }
    );
  }
  imagePreview: string = ''; 
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.useFileUpload = true;  // Toggle mode to use file upload
      // Show image preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  }

  resetForm(): void {
    this.blogg = { title: '', category: '', content: '', image: '' };
    this.imageFile = undefined;
    this.imageUrl = '';
    this.useFileUpload = false;
  }
}

