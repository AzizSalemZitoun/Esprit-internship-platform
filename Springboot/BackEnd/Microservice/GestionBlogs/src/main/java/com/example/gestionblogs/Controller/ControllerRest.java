package com.example.gestionblogs.Controller;

import com.example.gestionblogs.Entities.Blog;
import com.example.gestionblogs.Entities.Comment;
import com.example.gestionblogs.Entities.CommentDTO;
import com.example.gestionblogs.Repository.BlogRepo;
import com.example.gestionblogs.Repository.CommentRepo;
import com.example.gestionblogs.Service.ApiUnsplash;
import com.example.gestionblogs.Service.IService;


import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
// ✅ Correct import for file resource
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@CrossOrigin(origins = {"*"})

@RestController
@RequestMapping("/CRUD")
public class ControllerRest {
    @Autowired
    private IService service;
@Autowired
private BlogRepo blogRepo;
    @Autowired
    private CommentRepo commentRepo;

    private final ApiUnsplash unsplashService;

    public ControllerRest(ApiUnsplash unsplashService) {
        this.unsplashService = unsplashService;
    }

    @GetMapping("/API/{query}")
    public String getImage(@PathVariable String query) {
        return unsplashService.getRandomImageUrl(query);
    }
    // Blog Endpoints
    @GetMapping("/Getblogs")
    public List<Blog> getAllBlogs() {
        return service.getAllBlogs();
    }

    @GetMapping("/blogs/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        return service.getBlogById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/Addbl")
    public Blog createBlog(@RequestBody Blog blog) {
        return service.createBlog(blog);
    }
    @PostMapping("/Addblwithimage")
    public ResponseEntity<Blog> createBlogWithImage(
            @RequestPart("blog") Blog blog,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                String imagePath = service.storeImage(imageFile);
                blog.setImage(imagePath);
            }

            Blog savedBlog = service.createBlog(blog);
            return ResponseEntity.ok(savedBlog);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    // Serve uploaded image
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImageupload(@PathVariable String filename) throws IOException {
        Path file = Paths.get("uploads").resolve(filename);
        UrlResource resource = new UrlResource(file.toUri());

        if (resource.exists() && resource.isReadable()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } else {
            throw new RuntimeException("Could not read the file: " + filename);
        }
    }

    @PutMapping("/updatebl/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @RequestBody Blog blogDetails) {
        try {
            return ResponseEntity.ok(service.updateBlog(id, blogDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deletebl/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        service.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    // Comment Endpoints
    @GetMapping("/Getcomments")
    public List<Comment> getAllComments() {
        return service.getAllComments();
    }

    @GetMapping("/comments/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        return service.getCommentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/reply")
    public ResponseEntity<?> addComment(@RequestBody CommentDTO dto) {
        try {
            Comment created = service.createComment(dto);
            return ResponseEntity.ok(created); // Ou CommentResponseDTO
        } catch (Exception e) {
            e.printStackTrace(); // Log dans la console
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    // Endpoint to update the blog reaction and like status
    @PutMapping("/{id}/reaction")
    public ResponseEntity<Blog> updateReaction(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String reactionType = (String) request.get("reactionType");
        boolean liked = (boolean) request.get("liked");

        Blog updatedBlog = service.updateBlogReaction(id, reactionType, liked);
        return ResponseEntity.ok(updatedBlog);
    }

    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long blogId) {
        return ResponseEntity.ok(service.getCommentsForBlog(blogId));
    }


//    @PostMapping("/comments")
//    public ResponseEntity<Comment> createComment(@RequestBody Comment comment,
//                                                 @RequestParam Long blogId) {
//        Comment savedComment = service.createComment(comment, blogId);
//        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
//    }
    // @PostMapping("/Addcm")
    //public Comment createComment(@RequestBody Comment comment) {
    // return service.createComment(comment);
    //}



    @DeleteMapping("/deletecm/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        service.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    //OTHER FUNCTIONALITIES
    @PutMapping("/likeComment/{idcom}")
    public ResponseEntity<Comment> likeComment(@PathVariable Long idcom, @RequestBody Map<String, Boolean> request) {
        boolean liked = request.get("liked");
        return service.likeComment(idcom, liked);
    }


    @PutMapping("/likeBlog/{idblog}")
    public ResponseEntity<Blog> likeBlog(@PathVariable Long idblog, @RequestBody Map<String, Boolean> request) {
        boolean liked = request.get("liked");
        return blogRepo.findById(idblog).map(blog -> {
            if (liked) {
                blog.setLikes(blog.getLikes() + 1);
            } else {
                blog.setLikes(blog.getLikes() - 1);
            }
            blog.setLikedByUser (liked); // Assuming you have a field to track if the user liked the blog
            blogRepo.save(blog);
            return ResponseEntity.ok(blog);
        }).orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
    }





    // Update a comment by ID
    @PutMapping("/uppcm/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Comment updatedComment) {
        return commentRepo.findById(id).map(comment -> {
            comment.setContent(updatedComment.getContent());
            comment.setLikes(updatedComment.getLikes());
            // Update other fields as necessary
            return ResponseEntity.ok(commentRepo.save(comment));
        }).orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }



}
