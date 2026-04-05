package com.tradeboot.api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, String otp) {
        log.info("====================================");
        log.info("PREPARING OTP FOR {}: {}", to, otp);
        log.info("====================================");

        try {
            log.debug("Initializing MimeMessage...");
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject("Your TradeBoot AI Verification Code");
            
            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #fff; max-width: 500px; border-radius: 10px;'>" +
                                 "<h2>Verify your email</h2>" +
                                 "<p>Your 6-digit TradeBoot AI verification code is:</p>" +
                                 "<h1 style='color: #34d399; letter-spacing: 5px; font-size: 32px;'>" + otp + "</h1>" +
                                 "<p>This code will expire in 10 minutes.</p>" +
                                 "</div>";
            
            helper.setText(htmlContent, true);
            
            log.debug("Dispatching email via JavaMailSender...");
            mailSender.send(message);
            
            log.info("OTP email successfully delivered to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to construct MimeMessage for OTP email. Error: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Critical failure while sending OTP email to {}. Ensure Gmail App Passwords and SMTP properties are correctly configured. Error: {}", to, e.getMessage(), e);
        }
    }
}
