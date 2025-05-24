package com.esprit.GestionUtilisateur.Controller;

import com.esprit.GestionUtilisateur.ServiceAPI.CopyleaksService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/plagiarism")
public class CopyleaksController {

    private final CopyleaksService copyleaksService;

    public CopyleaksController(CopyleaksService copyleaksService) {
        this.copyleaksService = copyleaksService;
    }

    @PostMapping("/check")
    public String checkPlagiarism(@RequestBody String text) {
        return copyleaksService.submitPlagiarismCheck(text);
    }
    @PostMapping("/callback")
    public void receiveResults(@RequestBody String result) {
        System.out.println("Résultats reçus : " + result);
    }
}
