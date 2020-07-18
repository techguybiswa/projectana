import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import { Card, Col, Row } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFileUploaded: false,
      totalNumberOfMessages: 0,
      mapOfNames: {},
      mapOfDates: {}
    }
  }

  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const allMessage = (e.target.result)
      // console.log(allMessage.replace(/\r/g, "").split(/\n/))
      let formattedMessages = allMessage.replace(/\r/g, "").split(/\n/)
      console.log("total length ", formattedMessages.length)
      this.fetchAllUniqueNames(formattedMessages)
      // console.log(allMessage.replace(/\r/g, "").split(/\n/).length)
    };
    reader.readAsText(e.target.files[0])
  }

  fetchAllUniqueNames = (allMessage) => {
    this.setState({
      isFileUploaded: true

    })
    let mapOfNames = {}
    let mapOfDates = {}
    let sum = 0;
    for (let i = 0; i < allMessage.length; i++) {
      let firstIndex = allMessage[i].indexOf(" - ")
      let lastIndex = allMessage[i].indexOf(": ")
      let indexOfComma = allMessage[i].indexOf(",")
      if (firstIndex < lastIndex) {
        let name = allMessage[i].slice(firstIndex, lastIndex)
        let date = allMessage[i].slice(0, indexOfComma)
        let dateValidationRegex = "^[0-9a-zA-Z/ -]+$"
        let isDateValid = date.match(dateValidationRegex)
        if (date.length && isDateValid) {
          if (date in mapOfDates) {
            mapOfDates[date] += 1
          } else {
            mapOfDates[date] = 1
          }
        }
        // console.log(name)
        if (name.length) {
          if (name in mapOfNames) {
            mapOfNames[name] += 1;
          } else {
            mapOfNames[name] = 1

          }
        }
      }
    }
    Object.keys(mapOfNames).map(eachName => {
      let text = eachName;
      if (text.indexOf("changed the subject from") != -1 || text.indexOf("created group") != -1) {
        delete mapOfNames[eachName]
      } else {
        sum += mapOfNames[eachName];
      }
    })
    console.log(mapOfNames)
    console.log(mapOfDates)

    console.log("SUM ", sum)
    this.setState({
      totalNumberOfMessages: sum,
      mapOfDates,
    })



  }

  render = () => {

    return (<div>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">Project Ana</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ margin: '50px', padding: "50px", backgroundColor: "white" }}>
          {!this.state.isFileUploaded && (
            <Row>
            <Col span="8">
              <Card title="How to use whats app analyzer (or Watch the video)"  style={{ width: "90%" }}>
                <p><b>Step 1:</b> Open a whats app chat and click on the 3 dots on top right</p>
                <p><b>Step 2:</b> Click on "More"</p>
                <p><b>Step 3:</b> Click on "Export Chat"</p>
                <p><b>Step 4:</b> Click on "WITHOUT MEDIA". You will see an "Initializing" page. Wait for a few seconds.</p>
                <p><b>Step 5:</b> Send the exported chat via email to your mail.</p>
                <p><b>Step 6:</b> Download the exported chat as TXT from your email in your computer and upload here.</p>
              </Card>
            
        </Col>
        <Col span="8">

              <iframe width="90%" height="600" src="https://www.youtube.com/embed/0B7vD1Ys17Y" frameborder="10" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </Col>

          <Col span="8">
          <h2 >Upload your Whats App Text file <input type="file" onChange={(e) => this.showFile(e)} /></h2>
          </Col>
          </Row>
          )}

        </Content>
        <Footer style={{ textAlign: 'center' }}> @techguybiswa ©2020 Created by Biswarup Banerjee</Footer>
      </Layout>
    </div>
    )
  }
}

export default App;