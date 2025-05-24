package com.esprit.GestionUtilisateur.Controller;


import com.esprit.GestionUtilisateur.Entities.Stage;
import com.esprit.GestionUtilisateur.Entities.User;
import com.esprit.GestionUtilisateur.Repository.UserRepository;
import com.esprit.GestionUtilisateur.Service.StageService;
import com.esprit.GestionUtilisateur.ServiceAPI.JwtService;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stage")
public class StageController {

    private StageService stageService;
    private JwtService jwtService;
    private UserRepository userRepository;
    private static final String FILE_DIRECTORY = "C:\\Users\\Aziz Chahlaoui\\Desktop\\Projet Integration\\Springboot\\BackEnd\\uploads\\";


    @Autowired
    public StageController(StageService stageService, JwtService jwtService, UserRepository userRepository) {
        this.stageService = stageService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/uploadFile")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description,
            @RequestParam("ownedBy") String ownedBy,
            @RequestHeader("Authorization") String token) {
        try {
            // Extraire l'email de l'utilisateur depuis le JWT
            String userEmail = jwtService.extractUsername(token.replace("Bearer ", ""));

            // Récupérer l'utilisateur depuis la base de données
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Sauvegarder le fichier
            Stage savedFile = stageService.uploadFile(file, description, ownedBy, user);

            return ResponseEntity.ok(savedFile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur d'upload: " + e.getMessage());
        }
    }



    @PreAuthorize("hasAuthority('ETUDIANT')")
    @GetMapping("/lettre/{id}")
    public ResponseEntity<byte[]> getLettreAffectation(@PathVariable Long id) {
        try {
            System.out.println("Fetching lettre for stageId: " + id);
            // Générer la lettre en tant que flux binaire
            ByteArrayOutputStream byteArrayOutputStream = stageService.genererLettreAffectationPdf(id);

            if (byteArrayOutputStream == null || byteArrayOutputStream.size() == 0) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body("Aucune lettre trouvée pour ce stage.".getBytes());
            }

            // Définir les en-têtes pour un fichier PDF
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=lettre_affectation.pdf");
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);

            // Retourner le PDF en tant que tableau d'octets
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(byteArrayOutputStream.toByteArray());
        } catch (Exception e) {
            e.printStackTrace(); // Log l'erreur pour plus de détails
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Erreur lors de la génération de la lettre d'affectation : " + e.getMessage()).getBytes());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")// ou un autre rôle selon votre besoin
    @GetMapping("/getStages")
    public ResponseEntity<List<Stage>> getStages() {
        List<Stage> stages = stageService.getAllStages();  // Appeler un service pour récupérer les stages
        if (stages.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(stages);
        }
        return ResponseEntity.ok(stages);
    }
    @PreAuthorize("hasRole('ETUDIANT')")// ou un autre rôle selon votre besoin
    @GetMapping("/user")
    public ResponseEntity<?> getStageByUser(@RequestHeader("Authorization") String token) {
        try {
            // Extraire l'email de l'utilisateur depuis le JWT
            String userEmail = jwtService.extractUsername(token.replace("Bearer ", ""));

            // Récupérer le stage de l'utilisateur
            Stage userStage = stageService.getStageByUser(userEmail);

            return ResponseEntity.ok(userStage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun stage trouvé pour cet utilisateur : " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ETUDIANT')") // ou un autre rôle selon le besoin
    @GetMapping("/downloadJournal")
    public ResponseEntity<byte[]> downloadJournalTemplate() {
        try {
            // Chemin du fichier
            Path filePath = Paths.get("C:/Users/azizc/OneDrive/Desktop/Projet-Integration/Springboot/BackEnd/Journale de stage/Journal de Stage stages obligatoires 24_25.pdf");

            // Lire le fichier en tant que tableau de bytes
            byte[] fileBytes = Files.readAllBytes(filePath);

            // Définir les en-têtes pour la réponse HTTP
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Journal_de_Stage.pdf");
            headers.setContentType(MediaType.APPLICATION_PDF);

            // Retourner le fichier en réponse
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Erreur lors du téléchargement : " + e.getMessage()).getBytes());
        }
    }

    @PreAuthorize("hasAuthority('ETUDIANT')")
    @GetMapping("/demande-stage/{id}")
    public ResponseEntity<byte[]> genererDemandeStage(@PathVariable Long id) {
        try {
            // Générer le PDF
            ByteArrayOutputStream byteArrayOutputStream = stageService.genererDemandeStagePdf(id);

            if (byteArrayOutputStream == null || byteArrayOutputStream.size() == 0) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body("Aucune demande de stage trouvée.".getBytes());
            }

            // Définir les en-têtes pour le téléchargement
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=demande_stage.pdf");
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(byteArrayOutputStream.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Erreur lors de la génération du PDF : " + e.getMessage()).getBytes());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')") // ou un autre rôle
    @GetMapping("/file/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable Long id) {
        try {
            Stage stage = stageService.getStageById(id);
            Path filePath = Paths.get(stage.getUploadDir()); // Récupère le chemin depuis la BDD
            byte[] fileBytes = Files.readAllBytes(filePath);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + stage.getName());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Erreur lors de la récupération du fichier : " + e.getMessage()).getBytes());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        byte[] fileData = stageService.getFileByStageId(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"stage_file.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(fileData);
    }








}