package com.example.gestion_candidature;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final CandidatureService candidatureService;

    public DocumentService(DocumentRepository documentRepository, CandidatureService candidatureService) {
        this.documentRepository = documentRepository;
        this.candidatureService = candidatureService;
    }

    public Document uploadDocument(int candidatureId, MultipartFile file) throws IOException {
        Candidature candidature = candidatureService.getCandidatureById(candidatureId);

        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setData(file.getBytes());
        document.setCandidature(candidature);

        return documentRepository.save(document);
    }

    public Document getDocument(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public List<Document> getDocumentsByCandidature(int candidatureId) {
        return documentRepository.findByCandidatureId(candidatureId);
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
}