package com.example.gestionblogs.Service;
import com.example.gestionblogs.Entities.Blog;
import com.example.gestionblogs.Entities.Comment;
import com.example.gestionblogs.Entities.CommentDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
public interface IService {
    // Blog operations
    List<Blog> getAllBlogs();
    Optional<Blog> getBlogById(Long id);
    Blog createBlog(Blog blog);
    Blog updateBlog(Long id, Blog blogDetails);
    void deleteBlog(Long id);
    //Comment createComment(Comment comment, Long blogId);
    public String storeImage(MultipartFile imageFile)throws IOException;
    public List<Comment> getCommentsForBlog(Long blogId);
    public Comment createComment(CommentDTO dto);
    public Blog updateBlogReaction(Long blogId, String reactionType, boolean liked);
    // Comment operations
    List<Comment> getAllComments();
    Optional<Comment> getCommentById(Long id);
    //Comment createComment(Comment comment);
    Comment updateComment(Long id, Comment commentDetails);
    void deleteComment(Long id);
    ResponseEntity<Comment> likeComment(Long idcom, boolean liked);
}
