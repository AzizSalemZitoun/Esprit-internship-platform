package com.example.gestionblogs.Service;

import com.example.gestionblogs.Entities.Blog;
import com.example.gestionblogs.Entities.Comment;
import com.example.gestionblogs.Entities.CommentDTO;
import com.example.gestionblogs.Repository.BlogRepo;
import com.example.gestionblogs.Repository.CommentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ServiceImpl implements IService {
@Autowired
    BlogRepo blogRepo;
    @Autowired
    CommentRepo commentRepo;

    // CRUD operations for Blog
    public List<Blog> getAllBlogs() {
        return blogRepo.findAll();
    }

    public Optional<Blog> getBlogById(Long id) {
        return blogRepo.findById(id);
    }

    public Blog createBlog(Blog blog) {
        return blogRepo.save(blog);
    }

    public Blog updateBlog(Long id, Blog blogDetails) {
        return blogRepo.findById(id).map(blog -> {
            blog.setTitle(blogDetails.getTitle());
            blog.setContent(blogDetails.getContent());

            blog.setUpdatedAt(new Date());
            return blogRepo.save(blog);
        }).orElseThrow(() -> new RuntimeException("Blog not found"));
    }

    public void deleteBlog(Long id) {
        blogRepo.deleteById(id);
    }
    //getting images from desktp and storing them
    public String storeImage(MultipartFile imageFile) throws IOException {
        String folder = "uploads/";
        String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
        Path path = Paths.get(folder + fileName);

        Files.createDirectories(path.getParent());
        Files.copy(imageFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        // 👇 Generate full URL to return
        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        return baseUrl + "/uploads/" + fileName;
    }


    // CRUD operations for Comment
    public List<Comment> getAllComments() {
        return commentRepo.findAll();
    }

    public Optional<Comment> getCommentById(Long id) {
        return commentRepo.findById(id);
    }
//
    public List<Comment> getCommentsForBlog(Long blogId) {
        return commentRepo.findByBlog_IdblogAndParentIsNull(blogId);
    }

    public Comment createComment(CommentDTO dto) {
        Blog blog = blogRepo.findById(dto.getBlogId())
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setCreatedAt(new Date());
        comment.setLikes(0);
        comment.setBlog(blog);

        // Static user logic (if you had a user field): comment.setAuthor("static_user");

        if (dto.getParentId() != null) {
            Comment parentComment = commentRepo.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parentComment);
        }

        return commentRepo.save(comment);
    }
 //   public Comment createComment(Comment comment) {
      //  return commentRepo.save(comment);
  //  }

    public Comment updateComment(Long id, Comment commentDetails) {
        return commentRepo.findById(id).map(comment -> {
            comment.setContent(commentDetails.getContent());
            comment.setCreatedAt(new Date());
            return commentRepo.save(comment);
        }).orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    public void deleteComment(Long id) {
        commentRepo.deleteById(id);
    }
    // Update blog's like and reaction
    public Blog updateBlogReaction(Long blogId, String reactionType, boolean liked) {
        Blog blog = blogRepo.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));

        // Update likedByUser and reactionType
        blog.setLikedByUser(liked);
        blog.setReactionType(reactionType);

        // If liked, increment likes count
        if (liked) {
            blog.setLikes(blog.getLikes() + 1);
        } else {
            blog.setLikes(blog.getLikes() - 1);
        }

        return blogRepo.save(blog);
    }
    @Override
    public ResponseEntity<Comment> likeComment(Long idcom, boolean liked) {
        Optional<Comment> optionalComment = commentRepo.findById(idcom);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if (liked) {
                comment.setLikes(comment.getLikes() + 1);
            } else {
                comment.setLikes(comment.getLikes() - 1);
            }
            comment.setLikedByUser (liked);
            commentRepo.save(comment);
            return ResponseEntity.ok(comment);
        } else {
            throw new ResourceNotFoundException("Comment not found");
        }
    }
}
