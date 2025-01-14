import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./about.css";

const About = () => {
  return (
    <div className="section-about">
      <div className="about-container">
        <div className="about-header">
          <span className="title-section">Góc quảng cáo</span>
        </div>
        <div className="about-content">
          <div className="content-left">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/gi-C_h8-Lmk?si=lk7l_sYTXJgwUnYA"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
          <div className="content-right">
            <p>
              Video này sẽ giúp bạn hiểu rõ hơn về sỏi đường mật, một tình trạng
              bệnh lý khá phổ biến mà nhiều người gặp phải. Sỏi đường mật hình
              thành khi có sự tích tụ của các chất như cholesterol hoặc
              bilirubin trong mật, dẫn đến việc tạo ra các viên sỏi trong túi
              mật hoặc ống mật. Trong video, chúng tôi sẽ trình bày về các
              nguyên nhân chính gây ra sỏi đường mật, bao gồm chế độ ăn uống
              không lành mạnh, thừa cân, và một số yếu tố di truyền. Ngoài ra,
              video cũng giới thiệu các triệu chứng thường gặp của bệnh, như đau
              bụng, buồn nôn và vàng da, đồng thời giải thích rõ các phương pháp
              chẩn đoán, từ xét nghiệm máu đến siêu âm bụng. Các phương pháp
              điều trị cũng được đề cập, từ sử dụng thuốc đến phẫu thuật cắt túi
              mật, giúp người bệnh có cái nhìn tổng quan và chuẩn bị tốt hơn khi
              phải đối mặt với tình trạng này. Video cũng đưa ra các lời khuyên
              về cách phòng ngừa và duy trì một lối sống lành mạnh để giảm nguy
              cơ mắc bệnh sỏi đường mật.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
