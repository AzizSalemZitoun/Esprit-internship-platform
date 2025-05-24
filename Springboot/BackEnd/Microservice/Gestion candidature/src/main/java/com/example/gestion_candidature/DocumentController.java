package com.example.gestion_candidature;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    // --- FIXED UPLOAD METHOD ---
    @PostMapping(
            value = "/upload/{candidatureId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadDocument(
            @PathVariable("candidatureId") int candidatureId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Document document = documentService.uploadDocument(candidatureId, file);
            return ResponseEntity.ok(document);
        } catch (IOException e) {
            // Return a more detailed error response if something goes wrong
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

    // --- DOWNLOAD METHOD ---
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        Document document = documentService.getDocument(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getFileName() + "\"")
                .body(document.getData());
    }

    @GetMapping("/candidature/{candidatureId}")
    public ResponseEntity<List<Document>> getDocumentsByCandidature(@PathVariable int candidatureId) {
        return ResponseEntity.ok(documentService.getDocumentsByCandidature(candidatureId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/all")
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

}
