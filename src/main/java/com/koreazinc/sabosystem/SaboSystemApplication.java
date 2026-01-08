package com.koreazinc.sabosystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SaboSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SaboSystemApplication.class, args);
    }

}
