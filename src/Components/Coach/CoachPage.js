import React from "react";
import { Card, Typography, Image, Row, Col } from "antd";

const CoachPage = ({
  //user,
  coachs,
  users,
}) => {
  return (
    <React.Fragment>
      <Typography>
        <h3>Тренеры</h3>
      </Typography>
      <Card>
        {coachs.map(({ userId, imageLink, description }) => {
          const userCoach = users.find((user) => user.id === userId);
          return (
            <div className="Coach" key={userId}>
              <Card>
                <Row>
                  <Col span={12}>
                    <Image src={imageLink} />
                  </Col>
                  <Col span={12}>
                    <Card>
                      <Typography>
                        <h3 className="CoachName">
                          {userCoach ? userCoach.fio : ""}
                        </h3>
                      </Typography>
                      <Card style={{ fontSize: "18px" }}>
                        {description} <br />
                      </Card>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </div>
          );
        })}
      </Card>
    </React.Fragment>
  );
};
export default CoachPage;
