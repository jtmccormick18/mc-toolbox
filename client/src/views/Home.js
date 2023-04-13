import React from 'react';

import { Row, Col } from 'react-bootstrap';


function Home() {

    return (
        <Row>
            <Col className={"bg-dark text-light text-center"}>
                <h3>
                    Welcome to the toolbox
                </h3>
            </Col>
            <Col xs={12}>

            </Col>
        </Row>
    );
}

export default Home;
