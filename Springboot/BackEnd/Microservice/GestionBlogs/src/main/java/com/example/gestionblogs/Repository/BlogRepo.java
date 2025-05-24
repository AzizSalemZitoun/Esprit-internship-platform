package com.example.gestionblogs.Repository;

import com.example.gestionblogs.Entities.Blog;
import com.example.gestionblogs.Entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepo extends JpaRepository<Blog, Long> {
}
