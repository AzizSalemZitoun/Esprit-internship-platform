package tn.esprit.offres;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class OffresApplication {

	public static void main(String[] args) {
		SpringApplication.run(OffresApplication.class, args);
	}

}
