import React from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import Footer from './Common/Footer';
import Header from './CustomPage/Header';
import { setDocumentTitle } from "../utils/general";

class BlankPage extends React.Component {

  componentDidMount() {
    setDocumentTitle('Blank');
  }
  render() {
    return (
      <div className="custom-page">
        <Container>
          <Header pageTitle="Blank Page" />

          <Card>
            <CardBody>
              <p>This component can be used as a template for creating new pages.</p>
            </CardBody>
          </Card>

        </Container>

        <Footer />
      </div>
    );
  }
}

export default BlankPage;
