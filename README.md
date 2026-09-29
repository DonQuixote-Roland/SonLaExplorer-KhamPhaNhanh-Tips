# Sơn La Explorer — Final Prototype

Website du lịch Sơn La phiên bản hoàn thiện theo hướng trải nghiệm khám phá.

## Có gì trong bản này?
- Tìm kiếm tương tác: gợi ý theo địa điểm, địa bàn, hoạt động và lễ hội; lịch sử tìm kiếm; phím ↑/↓/Enter.
- 24 hồ sơ địa điểm, mỗi địa điểm có trang riêng với tổng quan, lịch sử/phát triển, trải nghiệm, lịch trình, ảnh, gallery và bản đồ.
- Bản đồ Google Maps liên kết theo từng địa điểm.
- Bộ lọc theo địa bàn, mùa, hoạt động và loại hình.
- Khối thời tiết Sơn La: nhiệt độ, độ ẩm, cảm giác, gió và dự báo 5 ngày; dữ liệu Open-Meteo.
- Lễ hội/sự kiện gần nhất, có trạng thái và nguồn.
- Góc ảnh Sơn La + lightbox xem ảnh lớn.
- Trình tạo lịch trình 1–3 ngày theo khu vực.
- Gióng Mini AI chạy cục bộ: nhận diện địa điểm, ý định, ngữ cảnh câu hỏi; hỗ trợ lịch sử, hoạt động, mùa, vị trí, văn hóa, ảnh, lịch trình, thời tiết, sự kiện và so sánh. Không cần API key.
- Ảnh linh vật Gióng do người dùng cung cấp.

## Ảnh
Bản prototype dùng một số URL ảnh tham khảo từ Sforum, Pha Luông Travel, Asia King Travel, MIA.vn và các nguồn trước đó. Các URL và credit được giữ trong dữ liệu. Trước khi công bố thương mại, cần xác minh quyền sử dụng từng ảnh hoặc thay bằng ảnh tự chụp/ảnh được cấp phép.

## Dữ liệu
Một số dữ liệu điểm du lịch dựa trên Cổng dữ liệu mở tỉnh Sơn La và các nguồn du lịch được ghi trực tiếp trên trang. Các thông tin sự kiện có thể thay đổi; trang luôn ghi nguồn để kiểm tra lại.

## Chạy
Mở `index.html`. Nếu trình duyệt chặn một số request do chính sách local file, nên chạy thư mục bằng một static server đơn giản.
