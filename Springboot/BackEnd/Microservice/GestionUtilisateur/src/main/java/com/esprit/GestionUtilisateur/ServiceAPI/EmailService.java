package com.esprit.GestionUtilisateur.ServiceAPI;


import com.esprit.GestionUtilisateur.Entities.User;
import com.google.zxing.WriterException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final JwtService jwtService;
    private final QrCodeService qrCodeService;


    public EmailService(JavaMailSender mailSender, JwtService jwtService, QrCodeService qrCodeService) {
        this.mailSender = mailSender;
        this.jwtService = jwtService;
        this.qrCodeService = qrCodeService;
    }

    public void sendVerificationEmail(User user) throws MessagingException, WriterException, IOException {
        String token = jwtService.generateToken(user);
        String verificationLink = "http://localhost:8088/api/auth/verify?token=" + token;
        String profileLink = "http://localhost:4200/profile/" + user.getId(); // Lien du profil utilisateur

        // Génération du QR Code avec le lien du profil
        byte[] qrCodeImage = qrCodeService.generateQrCode(profileLink, 200, 200);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("azizchahlaoui7@gmail.com");
        helper.setTo(user.getEmail());
        helper.setSubject("Vérifiez votre e-mail");
        helper.setText(
                "<p>Cliquez sur le lien suivant pour vérifier votre compte :</p>" +
                        "<a href='" + verificationLink + "'>Vérifier mon compte</a>" +
                        "<p>Vous pouvez également accéder directement à votre profil en scannant ce QR code :</p>" +
                        "<img src='cid:qrCodeImage' width='200' height='200'/>",
                true
        );

        InputStreamSource imageSource = new ByteArrayResource(qrCodeImage);
        helper.addInline("qrCodeImage", imageSource, "image/png");

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(User user) {
        String token = jwtService.generateToken(user);
        String resetLink = "http://localhost:4200/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("azizchahlaoui7@gmail.com");
        message.setTo(user.getEmail());
        message.setSubject("Réinitialisation de votre mot de passe");
        message.setText("Cliquez sur le lien suivant pour réinitialiser votre mot de passe : " + resetLink);
        mailSender.send(message);
    }

    public void sendReponseEmail(User user, String messageReponse) {
        if (user == null || user.getEmail() == null || user.getEmail().isEmpty()) {
            System.out.println("L'utilisateur n'a pas d'e-mail valide.");
            return;
        }

        System.out.println("Envoi de l'e-mail à : " + user.getEmail());

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Réponse à votre réclamation");
        message.setText("Bonjour, \n\nVotre réclamation a reçu une réponse : \n\n" + messageReponse);

        mailSender.send(message);
        System.out.println("E-mail envoyé avec succès.");
    }


}