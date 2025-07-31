package com.danang_auction.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

  private final JavaMailSender mailSender;

  @Value("${spring.mail.username}")
  private String from;

  // 1. Gửi OTP
  public void sendOtpEmail(String to, String otp) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(from);
      helper.setTo(to);
      helper.setSubject("Xác minh OTP - Đặt lại mật khẩu tài khoản Đấu giá");

      String htmlContent = """
          <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; font-size: 16px; color: #333; background-color: #f9f9f9; padding: 24px; border-radius: 8px; border: 1px solid #ddd;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #0052cc;">HỆ THỐNG ĐẤU GIÁ ĐÀ NẴNG</h2>
              <p style="margin: 0; font-size: 15px; color: #666;">Xác thực yêu cầu đặt lại mật khẩu</p>
            </div>

            <p>Chào bạn,</p>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản đấu giá của bạn.</p>
            <p>Vui lòng sử dụng mã OTP bên dưới để xác minh yêu cầu:</p>

            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; padding: 12px 24px; font-size: 28px; font-weight: bold; letter-spacing: 4px; background-color: #e0ecff; color: #0052cc; border-radius: 6px;">
                %s
              </span>
            </div>

            <p style="text-align: center; font-size: 15px; color: #777;">Mã OTP này có hiệu lực trong vòng <strong>10 phút</strong>.</p>

            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.</p>

            <hr style="margin: 30px 0;">

            <div style="font-size: 14px; color: #888; text-align: center;">
              <p>Hệ thống Đấu giá Đà Nẵng</p>
              <p>Website: <a href="https://danang-auction.vn" target="_blank">danang-auction.vn</a> | Email: support@danang-auction.vn</p>
            </div>
          </div>
          """
          .formatted(otp);

      helper.setText(htmlContent, true);

      mailSender.send(message);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }

  // 2. Gửi yêu cầu xác minh lại CCCD
  public void sendIdentityVerifyRequest(String to, String reason) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(from);
      helper.setTo(to);
      helper.setSubject("Yêu cầu xác minh lại CCCD - Hệ thống Đấu giá Đà Nẵng");

      String htmlContent = """
          <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; font-size: 16px; color: #333; background-color: #f9f9f9; padding: 24px; border-radius: 8px; border: 1px solid #ddd;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #0052cc;">HỆ THỐNG ĐẤU GIÁ ĐÀ NẴNG</h2>
              <p style="margin: 0; font-size: 15px; color: #666;">Yêu cầu xác minh lại giấy tờ tùy thân</p>
            </div>

            <p>Chào bạn,</p>
            <p>Chúng tôi đã xem xét thông tin xác minh của bạn và nhận thấy có vấn đề cần bạn cung cấp lại ảnh CCCD/CMND.</p>
            <p><strong>Lý do:</strong> <em>%s</em></p>

            <p>Vui lòng truy cập vào hệ thống và tải lên ảnh mới rõ nét, đúng định dạng để được xác minh lại.</p>

            <p style="margin-top: 24px;">Nếu bạn có thắc mắc, hãy liên hệ với bộ phận hỗ trợ của chúng tôi để được giải đáp.</p>

            <hr style="margin: 30px 0;">

            <div style="font-size: 14px; color: #888; text-align: center;">
              <p>Hệ thống Đấu giá Đà Nẵng</p>
              <p>Website: <a href="https://danang-auction.vn" target="_blank">danang-auction.vn</a> | Email: support@danang-auction.vn</p>
            </div>
          </div>
          """
          .formatted(reason);

      helper.setText(htmlContent, true);

      mailSender.send(message);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }

  // 3. Gửi email xác nhận duyệt tài sản thành công
  public void sendUserVerificationSuccess(String to) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(from);
      helper.setTo(to);
      helper.setSubject("Tài sản đã được duyệt - Hệ thống Đấu giá Đà Nẵng");

      String htmlContent = """
          <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; font-size: 16px; color: #333; background-color: #f0fff0; padding: 24px; border-radius: 8px; border: 1px solid #ccc;">
            <h2 style="text-align: center; color: #2e7d32;"> Tài sản của bạn đã được duyệt!</h2>
            <p>Chúc mừng! Tài sản bạn gửi đã được hệ thống kiểm duyệt thành công.</p>
            <p>Chúng tôi sẽ cập nhật và đưa vào danh sách phiên đấu giá sắp tới.</p>

            <p style="margin-top: 24px;">Nếu bạn có thắc mắc, hãy liên hệ bộ phận hỗ trợ để được giải đáp.</p>

            <hr style="margin: 30px 0;">
            <div style="font-size: 14px; color: #888; text-align: center;">
              <p>Hệ thống Đấu giá Đà Nẵng</p>
              <p>Website: <a href="https://danang-auction.vn">danang-auction.vn</a> | Email: support@danang-auction.vn</p>
            </div>
          </div>
          """;

      helper.setText(htmlContent, true);
      mailSender.send(message);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }

  // 4. Gửi email từ chối tài sản
  public void sendUserRejectionNotice(String to, String reason) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(from);
      helper.setTo(to);
      helper.setSubject("Tài sản bị từ chối - Hệ thống Đấu giá Đà Nẵng");

      String htmlContent = """
          <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; font-size: 16px; color: #333; background-color: #fff0f0; padding: 24px; border-radius: 8px; border: 1px solid #ccc;">
            <h2 style="text-align: center; color: #c62828;"> Tài sản của bạn chưa được duyệt</h2>
            <p>Chúng tôi rất tiếc phải thông báo rằng tài sản bạn gửi đã bị từ chối duyệt.</p>
            <p><strong>Lý do từ chối:</strong> <em>%s</em></p>

            <p>Vui lòng chỉnh sửa lại thông tin tài sản và gửi lại để được xét duyệt.</p>

            <hr style="margin: 30px 0;">
            <div style="font-size: 14px; color: #888; text-align: center;">
              <p>Hệ thống Đấu giá Đà Nẵng</p>
              <p>Website: <a href="https://danang-auction.vn">danang-auction.vn</a> | Email: support@danang-auction.vn</p>
            </div>
          </div>
          """
          .formatted(reason);

      helper.setText(htmlContent, true);
      mailSender.send(message);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }

  // 5. Gửi email thông báo xác minh đăng ký tài khoản thành công
  public void sendRegistrationVerificationSuccess(String to) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(from);
      helper.setTo(to);
      helper.setSubject("Xác minh tài khoản thành công - Hệ thống Đấu giá Đà Nẵng");

      String htmlContent = """
          <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; font-size: 16px; color: #333; background-color: #f0fff0; padding: 24px; border-radius: 8px; border: 1px solid #ccc;">
            <h2 style="text-align: center; color: #2e7d32;"> Chúc mừng! Tài khoản của bạn đã được xác minh thành công</h2>
            <p>Xin chào,</p>
            <p>Bạn đã hoàn tất quá trình xác minh đăng ký tài khoản đấu giá trên hệ thống <strong>Đấu giá Đà Nẵng</strong>.</p>
            <p>Bây giờ bạn có thể đăng nhập và bắt đầu tham gia các phiên đấu giá trên hệ thống.</p>

            <p style="margin-top: 24px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ để được giải đáp.</p>

            <hr style="margin: 30px 0;">
            <div style="font-size: 14px; color: #888; text-align: center;">
              <p>Hệ thống Đấu giá Đà Nẵng</p>
              <p>Website: <a href="https://danang-auction.vn" target="_blank">danang-auction.vn</a> | Email: support@danang-auction.vn</p>
            </div>
          </div>
          """;

      helper.setText(htmlContent, true);
      mailSender.send(message);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }

  public void sendAuctionWinnerEmailWithQR(String to, String assetName, double finalPrice, String qrLink,
      String depositPageUrl) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(from);
      helper.setTo(to);
      helper.setSubject("Chúc mừng bạn đã thắng đấu giá - Hệ thống Đấu giá Đà Nẵng");

      String htmlContent = """
          <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; font-size: 16px; color: #333; background-color: #f0fff0; padding: 24px; border-radius: 8px; border: 1px solid #ccc;">
            <h2 style="text-align: center; color: #2e7d32;">🎉 Chúc mừng bạn đã đấu giá thành công! 🎉</h2>
            <p>Xin chào,</p>
            <p>Bạn vừa chiến thắng phiên đấu giá: <strong>%s</strong></p>
            <p>Số tiền cần thanh toán (đã trừ tiền cọc): <strong>%,.0f VNĐ</strong></p>

            <p>Vui lòng thanh toán bằng cách quét QR bên dưới hoặc truy cập vào <a href="%s">trang nạp tiền</a>:</p>

            <div style="text-align:center; margin:20px 0;">
              <img src="%s" alt="QR Thanh toán" style="width:200px; height:200px;" />
            </div>

            <p style="text-align:center; font-size:14px; color:#777;">Sau khi thanh toán thành công, hệ thống sẽ tự động cộng tiền và xác nhận giao dịch.</p>

            <hr style="margin: 30px 0;">
            <div style="font-size: 14px; color: #888; text-align: center;">
              <p>Hệ thống Đấu giá Đà Nẵng</p>
              <p>Website: <a href="https://danang-auction.vn">danang-auction.vn</a> | Email: support@danang-auction.vn</p>
            </div>
          </div>
          """
          .formatted(assetName, finalPrice, depositPageUrl, qrLink);

      helper.setText(htmlContent, true);
      mailSender.send(message);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }
}