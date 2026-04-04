package com.tradeboot.api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, String otp) {
        // ALWAYS log OTP to the console as a fallback for developers
        logger.info("====================================");
        logger.info("DEVELOPMENT OTP FOR " + to + ": " + otp);
        logger.info("====================================");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Your TradeBoot AI Verification Code");
            
            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #fff; max-width: 500px; border-radius: 10px;'>" +
                                 "<h2>Verify your email</h2>" +
                                 "<p>Your 6-digit TradeBoot AI verification code is:</p>" +
                                 "<h1 style='color: #34d399; letter-spacing: 5px; font-size: 32px;'>" + otp + "</h1>" +
                                 "<p>This code will expire in 10 minutes.</p>" +
                                 "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("OTP email sent successfully to " + to);
        } catch (Exception e) {
            logger.warning("Failed to send OTP via email. (Check SMTP configurations in application.properties). OTP is logged above. Error: " + e.getMessage());
        }
    }
}
