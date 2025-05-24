package com.esprit.GestionUtilisateur.Service;


import com.esprit.GestionUtilisateur.Entities.Stage;
import com.esprit.GestionUtilisateur.Entities.User;
import com.esprit.GestionUtilisateur.Repository.StageRepository;
import com.esprit.GestionUtilisateur.Repository.UserRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfDocument;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;

@Service
public class StageService {

    private StageRepository stageRepository;
    private UserRepository userRepository;

    private Stage stage;

    private Path uploadLocation;

    @Autowired
    public StageService(StageRepository stageRepository, UserRepository userRepository) {
        this.stageRepository = stageRepository;
        this.userRepository = userRepository;
        this.uploadLocation = Paths.get("uploads/").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create directory");
        }
    }


    public Stage uploadFile(MultipartFile file, String description, String ownedBy, User user) throws IOException {
        // Nettoyer et stocker le fichier sur le disque
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        Path targetLocation = uploadLocation.resolve(originalFileName);
        Files.write(targetLocation, file.getBytes());

        // Créer l'entité Stage et l'associer à l'utilisateur
        Stage stage = new Stage();
        stage.setName(originalFileName);
        stage.setType(file.getContentType());
        stage.setOwnedBy(ownedBy);
        stage.setDescription(description);
        stage.setFile(file.getBytes()); // Stockage en base
        stage.setUploadDir(targetLocation.toString());
        stage.setUser(user); // Associer l'utilisateur

        return stageRepository.save(stage);
    }

    public ByteArrayOutputStream genererLettreAffectationPdf(Long id) throws Exception {
        Stage stage = stageRepository.findById(id).orElseThrow(() -> new RuntimeException("Stage introuvable"));
        User user = stage.getUser();

        // Créer un flux de sortie pour stocker le PDF
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        // Initialisation de PdfWriter avec le flux de sortie
        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);

        // Ouvrir le document pour ajouter du contenu
        document.open();

        // Ajout du contenu au document
        document.add(new Paragraph("Lettre d'affectation\n\n"));
        document.add(new Paragraph("Nom: " + user.getNom()));
        document.add(new Paragraph("Prénom: " + user.getPrenom()));
        document.add(new Paragraph("Stage: " + stage.getName()));
        document.add(new Paragraph("Description: " + stage.getDescription()));

        // Fermeture du document
        document.close();

        // Retourne le flux de sortie contenant le PDF
        return byteArrayOutputStream;
    }
    public List<Stage> getAllStages() {
        return stageRepository.findAll();  // Assurez-vous que le stageRepository est bien injecté et configuré
    }
    public Stage getStageByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return stageRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Aucun stage trouvé pour cet utilisateur"));
    }

    public ByteArrayOutputStream genererDemandeStagePdf(Long id) throws Exception {
        Stage stage = stageRepository.findById(id).orElseThrow(() -> new RuntimeException("Stage introuvable"));
        User user = stage.getUser();

        // Création du document PDF en mémoire
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, byteArrayOutputStream);
        document.open();

        // Police personnalisée
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);

        // Ajout du titre centré
        Paragraph title = new Paragraph("A l'aimable attention de la Direction Générale", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph("\nObjet: Demande de Stage", titleFont));
        document.add(new Paragraph("\nMadame, Monsieur,", normalFont));

        document.add(new Paragraph(
                "L'Ecole Supérieure Privée d'Ingénierie et de Technologies, ESPRIT SA, est un établissement " +
                        "d'enseignement supérieur privé ayant pour objet principal, la formation d'ingénieurs dans " +
                        "les domaines des technologies de l'information et de la communication.", normalFont));

        document.add(new Paragraph(
                "Notre objectif consiste à former des ingénieurs opérationnels au terme de leur formation.\n" +
                        "Dès lors, nous encourageons nos élèves à mettre en pratique le savoir et les compétences " +
                        "qu'ils ont acquis au cours de leur cursus universitaire.", normalFont));

        document.add(new Paragraph(
                "C'est également dans le but de les amener à s'intégrer dans l'environnement de l'entreprise " +
                        "que nous vous demandons de bien vouloir accepter :", normalFont));

        document.add(new Paragraph("\nL'étudiant(e) : " + user.getNom().toUpperCase() + " " + user.getPrenom().toUpperCase(), normalFont));
        document.add(new Paragraph("Inscrit(e) en : " + stage.getDescription(), normalFont));

        document.add(new Paragraph(
                "\nPour effectuer un stage obligatoire, au sein de votre honorable société.", normalFont));

        document.add(new Paragraph(
                "Nous restons à votre entière disposition pour tout renseignement complémentaire.\n" +
                        "En vous remerciant pour votre précieux soutien, nous vous prions d'agréer, " +
                        "Madame, Monsieur, l'expression de nos salutations distinguées.", normalFont));

        document.close();
        return byteArrayOutputStream;
    }

    public Stage getStageById(Long id) {
        return stageRepository.findById(id).orElse(null);
    }

    public byte[] getFileByStageId(Long id) {
        Stage stage = stageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));
        return stage.getFile();
    }



}