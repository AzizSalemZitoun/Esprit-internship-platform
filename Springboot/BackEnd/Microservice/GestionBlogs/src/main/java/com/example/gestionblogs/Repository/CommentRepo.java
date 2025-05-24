package com.example.gestionblogs.Repository;

import com.example.gestionblogs.Entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.likes = :likes WHERE c.idcom = :id")
    void updateLikes(@Param("idcom") Long idcom, @Param("likes") int likes);

    List<Comment> findByBlog_IdblogAndParentIsNull(Long blogId);

}
